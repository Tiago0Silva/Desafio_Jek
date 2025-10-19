from rest_framework import serializers
from .models import Customer, Admin, Table, Reservation

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields= '__all__'
        
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields= '__all__'
            
class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields= '__all__'
        
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields= '__all__' 