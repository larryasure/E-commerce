import requests
from django.conf import settings
from django.db import transaction
from rest_framework.exceptions import ValidationError

from .. models import Order


class PaymentService():
  BASE_URL = "https://api.flutterwave.com/v3"
  
  @staticmethod
  def _headers():
    return {
      "Authorization" : f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
      "Content-Type": "application/json",
    }
    
  
  
  
  @staticmethod
  def initialize_payment(order):
    # Initialize payment with flutterwave and return payment link back. 
    payload= {
      "tx_ref": f"Order-{order.order_number}",
      "amount": str(order.total_price),
      "currency": "NGN",
      "redirect_url": settings.FLUTTERWAVE_REDIRECT_URL,
      
      "customer": {
        "email": order.user.email,
        "username": order.user.username,
      },
      
      "customizations": {
        "title": "Prime Pack",
        "description": f"Payment for Order {order.order_number}",
      },
    }

    response = requests.post(
      f"{PaymentService.BASE_URL}payments/",
      json=payload,
      headers=PaymentService._headers()
    )
    
    data = response.json()
    
    if response.status_code != 200:
      raise ValidationError(
        data.get("message", "Unable to initialize payment")
      )
    return data["data"]["link"]



