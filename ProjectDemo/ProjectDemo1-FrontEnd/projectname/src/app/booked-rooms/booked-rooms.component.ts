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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5046/api/Payment/GetBookedRoomsimage').subscribe({
      next: (data) => {
        console.log(data)
        this.bookedRooms = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load booked rooms';
        this.loading = false;
      }
    });
  }
}
