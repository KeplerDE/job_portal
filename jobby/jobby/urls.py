from django.urls import include
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('job_app.urls')),
    path('api/', include('account.urls')),
]