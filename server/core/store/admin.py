from django.contrib import admin
from .models import Category, Order, OrderItem, UserProfile, Cart, CartItem, Wishlist, Product

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ["product"]
    extra = 0
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display= ["order_number", "user", "total_price", "payment_status", "order_status", "created_at"]
    list_filter = ["payment_status", "order_status", "created_at"]
    search_fields = ["order_number", "user__username", "tx_ref"]
    inlines = [OrderItemInline]
    
    
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display= ["name", "category", "price", "original_price", "stock", "rating", "is_active", "featured"]
    list_filter = ["category", "is_active", "featured"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "stock"]
    prepopulated_fields = {"slug": ( "name",)}
    
    
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "phone_number", "is_verified"]
    search_fields = ["user__username", "phone_number"]
    
admin.site.register(Cart)
admin.site.register(Wishlist)



    
        