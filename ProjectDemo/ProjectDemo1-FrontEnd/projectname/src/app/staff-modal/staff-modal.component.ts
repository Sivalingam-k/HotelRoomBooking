import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { RoomService } from '../models/room.model';

@Component({
  selector: 'app-staff-modal',
  templateUrl: './staff-modal.component.html',
  styleUrls: ['./staff-modal.component.css']
})
export class StaffModalComponent {
  @Input() staff: RoomService = {}; // Ensure RoomService type is correct

  @Input() mode: 'create' | 'update' = 'create'; // Mode to determine API endpoint
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5046/api/RoomService'; // API endpoint

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result; // Preview the image
      };
      reader.readAsDataURL(this.selectedFile);
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
  
    const apiEndpoint = this.mode === 'create' ? 'CreateStaff' : `UpdateStaff/${this.staff.id}`;
    console.log(`API Endpoint: ${this.apiUrl}/${apiEndpoint}`); // Debug the endpoint
    this.http.post(`${this.apiUrl}/${apiEndpoint}`, formData).subscribe(
      () => this.close('Staff saved successfully!'),
      error => {
        this.errorMessage = 'Error saving staff: ' + error.message;
        console.error('Error:', error);  // Log error details
      }
    );
  }

  close(message?: string): void {
    if (message) {
      alert(message);
    }
    this.activeModal.close();
  }
}
