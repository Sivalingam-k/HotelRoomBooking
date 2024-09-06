import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UsersComponent } from './users/users.component';
import { EdituserComponent } from './edituser/edituser.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomCardComponent } from './room-card/room-card.component';
import { AddRoomComponent } from './add-room/add-room.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  
  {
    path: 'dashboard', component: AdminDashboardComponent, children: [
      { path: 'users', component: UsersComponent },
      { path: 'edituser/:id', component: EdituserComponent },
      {path:'rooms',component:RoomListComponent},
      { path: 'rooms/add', component: AddRoomComponent },
      {path:'roomcard',component:RoomCardComponent},
      { path: 'feedback', component: FeedbackComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
