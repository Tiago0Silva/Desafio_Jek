from django.db import models
from django.core.validators import MaxValueValidator

class Customer(models.Model):
    name= models.CharField(max_length= 30)
    phone_number = models.CharField(max_length= 9)
    NIF= models.IntegerField(unique=True)
    email= models.EmailField(max_length=60, unique=True)
    password= models.CharField(max_length= 50)
    
    def __str__(self):
        return self.name

class Admin(models.Model):
    name= models.CharField(max_length= 30)
    email= models.EmailField(max_length= 60)
    password= models.CharField(max_length= 20)
    
    def __str__(self):
        return self.pk

class Table(models.Model):
    n_seats= models.IntegerField(validators= [MaxValueValidator(15)])
    
    def __str__(self):
        return self.pk

class Reservation(models.Model):
    state= models.BooleanField(default= True)
    time = models.TimeField()
    date = models.DateField()
    name= models.CharField(max_length=30)
    n_guests= models.IntegerField()
    email= models.EmailField(max_length= 60)
    table= models.ForeignKey(Table, on_delete= models.CASCADE)

    def __str__(self):
        return self.pk