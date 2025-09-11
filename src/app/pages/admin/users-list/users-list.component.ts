import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconsModule } from '../../../core/module/icons.module';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { UserAuth } from '../../../core/models/users.model';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { LoadingComponent } from '../../../single-pages/loading/loading.component';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, IconsModule, LucideAngularModule, RouterModule, LoadingComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  users: UserAuth[] = [];
  loading = true;
  deletingIds = new Set<string>();

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (users: UserAuth[]) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.toastr.error('Error al cargar los usuarios', 'Error');
        }
      });
  }

  deleteUser(userId: string | undefined): void {
    if (!userId) return;
    
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    this.deletingIds.add(userId);
    this.userService.deleteUser(userId)
      .pipe(finalize(() => this.deletingIds.delete(userId)))
      .subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.toastr.success('Usuario eliminado correctamente', 'Éxito');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.toastr.error('Error al eliminar el usuario', 'Error');
        }
      });
  }

  isDeleting(userId: string | undefined): boolean {
    return userId ? this.deletingIds.has(userId) : false;
  }
}
