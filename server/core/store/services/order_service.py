from decimal import Decimal
from ..models import Cart,  Order, OrderItem


def create_order(user, validated_data):
  cart= Cart.objects.get(user= user)
  subtotal = Decimal("0.00")
  order = Order.objects.create(user= user, shipping_address= validated_data.get("shipping_address", total_price=Decimal("0.00")))
  
  
  for item in cart.objects.all():
    order= OrderItem.objects.create(
      order=order,
      product= item.product,
      quantity= item.quantity,
      price= item.product.price,
    )
    
    subtotal += item.product.price * item.quantity
    
  shipping = Decimal("0.00")
  
  if subtotal < Decimal("150000"):
    shipping = Decimal("3500")
  
  order.total_Price =  subtotal + shipping
  
  order.save()
  cart.items.all().delete()
  
  return order