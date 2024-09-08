import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  isSidebarVisible = false;

  constructor(private modalService: NgbModal) {}

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.modalService.open(modal);
    }
  }
  }



