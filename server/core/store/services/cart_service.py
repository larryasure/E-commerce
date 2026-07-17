
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import  ValidationError

from ..models import Cart, CartItem, Product


class CartService:
  
  @staticmethod
  def get_cart(user):
    cart, created = Cart.objects.get_or_create(user= user)
    
    return cart
    
  
  
  @staticmethod
  def get_cart_item(user, item_id):
    item = get_object_or_404(CartItem, id= item_id, cart__user=user,)
    
    return item 
  
  

  @staticmethod
  @transaction.atomic
  def add_item(user, product_id, quantity=1):
    product = get_object_or_404(Product, id=product_id, is_active= True)
    
    if quantity < 1:
      raise ValidationError("Quantity must be at least 1")
    
    if quantity > product.stock:
       raise ValidationError({"detail": f"Only {item.product.stock} item(s) available"})


    cart = CartService.get_cart(user)
    
    item , created = CartItem.objects.get_or_create(cart = cart, product=product, defaults={
      "quantity" : quantity
    })
    
    
    if not created:
      new_quantity = item.quantity + quantity
      
      if new_quantity > product.stock:
        raise ValidationError({"detail": f"Only {item.product.stock} item(s) available in stock"})
      
      
      item.quantity = new_quantity
      item.save()
      
    return cart
  
  @staticmethod
  def increase_quantity(user , item_id):
    item = CartService.get_cart_item(user , item_id)
    
    if item.quantity + 1 > item.product.stock:
      raise ValidationError({"detail": f"Only {item.product.stock} item(s) available in stock"})

    
    
    item.quantity += 1
    item.save()
    
    return item.cart
  
  
  
  @staticmethod
  def decrease_quantity(user, item_id):
    item = CartService.get_cart_item(user , item_id)
    if item.quantity > 1:
      item.quantity -= 1
      item.save()
    else:
      item.delete()
    return CartService.get_cart(user)
  
      

  @staticmethod
  def remove_item(user, item_id):
    item = CartService.get_cart_item(user, item_id)
    
    cart = item.cart
    item.delete()
    return cart
  
  
  @staticmethod
  def clear_cart(user):
    cart = CartService.get_cart(user)
    
    cart.items.all().delete()
    
    return cart
  
  @staticmethod
  def calculate_subtotal(cart):
    return sum(item.product.price * item.quantity 
               for item in cart.items.all())
    
  @staticmethod
  def calculate_total_items(cart):
    return sum(item.quantity
               for item in cart.items.all())
    
  @staticmethod
  def calculate_shipping(cart):
    subtotal = CartService.calculate_subtotal(cart)
    total_items = CartService.calculate_total_items(cart)
    
    if total_items > 0 and subtotal < 15000:
      return 3500
    
    return 0
  
  @staticmethod
  def calculate_grand_total(cart):
    subtotal = CartService.calculate_subtotal(cart)
    shipping = CartService.calculate_shipping(cart)
    
    return subtotal + shipping 
    
  

  

 