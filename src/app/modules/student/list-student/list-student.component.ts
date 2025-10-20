import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountcustomService } from '@proxy/account-customs/accountcustom.service';
import { StudentDto, StudentService } from '@proxy/students';

@Component({
  selector: 'app-list-student',
  imports: [FormsModule,RouterLink ,NgClass],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent {
students: StudentDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation
  showDeleteConfirm = false;
  studentToDelete!: StudentDto;

  // Password reset modal
  showPasswordModal = false;
  selectedStudent!: StudentDto;
  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  constructor(
    private studentService: StudentService,
    private accountcustomService: AccountcustomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService
      .getStudentList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.students = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading students:', err);
          this.loading = false;
        }
      });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadStudents();
  }

  confirmDelete(student: StudentDto): void {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.studentToDelete = null!;
  }

  deleteStudent(): void {
    if (!this.studentToDelete) return;
    this.studentService.delete(this.studentToDelete.id!).subscribe({
      next: () => {
        this.loadStudents();
        this.showDeleteConfirm = false;
        this.studentToDelete = null!;
      },
      error: (err) => {
        console.error('Failed to delete student:', err);
        this.showDeleteConfirm = false;
        this.studentToDelete = null!;
      }
    });
  }

  // ✅ Open password reset modal
  openPasswordModal(student: StudentDto): void {
    this.selectedStudent = student;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  // ✅ Close modal
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
      .resetPassword(this.selectedStudent.id!, this.newPassword)
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
