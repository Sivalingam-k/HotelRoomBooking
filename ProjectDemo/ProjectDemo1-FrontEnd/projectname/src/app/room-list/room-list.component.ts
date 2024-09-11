import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.model';
import { environment } from '../environments/environments';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  rooms: Room[] = [];
  roomTypes = ['Single Bed', 'Double Bed', 'Family Type'];
  selectedImage: File | null = null;
  selectedRoomType:string='';
  filteredRooms: Room[] = []; 

  constructor(private http: HttpClient,private router:Router,private modalService: NgbModal) {}
  
  openAddRoomModal() {
    const modalRef = this.modalService.open(AddRoomComponent);
    modalRef.result.then((result) => {
      console.log('Room data:', result);
      if (result) {
        this.loadRooms(); // Reload rooms after adding
      }
    }).catch((error) => {
      console.log('Dismissed:', error);
    });
  }
  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }
  apiUrl = `${environment.apiUrl}/api/Room`;
  ngOnInit(): void {
    this.loadRooms();
  }
  
  filterRooms() {
    if (this.selectedRoomType) {
      this.filteredRooms = this.rooms.filter((room) => room.roomType === this.selectedRoomType);
    } else {
      this.filteredRooms = [...this.rooms];
    }
  }
  loadRooms(): void {
    this.http.get<Room[]>(`${this.apiUrl}/GetRooms`).subscribe(
      (data: Room[]) => {
        this.rooms = data;
        
      },
      error => console.error('Error loading rooms', error)
    );
  }
 
  
  deleteRoom(id: number): void {
    window.alert("Are you sure you want to delete this room?");
    this.http.delete<void>(`${this.apiUrl}/DeleteRoom/${id}`).subscribe(
      () => this.loadRooms(),
      error => console.error('Error deleting room', error)
    );
  }

  editRoom(room: Room): void {
    room.editMode = true;
    console.log("hello")
  }

  cancelEdit(room: Room): void {
    room.editMode = false;
    this.loadRooms(); // Reload rooms to reset any unsaved changes
  }

  updateRoom(room: Room): void {
    // Prepare the room data to be sent in the body of the PUT request
    console.log("update")
    const roomData = {
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        price: room.price,
        isAvailable: room.ISAvailable,
        rating: room.rating,
        location: room.location,
        description: room.description,
        imagePath: room.imagePath ,// Use the image URL directly
        amenities: room.amenities 
    };

    // Send a PUT request with JSON data
    this.http.put(`${this.apiUrl}/UpdateRoom/${room.id}`, roomData, {
        headers: { 'Content-Type': 'application/json' } // Ensure the content type is application/json
    })
    .subscribe(
        response => {
          room.editMode = false;
         this.loadRooms();
            window.alert('Room updated successfully');
            // Handle successful response
        },
        error => {
            console.error('Error updating room', error);
        }
    );

}

}