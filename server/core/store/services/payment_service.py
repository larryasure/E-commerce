import logging
from django.conf import settings
from django.db import transaction as db_transaction
from django.utils import timezone
import requests
from rest_framework.exceptions import ValidationError
from ..emails import send_order_confirmation_email
from ..models import Order
from decimal import Decimal

logger = logging.getLogger(__name__)

class PaymentService:
  BASE_URL = settings.FLUTTERWAVE_BASE_URL.rstrip("/")
  
  
  @staticmethod
  def _headers():
    return {
      "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
      "Content-Type": "application/json",
    }
    
    
  @staticmethod
  def initialize_payment(order):
    tx_ref = f"Order-{order.order_number}-{int(timezone.now().timestamp())}"
    
    payload = {
      "tx_ref" : tx_ref,
      "amount": str(order.total_price),
      "currency": "NGN",
      "redirect_url": settings.FLUTTERWAVE_REDIRECT_URL,
      "customer": {
        "email":order.user.email,
        "name": order.user.get_full_name() or order.user.username,
      },
      
      "customizations":{
        "title": "Prime Pack",
        "description": f"Payment for Order{order.order_number}",
      } ,
    }
    
    response = requests.post(
      f"{PaymentService.BASE_URL}/payments",
      json=payload,
      headers= PaymentService._headers(),
      timeout=15
    )
    
    data = response.json()
    
    if response.status_code != 200:
      raise ValidationError(data.get("message", "Unable to initialize payment!"))
    
    order.tx_ref = tx_ref
    order.save(update_fields=["tx_ref"])

    return data["data"]["link"]
  
  
  
  @staticmethod
  def verify_payment(transaction_id):
    response = requests.get(
      f"{PaymentService.BASE_URL}/transactions/{transaction_id}/verify",
      headers=PaymentService._headers(),
      timeout=15
    )    
    
    try:
     data =  response.json()
    except ValueError:
      logger.error(
        "Flutterwave verify returned non-json (%s): %s",
        response.status_code, response.text[:500],
      )
      raise ValidationError("Unable to verify payment -  bad response from flutterwave")
    
    if response.status_code != 200 or data.get("status") != "success":
      raise ValidationError(data.get("message", "Unable to verify payment!"))
    
    return data["data"]
  
  
  @staticmethod
  def complete_payment(order, transaction_id):
    payment = PaymentService.verify_payment(transaction_id)
    
    with db_transaction.atomic():
      order = Order.objects.select_for_update().get(pk=order.pk)
      
      if order.payment_status == "PAID":
        return order
      
      
      is_valid = (
        payment["status"] == "successful" 
        and payment["tx_ref"] == order.tx_ref 
        and Decimal(str(payment["amount"]))  == Decimal(str(order.total_price))
        and payment["currency"].upper() == "NGN"
      )
      
      if not is_valid: 
        logger.warning("Verification mismatched for order %s: payment=%s | expected tx_ref=%s amount=%s currency=NGN", order.order_number, payment, order.tx_ref, order.total_price)
        order.payment_status = "FAILED"
        order.save(update_fields=["payment_status"])
        raise ValidationError("Payment could not be verified for this order!")
      
      
      order.payment_status = "PAID"
      order.payment_intent_id = str(payment["id"])
      order.save(update_fields = ["payment_status", "payment_intent_id"])
      just_completed= True 
      
      if just_completed:
          send_order_confirmation_email(order.user, order)
      
    return order 
      
      
      
      
    