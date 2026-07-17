from decimal import Decimal 
from ..models import Cart, Order, OrderItem


def create_order(user, validated_data):
  cart = Order.objects.get(user=user)
  subtotal= Decimal("0.00")
  order = Cart.objects.create(user=user,
                              shipping_address= validated_data.get("shipping_address", ""),
                              total_Price = Decimal("0.00"))
  
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
  
  order.total_Price = subtotal + shipping 
  order.save()
  
  cart.items.all().delete()
  
  return order
  