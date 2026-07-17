from django.contrib import admin
from .models import Category, Order, OrderItem, Product, UserProfile


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ["product"]
    extra = 0


class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "total_price", "payment_status", "order_status", "created_at"]
    list_filter = ["payment_status", "order_status", "created_at"]
    inlines = [OrderItemInline]


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(Order, OrderAdmin) 
admin.site.register(OrderItem)