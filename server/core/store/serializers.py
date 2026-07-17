from django.contrib.auth.models import User

from .services.cart_service import CartService
from .models import Category,OrderItem,Product,Order,UserProfile,Wishlist, Cart, CartItem
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from datetime import timedelta
from django.utils import timezone



class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Category
    fields = "__all__"
    
    
    
class ProductSerializer(serializers.ModelSerializer):
  category= CategorySerializer(read_only=True)
  category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )


  is_new = serializers.SerializerMethodField()
  is_in_wishlist= serializers.SerializerMethodField()
  
  
  def get_is_new(self, obj):
    return obj.created_at >= timezone.now() - timedelta(days=3)
  
  
  def get_is_in_wishlist(self, obj):
    request = self.context.get("request")
    
    if not request or not request.user.is_authenticated:
      return False
    
    return obj.wishlisted_by.filter(
      user = request.user
    ).exists()
    
  
  class Meta:
    model=Product
    fields= ['id', 'category', 'category_id', 'name', 'slug', 'description', 'price', 'image', 'created_at', 'stock', 'is_active', 'featured', 'is_new', "is_in_wishlist"]
    

    
    
class UserProfileSerializer(serializers.ModelSerializer):
  
  class Meta:
    model= UserProfile
    fields="__all__"
      
  
  
class UserSerializer(serializers.ModelSerializer):
  profile= UserProfileSerializer(read_only=True)
  password= serializers.CharField(write_only=True)
  email= serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message="Registration could not be completed with the provided details.")])
  username= serializers.CharField(validators=[UniqueValidator(queryset=User.objects.all(), message="Registration could not be completed with the provided details")])
  is_staff= serializers.BooleanField(required=False)
  
  
  class Meta:
    model = User
    fields= ['id', 'username', 'email', "password", 'profile', 'is_staff']
    
    
 
  
  def update(self, instance, validated_data):
    
    instance.username = validated_data.get("username", instance.username)
    instance.email = validated_data.get("email", instance.email)
    
    
    if "is_staff" in validated_data:
      instance.is_staff = validated_data["is_staff"]
      
      
    instance.save()
    return instance
    
class OrderItemSerializer(serializers.ModelSerializer):
  product = ProductSerializer(read_only=True)
  
  class Meta:
    model = OrderItem
    fields= "__all__"
    
    
    
class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True, read_only=True)
  user= UserSerializer(read_only=True)
  
  class Meta: 
    model= Order
    fields= "__all__"
    
    
    
class WishListSerializer(serializers.ModelSerializer):
  product = ProductSerializer(read_only=True)
  product_id = serializers.PrimaryKeyRelatedField(
    queryset= Product.objects.all(),
    source="product",
    write_only= True,
  )
  
  class Meta:
    model = Wishlist
    fields = ["id", "product", "product_id", "created_at"]
    
    
class CartItemSerializer(serializers.ModelSerializer):
  product = ProductSerializer(read_only= True)
  product_id = serializers.PrimaryKeyRelatedField(queryset= Product.objects.all(), source="product", write_only= True)
  
  subtotal = serializers.SerializerMethodField()

  class Meta:
    model = CartItem
    fields = ["id", "product", "product_id", "quantity", "subtotal"]
  
  def get_subtotal(self, obj):
    return obj.product.price * obj.quantity
  
  
class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(read_only=True, many=True)
  subtotal = serializers.SerializerMethodField()
  total_items = serializers.SerializerMethodField()
  shipping = serializers.SerializerMethodField()
  grand_total = serializers.SerializerMethodField()
  
  
  
  class Meta:
        model = Cart
        fields = [
            "id", 
            "items", 
            "subtotal", 
            "total_items", 
            "shipping", 
            "grand_total", 
            "created_at", 
            "updated_at"
        ]
  
  def get_subtotal(self, obj):
      return CartService.calculate_subtotal(obj)
    
  def get_total_items(self, obj):
      return CartService.calculate_total_items(obj)
    
  def get_shipping(self, obj):
      return CartService.calculate_shipping(obj)
    
  def get_grand_total(self, obj):
      return CartService.calculate_grand_total(obj)