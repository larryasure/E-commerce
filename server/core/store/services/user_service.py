
from django.db import transaction
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from store.emails import send_verification_email


User = get_user_model()

class UserService:
  @staticmethod
  @transaction.atomic
  
  def create_user(data):
    
    user = User.objects.create_user(
      username= data["username"],
      email = data["email"],
      password=data["password"],
    )
    
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_url = (
      f"http://localhost:3000/verify-email/{uid}/{token}/"
    )
    send_verification_email(user, verification_url)
    
    return user