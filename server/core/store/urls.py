from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('products', views.ProductViewSet)
router.register('orders', views.OrderViewSet, basename='order')
router.register('users', views.UserViewSet)
router.register('profiles', views.UserProfileViewSet, basename='profile')



urlpatterns = [
  path('', include(router.urls)),
  
  path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
  path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
  path('verify-email/<str:uid>/<str:token>/', views.verify_email, name='verify_email'),
  
  
  path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
  path('confirm-password-reset/<str:uid>/<str:token>/', views.confirm_password_reset, name='confirm_password_reset'),
  
  path('me/', views.get_current_user, name="get_current_user"),
  path('me/profile/', views.UserProfileUpdateView.as_view(), name='update-user-profile'),
  path('change-password', views.change_password, name="change-password"),
  
  
  path('logout/', TokenBlacklistView.as_view(), name="logout"),
  
]


