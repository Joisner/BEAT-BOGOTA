import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { UserAuth } from '../../../core/models/users.model';
import { UserService } from '../../../core/services/user.service';
import { LoadingComponent } from '../../../single-pages/loading/loading.component';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, IconsModule, LucideAngularModule, RouterModule, LoadingComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  users: UserAuth[] = []
  loading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users: UserAuth[]) => {
        this.users = users;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
