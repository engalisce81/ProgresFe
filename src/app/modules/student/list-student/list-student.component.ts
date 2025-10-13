import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentDto, StudentService } from '@proxy/students';

@Component({
  selector: 'app-list-student',
  imports: [FormsModule,RouterLink],
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

  // Delete confirmation state
  showDeleteConfirm = false;
  studentToDelete!: StudentDto;

  constructor(
    private studentService: StudentService,
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

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
