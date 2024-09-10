import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffModalComponent } from '../staff-modal/staff-modal.component';
import { RoomService } from '../models/room.model';  // Adjust the import path as necessary

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staffList: RoomService[] = [];
  staff: RoomService = new RoomService(); // Initialize as a new RoomService object
  mode: 'create' | 'update' = 'create'; // 'create' or 'update'
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.http.get<RoomService[]>('http://localhost:5046/api/RoomService/GetStaff')
      .subscribe(
        data => this.staffList = data,
        error => this.errorMessage = 'Error fetching staff data.'
      );
  }

  openAddStaffModal(): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.staff = new RoomService(); // Pass a new instance of RoomService
    modalRef.result.then(() => this.loadStaff(), () => {}); // Handle modal dismissal
  }

  openEditStaffModal(staff: RoomService): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'update';
    modalRef.componentInstance.staff = { ...staff }; // Pass the selected staff data
    modalRef.result.then(() => this.loadStaff(), () => {}); // Handle modal dismissal
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.staff.imageData = file;
    }
  }
  
  save(): void {
    const formData = new FormData();
    formData.append('Id', this.staff.id?.toString() || '');
    formData.append('StaffName', this.staff.staffName || '');
    formData.append('Email', this.staff.email || '');
    formData.append('Contact', this.staff.contact?.toString() || '');
    formData.append('Address', this.staff.address || '');
    formData.append('Rating', this.staff.rating?.toString() || '');
    formData.append('IsAvailable', this.staff.isAvailable || '');
    formData.append('Aadhar', this.staff.aadhar?.toString() || '');
    formData.append('JoinedDate', this.staff.joinedDate?.toISOString() || '');

    if (this.staff.imageData instanceof File) {
      formData.append('ImageData', this.staff.imageData, this.staff.imageData.name);
    }
  
    if (this.mode === 'create') {
      this.http.post('http://localhost:5046/api/RoomService/CreateStaff', formData)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll();
          },
          error => this.errorMessage = 'Error adding staff.'
        );
    } else if (this.mode === 'update') {
      if (this.staff.id === undefined) {
        console.error('Staff ID is undefined for update.');
        return;
      }
      const formData = new FormData();
      formData.append('Id', this.staff.id?.toString() || '');
      formData.append('StaffName', this.staff.staffName || '');
      formData.append('Email', this.staff.email || '');
      formData.append('Contact', this.staff.contact?.toString() || '');
      formData.append('Address', this.staff.address || '');
      formData.append('Rating', this.staff.rating?.toString() || '');
      formData.append('IsAvailable', this.staff.isAvailable || '');
      formData.append('Aadhar', this.staff.aadhar?.toString() || '');
      if (this.staff.joinedDate instanceof Date) {
        formData.append('JoinedDate', this.staff.joinedDate.toISOString());
      } else if (typeof this.staff.joinedDate === 'string') {
        const date = new Date(this.staff.joinedDate);
        formData.append('JoinedDate', date.toISOString());
      } else {
        // Handle case when joinedDate is not set or is of an unexpected type
        console.error('Invalid joinedDate value');
        return;
      }
  
      if (this.staff.imageData instanceof File) {
        formData.append('ImageData', this.staff.imageData, this.staff.imageData.name);
      }
      console.log(this)
      this.http.put(`http://localhost:5046/api/RoomService/UpdateStaff/${this.staff.id}`, formData)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll();
          },
          error => {
            console.error('Error updating staff:', error);
            this.errorMessage = 'Error updating staff.';
          }
        );
    }
  }

  deleteStaff(id: number | undefined): void {
    if (id === undefined) {
      console.error('Staff ID is undefined for delete.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.http.delete(`http://localhost:5046/api/RoomService/DeleteStaff/${id}`)
        .subscribe(
          () => this.loadStaff(),
          error => this.errorMessage = 'Error deleting staff.'
        );
    }
  }
}
