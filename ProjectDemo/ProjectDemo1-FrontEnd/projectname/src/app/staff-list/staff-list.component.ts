import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffModalComponent } from '../staff-modal/staff-modal.component';
@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {
  staffList: any[] = [];
  staff: any = {};
  mode: 'create' | 'update' = 'create'; // 'create' or 'update'
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.http.get<any[]>('http://localhost:5046/api/RoomService/GetStaff')
      .subscribe(
        data => this.staffList = data,
        error => this.errorMessage = 'Error fetching staff data.'
      );
  }

  openAddStaffModal(): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.staff = {};
    modalRef.result.then(() => this.loadStaff());
  }

  openEditStaffModal(staff: any): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'update';
    modalRef.componentInstance.staff = { ...staff };
    modalRef.result.then(() => this.loadStaff());
  }

  save(): void {
    if (this.mode === 'create') {
      this.http.post('http://localhost:5046/api/RoomService/CreateStaff', this.staff)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll(); // Close modal
          },
          error => this.errorMessage = 'Error adding staff.'
        );
    } else if (this.mode === 'update') {
      this.http.put(`http://localhost:5046/api/RoomService/UpdateStaff/${this.staff.id}`, this.staff)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll(); // Close modal
          },
          error => this.errorMessage = 'Error updating staff.'
        );
    }
  }

  deleteStaff(id: number): void {
    this.http.delete(`http://localhost:5046/api/RoomService/DeleteStaff/${id}`)
      .subscribe(
        () => this.loadStaff(),
        error => this.errorMessage = 'Error deleting staff.'
      );
  }
}
