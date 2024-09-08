import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-staff-modal',
  templateUrl: './staff-modal.component.html',
  styleUrl: './staff-modal.component.css'
})
export class StaffModalComponent implements OnInit{
  @Input() staff: any = {};
  @Input() mode: 'create' | 'update' = 'create';
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5046/api/RoomService';

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {}

  ngOnInit(): void {}

  save(): void {
    if (this.mode === 'create') {
      this.http.post(`${this.apiUrl}/CreateStaff`, this.staff)
        .subscribe(
          () => this.close('Staff added successfully!'),
          error => this.errorMessage = 'Error adding staff.'
        );
    } else if (this.mode === 'update') {
      this.http.put(`${this.apiUrl}/UpdateStaff/${this.staff.id}`, this.staff)
        .subscribe(
          () => this.close('Staff updated successfully!'),
          error => this.errorMessage = 'Error updating staff.'
        );
    }
  }

  close(message?: string): void {
    if (message) {
      alert(message);
    }
    this.activeModal.close();
  }
}
