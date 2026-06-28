from django.contrib.auth.models import User
from .models import Category,OrderItem,Product,Order,UserProfile
from rest_framework import serializers
from rest_framework.validators import UniqueValidator



class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Category
    fields = "__all__"
    
    
    
class ProductSerializer(serializers.ModelSerializer):
  category= CategorySerializer(read_only=True)
  category_id = serializers.PrimaryKeyRelatedField(
    queryset= Category.objects.all(), source= 'category', write_only= True
  )
  
  class Meta:
    model=Product
    fields= ['id', 'category', 'catogory_id', 'name', 'slug', 'description', 'price', 'image', 'created_at', 'stock', 'is_active']
    
    
    
class UserProfileSerializer(serializers.ModelSerializer):
  
  class Meta:
    model= UserProfile
    fields="__all__"
      
  
  
class UserSerializer(serializers.ModelSerializer):
  profile= UserProfileSerializer(read_only=True)
  password= serializers.CharField(write_only=True)
  email= serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message="Registration could not be completed with the provided details.")])
  is_staff= serializers.BooleanField(read_only=True)
  
  
  class Meta:
    model = User
    fields= ['id', 'username', 'email', "password", 'profile', 'is_staff']
    
    
  def create(self, validated_data):
    user = User.objects.create_user(
      username=validated_data['username'],
      email= validated_data['email'],
      password=validated_data['password']
    )
    return user
    
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
    
    
    
    