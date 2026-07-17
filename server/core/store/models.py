
from tabnanny import verbose
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver 

# Create your models here.


class Category(models.Model):
  name= models.CharField(max_length=200, unique=True)
  slug = models.SlugField(unique=True)
  stock= models.IntegerField(default=0)
  image= models.ImageField(upload_to="categories/", null=True, blank=True)
  
  
  def __str__(self):
    return self.name
  
  class Meta:
    verbose_name = "Categorie"
    
  
  
class Product(models.Model):
  category= models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
  name=models.CharField(max_length=200)
  slug= models.SlugField(unique=True)
  description = models.TextField(blank=True)
  price= models.DecimalField(max_digits=10, decimal_places=2)
  image= models.ImageField(upload_to="products/", blank=True , null=True)
  created_at= models.DateTimeField(auto_now_add=True)
  stock=models.IntegerField(default=0)
  is_active=models.BooleanField(default=True)
  featured = models.BooleanField(default=False,
                                 help_text="Display this product on the homepage of the featured product")
  
    
  def __str__(self):
    return self.name
  
  
  class Meta: 
    ordering = ["-created_at"]

class UserProfile(models.Model):
  user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
  avatar=models.ImageField(upload_to="avatars/", blank=True, null=True, default='avatars/default-avatar.png')
  bio= models.TextField(blank=True)
  phone_number= models.CharField(max_length=21, blank=True)
  address= models.TextField(blank=True)
  is_verified= models.BooleanField(default=False)
  customer_id = models.CharField(max_length=20, editable=False, blank=True, unique=False)
  
  
  def __str__(self):
    return f"{self.user.username}'s Profile"
  
  
class Order(models.Model):
  
  # Payment Status
  PAYMENT_CHOICES= [
    ("PENDING", 'pending'),
    ("PAID", 'paid'),
    ("FAILED", 'failed'),
  ]
  
  # Shipping tracking 
  
  STATUS_CHOICES = [
    ("PROCESSING", 'processing'),
    ("SHIPPED", 'shipped'),
    ("DELIVERED", 'delivered'),
    ("CANCELED", 'canceled'),
    
  ]
  
  user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="orders", null=True)
  total_Price= models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
  
  
  payment_status= models.CharField(max_length=100, choices=PAYMENT_CHOICES, default='PENDING')
  order_status= models.CharField(max_length=200, choices=STATUS_CHOICES, default="PROCESSING")
  payment_intent_id= models.CharField(max_length=255, null=True, blank=True)
  
  
  shipping_address= models.TextField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at= models.DateTimeField(auto_now=True)
  order_number= models.CharField(unique=False, max_length=20, editable=False, blank=True)
  
  
  import random
  def save(self, *args, **kwargs):
    if not self.order_number:
      self.order_number= f"PP{self.random.randint(10000000 - 99999999)}"
    super().save(*args , **kwargs)
   
  
  def __str__(self):
    return f" #{self.id} by {self.user.username if self.user else 'Guest'}"
  
  
  
class OrderItem(models.Model):
  order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE )
  product=models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity= models.PositiveIntegerField(default=1)
  price = models.DecimalField(max_digits=10, decimal_places=2)
  
  def __str__(self):
      return f"{self.quantity} x {self.product.name if self.product else 'Deleted Product'} (Order #{self.order.id})"
  
class Wishlist(models.Model):
  
  user = models.ForeignKey(
        User,
        related_name="wishlist_items",
        on_delete=models.CASCADE
    )

  product = models.ForeignKey(
        Product,
        related_name="wishlisted_by",
        on_delete=models.CASCADE
    )
    
  created_at = models.DateTimeField(auto_now_add=True)  
  
  class Meta: 
      unique_together= ("user", "product")
      ordering = ["id"]
    
  def __str__(self):
    return f"{self.user.username} 💗 {self.product.name}"
    

class Cart(models.Model):
  user = models.OneToOneField(User, related_name="cart", on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return f"{self.user.username}'s Cart"
  
  
class CartItem(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity= models.PositiveIntegerField()
  
  class Meta:
    unique_together= ("cart", "product")
    
  def __str__(self):
    return f"{self.quantity} x {self.product.name}"
  
    
@receiver(post_save, sender=User) 
def create_user_profile(sender, instance, created, **kwargs):
  if created:
    UserProfile.objects.create(user=instance)




@receiver(post_save, sender=User)
def save_user_profile(sender, instance , **kwargs):
  instance.profile.save()


 