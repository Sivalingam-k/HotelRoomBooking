import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements  OnInit{
  bookedRoomsPayments: any[] = []; // Ensure the property is declared
  apiUrl = 'http://localhost:5046/api/Payment/GetBookedRoomsPayments'; // URL to your API
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBookedRooms();
  }

  fetchBookedRooms(): void {
    this.http.get<any[]>(this.apiUrl)
      .subscribe({
        next: data => {
          this.bookedRoomsPayments = data; // Assign fetched data to the property
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to load booked rooms';
          this.loading = false;
          console.error('Error fetching booked rooms', err);
        }
      });
  }

}
