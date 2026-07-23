import requests
from django.conf import settings
from django.db import transaction
from rest_framework.exceptions import ValidationError

from .. models import Order


class PaymentService():
  BASE_URL = settings.FLUTTERWAVE_BASE_URL
  
  @staticmethod
  def _headers():
    return {
      "Authorization" : f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
      "Content-Type": "application/json",
    }
    
  
  
  
  @staticmethod
  def initialize_payment(order):
    # Initialize payment with flutterwave and return payment link back. 
    print("REDIRECT URL:", settings.FLUTTERWAVE_REDIRECT_URL)
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
      f"{PaymentService.BASE_URL}/payments",
      json=payload,
      headers=PaymentService._headers()
    )
    
    data = response.json()
    
    if response.status_code != 200:
      raise ValidationError(
        data.get("message", "Unable to initialize payment")
      )
    return data["data"]["link"]


  @staticmethod
  def verify_payment(transaction_id):
    response = requests.get(
      f"{PaymentService.BASE_URL}transactions/{transaction_id}/verify",
      headers= PaymentService._headers()
    )
    
    data = response.json()
    
    if response.status_code != 200:
      raise ValidationError(
        data.get("message", "Unable to verify payment.")
      )
      
    return data["data"]
  
  
  
  @staticmethod
  def complete_payment(order, transaction_id):
    payment = PaymentService.verify_payment(transaction_id)
    
    if payment["status"] != "successful":
      order.payment_status = "FAILED"
      order.save()
      
      raise ValidationError("Payment not successful!")
    
    order.payment_status = "PAID"
    order.payment_intent_id= str(payment["id"])
    order.save()
    
    
    return order
    
      
    


