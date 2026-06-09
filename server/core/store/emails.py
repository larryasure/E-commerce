
from django.core.mail import   EmailMultiAlternatives
from django.template.loader  import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


def send_verification_email(user, verification_url):
  subject= "Verify Your Email Address"
  from_email= settings.EMAIL_HOST_USER
  to_email= user.email
  
  html_content= render_to_string('store/emails/verify_email.html', {
    'username': user.username,
    'verification_url':verification_url
  })
  
  text_content=strip_tags(html_content)
  
  email= EmailMultiAlternatives(subject, text_content, from_email, [to_email])
  email.attach_alternative(html_content, "text/html")
  email.send()
  


def send_welcome_email(user):
  subject="Welcome to PrimePack"
  from_email=settings.EMAIL_HOST_USER
  to_email=user.email
  
  html_content=render_to_string('store/emails/welcome_email.html', {
    'username':user.username,
      'shop_url': 'http://localhost:3000',
  })
  
  
  text_content=strip_tags(html_content)
  
  email= EmailMultiAlternatives(subject, text_content, from_email, [to_email])
  email.attach_alternative(html_content, "text/html")
  email.send()
  
  
def send_password_reset_email(user, reset_url):
  subject= "Reset Your Password"
  from_email= settings.EMAIL_HOST_USER
  to_email= user.email
  
  
  html_content=render_to_string('store/emails/password_reset.html', {
    'username': user.username,
    'reset_url':reset_url,
  })
  
  text_content= strip_tags(html_content)
  
  email=EmailMultiAlternatives(subject, text_content, from_email, [to_email])
  email.attach_alternative(html_content, 'text/html')
  email.send()
  
  
def send_order_confirmation_email(user, order):
  subject= f'Order Confirmed #{order.id}'
  from_email=settings.EMAIL_HOST_USER
  to_email=user.email
  
  
  html_content= render_to_string('store/emails/order_confirmation.html', {
    'username': user.username,
    'order': order,
    'order_url': f'http://localhost:3000/orders/{order.id}',
  })
  
  
  text_content= strip_tags(html_content)
  
  email= EmailMultiAlternatives(subject, text_content, from_email , [to_email])
  email.attach_alternative(html_content, 'text/html')
  email.send()
  