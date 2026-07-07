
from django.contrib.messages import api
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .emails import send_password_reset_email, send_verification_email, send_order_confirmation_email, send_welcome_email
from .models import UserProfile, Product, Category, Order, Wishlist
from .serializers import CategorySerializer, OrderSerializer, ProductSerializer, UserProfileSerializer, UserSerializer, WishListSerializer



# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
  queryset= Category.objects.all()
  serializer_class= CategorySerializer
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]
  
class ProductViewSet(viewsets.ModelViewSet):
  queryset= Product.objects.all().select_related('category')
  serializer_class= ProductSerializer
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]


  def get_queryset(self):
    queryset=super().get_queryset()  
    featured = self.request.query_params.get('featured')
    category = self.request.query_params.get('category')
    limit = self.request.query_params.get('limit')
    
    
    if featured == "true":
      queryset = queryset.filter(featured=True)
    
    if category:
      queryset= queryset.filter(category__slug=category)
      
    if limit: 
      try:
        limit = int(limit)
        if limit > 0 :
          queryset = queryset[:limit]
          
      except Exception as e:
        raise e
  
      
      
    return queryset

  
class UserProfileViewSet(viewsets.ModelViewSet):
  queryset= UserProfile.objects.all()
  serializer_class= UserProfileSerializer
  permission_classes= [permissions.IsAuthenticated]
  
  
  def get_queryset(self):
    return UserProfile.objects.filter(user=self.request.user)
  
  
  def perform_update(self, serializer):
    serializer.save(user= self.request.user)
      

class OrderViewSet(viewsets.ModelViewSet):
  serializer_class=OrderSerializer
  permission_classes=[permissions.IsAuthenticatedOrReadOnly]  
  
  
  def get_queryset(self):
    return Order.objects.filter(user=self.request.user)
  
  def perform_create(self, serializer):
    order = serializer.save(user=self.request.user)
    
    send_order_confirmation_email(self.request.user, order)
   
   
   
class UserProfileUpdateView(generics.UpdateAPIView):
  serializer_class= UserProfileSerializer
  permission_classes= [permissions.IsAuthenticated]
  
  def get_object(self):
    return self.request.user.profile
  
   
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]

        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        user = serializer.save()

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = (
            f"http://localhost:3000/verify-email/{uid}/{token}/"
        )

        send_verification_email(user, verification_url)

@api_view(['GET'])
def get_current_user(request):
  if not request.user.is_authenticated:
    return Response(
      {'error': 'Not authenticated'},
      status= status.HTTP_401_UNAUTHORIZED
    )
    
  serializer= UserSerializer(request.user)
  return Response(serializer.data)
    
    
class WishlistViewSet(viewsets.ModelViewSet):
  serializer_class= WishListSerializer
  permission_classes= [permissions.IsAuthenticated]
  
  def get_queryset(self):
    return Wishlist.objects.filter(
      user = self.request.user
      
    ).select_related("product", "product.category")
    
  def perform_create(self, serializer):
    serializer.save(user = self.request.user)
    
@api_view(['GET'])
def verify_email(request, uid, token):
  try:
    user_pk=force_str(urlsafe_base64_decode(uid))
    user = User.objects.get(pk=user_pk)
    
  except (User.DoesNotExist, ValueError, TypeError):
    return Response(
      {'error': 'Invalid verification Link'},
      status=status.HTTP_400_BAD_REQUEST
    )
    
  if not default_token_generator.check_token(user, token):
    return Response(
      {'error': "Verification Link has expired or is invalid"},
      status=status.HTTP_400_BAD_REQUEST,)
    
  if user.profile.is_verified:
    return Response(
      {'message': 'Email is verified'},
      status=status.HTTP_200_OK
    )
    
  user.profile.is_verified = True
  user.profile.save()
  send_welcome_email(user)
  
  return Response(
      {'message': 'Email verified successfully!, Welcome to PrimePack'},
      status=status.HTTP_200_OK
    )
  
  
@api_view(['POST'])
def request_password_reset(request):
  email = request.data.get('email')
  
  try:
    user = User.objects.get(email=email)
  except User.DoesNotExist:
    return Response(
      {'message': 'If an account exists with this email, You will receive a password reset link'},
      status=status.HTTP_200_OK
    )
    
    
    
  token = default_token_generator.make_token(user)
  uid= urlsafe_base64_encode(force_bytes(user.pk))
  
  reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
  
  send_password_reset_email(user, reset_url)
  
  return Response(
    {'message': 'Password Reset link sent to your email.'},
    status=status.HTTP_200_OK
  )
  
@api_view(['POST'])
def confirm_password_reset(request, uid, token):
  password = request.data.get('password')
  confirm_password= request.data.get('confirm_password')
  
  if password != confirm_password:
    return Response(
      {'error': 'Passwords do not match'},
      status=status.HTTP_400_BAD_REQUEST
    )
    
  if len(password) < 8:
    return Response(
      {"error": "Password must be at least 8 characters"},
      status= status.HTTP_400_BAD_REQUEST
      
    )
    
    
  try:
    user_pk= force_str(urlsafe_base64_decode(uid))
    user = User.objects.get(pk= user_pk)
    
  except (User.DoesNotExist, TypeError, ValueError):
    return Response(
      {"error": "Invalid Password reset link "},
      status=status.HTTP_400_BAD_REQUEST
    )
    
  if not default_token_generator.check_token(user, token):
    return Response(
      {"error": "Password reset link has expired or is invalid"},
      status= status.HTTP_400_BAD_REQUEST
    )
    
  user.set_password(password)
  user.save()
  
  return Response(
    {"message": "Password reset Successfully! You can now login with your new password"},
    status= status.HTTP_200_OK
  )
  
@api_view(["POST"])
def change_password(request):
  if not request.user.is_authenticated:
    return Response(
      {"error": "Not Authenticated"},
      status= status.HTTP_401_UNAUTHORIZED
    )
    
  old_password= request.data.get('old_password')
  new_password= request.data.get('new_password')
  confirm_password= request.data.get('confirm_password')
  
  
  if not request.user.check_password(old_password):
    return Response(
      {'error': "Old password Incorrect"},
      status= status.HTTP_401_UNAUTHORIZED
    )
    
  if new_password != confirm_password:
    return Response(
      {"error": "New passwords do not match"},
      status= status.HTTP_401_UNAUTHORIZED
    )
    
  if len(new_password) < 8:
    return Response(
      {"error": "Password must be at least 8 characters"},
      status= status.HTTP_401_UNAUTHORIZED
    )
    
  request.user.set_password(new_password)
  request.user.save()
  
  
  return Response(
    {"message": "Password changed successfully"},
    status= status.HTTP_200_OK
  )