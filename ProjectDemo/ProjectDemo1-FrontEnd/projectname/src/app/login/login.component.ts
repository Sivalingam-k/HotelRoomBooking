import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router, private formsModule:FormsModule) {}

  onSubmit() {
    if (this.emailPattern.test(this.email) && this.password) {
      this.http.post('http://localhost:5046/api/Users/Login', {
        email: this.email,
        password: this.password
      }, { observe: 'response' })
      .subscribe(response => {
        if (response.status === 200) {
          window.alert('Login successful');
          this.router.navigate(['/dashboard'])
            .then(success => {
              if (success) {
                console.log('Navigation to /dashboard was successful');
              } else {
                console.log('Navigation to /dashboard failed');
              }
            })
            .catch(err => {
              console.error('Navigation Error:', err);
            });
        } else {
          window.alert('Login failed!! Enter Valid Credentials!!');
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 401) {
          window.alert('Invalid credentials');
        } else {
          window.alert('An error occurred');
        }
        console.error('Login error', error);
      });
    } else {
      window.alert('Please enter valid credentials');
    }
  }
}
