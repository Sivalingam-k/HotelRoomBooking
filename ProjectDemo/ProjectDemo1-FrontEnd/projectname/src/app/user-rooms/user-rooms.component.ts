import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-rooms',
  templateUrl: './user-rooms.component.html',
  styleUrls: ['./user-rooms.component.css']
})
export class UserRoomsComponent implements OnInit {
  
  rooms: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedRoom: any = null;
  paymentForm: FormGroup;
  modalRef?: BsModalRef; // For the Room Details Modal
  paymentModalRef?: BsModalRef; // For the Payment Modal

  @ViewChild('paymentModalTemplate', { static: false }) paymentModalTemplate?: TemplateRef<any>;

  constructor(private http: HttpClient, private modalService: BsModalService, private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5046/api/Room/GetRooms').subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rooms';
        this.loading = false;
      }
    });
  }

  openModal(template: TemplateRef<any>, room: any): void {
    this.selectedRoom = room;
    this.modalRef = this.modalService.show(template);
  }

  openPaymentModal(): void {
    if (this.paymentModalTemplate) {
      this.paymentModalRef = this.modalService.show(this.paymentModalTemplate);
    } else {
      console.error('Payment modal template is not defined');
    }
  }

  processPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const payload = {
      amount: this.selectedRoom?.price,
      cardNumber: this.paymentForm.get('cardNumber')?.value,
      expiryDate: this.paymentForm.get('expiryDate')?.value,
      cvv: this.paymentForm.get('cvv')?.value,
      roomId: this.selectedRoom?.id
    };

    this.http.post('http://localhost:5046/api/Payment/ProcessPayment', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Payment response:', response);
          alert(response.message || 'Payment successful!');
          this.paymentModalRef?.hide();
          if (this.selectedRoom) {
            this.selectedRoom.isBooked = true;
          }
        },
        error: (err) => {
          console.error('Payment error:', err);
          const errorMessage = err.error?.message || 'Payment failed.';
          alert(errorMessage);
        }
      });
  }
}