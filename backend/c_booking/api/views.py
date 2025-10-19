from django.utils import timezone
from datetime import timedelta, datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, Admin, Table, Reservation
from .serializer import CustomerSerializer, AdminSerializer, TableSerializer, ReservationSerializer
from django.db.models import Sum, Count

# PARA ADMINS
@api_view(['GET'])
def get_costumers (request):
    customers= Customer.objects.all()
    serializedData = CustomerSerializer(customers, many = True).data
    return Response(serializedData)

@api_view(['GET'])
def get_tables (request):
    tables= Table.objects.all()
    serializedData = TableSerializer(tables, many = True).data
    return Response(serializedData)

@api_view(['GET'])
def get_admins (request):
    admins= Admin.objects.all()
    serializedData = AdminSerializer(admins, many = True).data
    return Response(serializedData)

@api_view(['GET'])
def get_reservations(request):
    all_reservations= Reservation.objects.all()
    serializedData= ReservationSerializer(all_reservations, many = True).data
    return Response(serializedData)

@api_view(['GET'])
def GETdaily_summary(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)

    result_total_guests = reservations.aggregate(total_guests=Sum('n_guests'))
    total_guests = result_total_guests['total_guests']
    total_reservations= reservations.count()
    total_tables = Table.objects.count()
    available_tables = total_tables - total_reservations

    serializeData = ReservationSerializer(reservations, many=True).data

    return Response({
        'reservations': serializeData,
        'summary': {
            'total_reservations': total_reservations,
            'total_guests': total_guests,
            'occupied_tables': total_reservations,
            'available_tables': available_tables
        }
    })
# daily summary simplified
@api_view(['GET'])
def total_reservations_today(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)
    total_reservations = reservations.count()
    return Response({'total_reservations': total_reservations})

@api_view(['GET'])
def total_guests_today(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)
    result_total_guests = reservations.aggregate(total_guests=Sum('n_guests'))
    total_guests = result_total_guests['total_guests'] or 0
    return Response({'total_guests': total_guests})

@api_view(['GET'])
def occupied_tables_today(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)
    occupied_tables = reservations.count()
    return Response({'occupied_tables': occupied_tables})

@api_view(['GET'])
def available_tables_today(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)
    total_tables = Table.objects.count()
    occupied_tables = reservations.count()
    available_tables = total_tables - occupied_tables
    if available_tables < 0:
        available_tables= 0
        
    return Response({'available_tables': available_tables})

@api_view(['GET'])
def reservations_today(request):
    today = timezone.now().date()
    reservations = Reservation.objects.filter(date=today, state=True)
    serialized_data = ReservationSerializer(reservations, many=True).data
    return Response({'reservations': serialized_data})

@api_view(['PUT', 'DELETE'])
def alter_reservation_time(request, pk):
    try:
        reservation= Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        data= request.data
        serializer= ReservationSerializer(reservation, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        reservation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def alter_admin_password(request, pk):
    try:
        new_password= Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    data= request.data
    serializer= AdminSerializer(new_password, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def alter_n_seats(request,pk):
    try:
        seats = Table.objects.get(pk=pk)
    except Table.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    data= request.data
    serializer= TableSerializer(seats, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_admins(request):
    data = request.data
    serializer = AdminSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_tables(request):
    data = request.data
    serializer = TableSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





#PARA CLIENTES
@api_view(['POST'])
def add_customer(request):
    data = request.data
    serializer = CustomerSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_reservation(request):
    data = request.data
    serializer = ReservationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def make_reservation(request):
    serializer = ReservationSerializer(data=request.data)
    
    if serializer.is_valid():
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['time']
        duration = timedelta(hours=1, minutes=30)
        new_start = datetime.combine(date, start_time)
        new_end = new_start + duration

        existing_reservations = Reservation.objects.filter(date=date, status=True)
        for existing in existing_reservations:
            existing_start = datetime.combine(existing.date, existing.time)
            existing_end = existing_start + duration

            if new_start < existing_end and new_end > existing_start:
                return Response(
                    {"error": "Já existe uma reserva neste horário."},
                    status=status.HTTP_409_CONFLICT
                )

        reservation = serializer.save()
        return Response(ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def GET_tables_datetime(request,date, time):
    reserved_tables = Reservation.objects.filter(time= time, date= date).values_list('table_id', flat=True)
    available_tables = Table.objects.exclude(id__in=reserved_tables)
    serializer = TableSerializer(available_tables, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GET_any_tables(request,date, time,seats):
    reserved_tables = Reservation.objects.filter(time= time, date= date).values_list('table_id', flat=True)
    available_tables = Table.objects.exclude(id__in=reserved_tables).filter(n_seats__gte= seats)
    serializer = TableSerializer(available_tables, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def cancel_reservation(request,pk):
    try:
        reservation = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    reservation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)