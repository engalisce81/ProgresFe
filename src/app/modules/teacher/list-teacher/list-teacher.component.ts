import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountcustomService } from '@proxy/account-customs/accountcustom.service';
import { TeacherDto, TeacherService } from '@proxy/teachers';

@Component({
  selector: 'app-list-teacher',
  imports: [FormsModule,RouterLink ,NgClass],
  templateUrl: './list-teacher.component.html',
  styleUrl: './list-teacher.component.scss'
})
export class ListTeacherComponent {
teachers: TeacherDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  // Delete confirmation state
  showDeleteConfirm = false;
  teacherToDelete!: TeacherDto;
showPasswordModal = false;
  selectedteacher!: TeacherDto;

  constructor(
    private teacherService: TeacherService,
        private accountcustomService: AccountcustomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }
  openPasswordModal(teacher: TeacherDto): void {
    this.selectedteacher = teacher;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }
  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  // ✅ Reset password
  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Please fill in both fields.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }

    this.passwordError = '';
    this.loading = true;

    this.accountcustomService
      .resetPassword(this.selectedteacher.id!, this.newPassword)
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Password changed successfully!');
          this.showPasswordModal = false;
        },
        error: (err) => {
          this.loading = false;
          alert('Error changing password: ' + err.message);
        }
      });
  }


  loadTeachers(): void {
    this.loading = true;

    this.teacherService
      .getTeacherList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.teachers = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading teachers:', err);
          this.loading = false;
        }
      });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadTeachers();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadTeachers();
  }

  confirmDelete(teacher: TeacherDto): void {
    this.teacherToDelete = teacher;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.teacherToDelete = null!;
  }

  deleteTeacher(): void {
    if (!this.teacherToDelete) return;

    this.teacherService.delete(this.teacherToDelete.id!).subscribe({
      next: () => {
        this.loadTeachers();
        this.showDeleteConfirm = false;
        this.teacherToDelete = null!;
      },
      error: (err) => {
        console.error('Failed to delete teacher:', err);
        this.showDeleteConfirm = false;
        this.teacherToDelete = null!;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
    showNewPassword = false;
showConfirmPassword = false;

toggleNewPassword() {
  this.showNewPassword = !this.showNewPassword;
}

toggleConfirmPassword() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
}
