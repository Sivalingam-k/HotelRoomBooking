import { Component } from '@angular/core';

@Component({
  selector: 'app-lanpage',
  templateUrl: './lanpage.component.html',
  styleUrl: './lanpage.component.css'
})
export class LanpageComponent {

  destinations = [
    { name: 'Paris', image: 'assets/paris.jpg', description: 'The city of lights' },
    { name: 'New York', image: 'assets/new-york.jpg', description: 'The city that never sleeps' },
    { name: 'Tokyo', image: 'assets/tokyo.jpg', description: 'The heart of Japan' }
  ];
}
