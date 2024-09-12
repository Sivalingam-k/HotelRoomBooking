import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-booked-rooms',
  templateUrl: './booked-rooms.component.html',
  styleUrl: './booked-rooms.component.css'
})
export class BookedRoomsComponent implements OnInit {
  bookedRooms: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  private apiUrl = 'http://localhost:5046/api/Payment';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setEmail('siva123@gmail.com').subscribe({
      next: () => {
        this.loadBookedRooms();
      },
      error: (err) => {
        console.error('Failed to set email:', err);
        this.error = 'Failed to set email.';
        this.loading = false;
      }
    });
  }

  setEmail(email: string) {
    return this.http.get(`${this.apiUrl}/set-email?email=${encodeURIComponent(email)}`);
  }

  loadBookedRooms(): void {
    this.http.get<any[]>(`${this.apiUrl}/GetBookedRoomsByEmail`).subscribe({
      next: (data) => {
        this.bookedRooms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load booked rooms:', err);
        this.error = 'Failed to load current user booked rooms.';
        this.loading = false;
      }
    });
  }
}
