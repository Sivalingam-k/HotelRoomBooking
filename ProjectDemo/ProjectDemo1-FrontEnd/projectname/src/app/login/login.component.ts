import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.emailPattern.test(this.email) && this.password) {
      this.http.post<{ token?: string, user?: { role?: string } }>('http://localhost:5046/api/Users/Login', {
        email: this.email,
        password: this.password
      }, { observe: 'response' })
      .subscribe({
        next: response => {
          const user = response.body?.user;
          const token = response.body?.token;

          if (user && token) {
            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            // Debug output to check role
            console.log('User role:', user.role);

            // Navigate based on user role
            if (user.role === 'admin') {
              this.router.navigate(['/dashboard']); // Adjust the path if needed
            } else {
              this.router.navigate(['/userdashboard']); // Adjust the path if needed
            }

            window.alert('Login successful');
          } else {
            window.alert('Login failed!! Enter Valid Credentials!!');
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            window.alert('Invalid credentials');
          } else {
            window.alert('An error occurred');
          }
          console.error('Login error', error);
        }
      });
    } else {
      window.alert('Please enter valid credentials');
    }
  }
}
