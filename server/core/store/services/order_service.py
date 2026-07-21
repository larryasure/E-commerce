from decimal import Decimal 
from ..models import Cart, Order, OrderItem


def create_order(user, validated_data):
  cart = Cart.objects.get(user=user)
  subtotal= Decimal("0.00")
  order = Order.objects.create(user=user,
                              shipping_address= validated_data.get("shipping_address", ""),
                              total_price = Decimal("0.00"))
  
  for item in cart.items.all():
    item_instance = OrderItem.objects.create(
      order=order,
      product=item.product,
      quantity = item.quantity,
      price= item.product.price
    )
    subtotal += Decimal(str(item.product.price)) * item.quantity
    
    
    
  shipping = Decimal("0.00")
  if subtotal < Decimal("150000"):
    shipping = 3500
    
  
  order.total_price = subtotal + shipping 
  order.save()
  
  
  print("=" * 50)
  print("SUBTOTAL:", subtotal)
  print("SHIPPING:", shipping)
  print("TOTAL BEFORE RETURN:", order.total_price)
  print("=" * 50)
  
  cart.items.all().delete()
  
  return order
  
