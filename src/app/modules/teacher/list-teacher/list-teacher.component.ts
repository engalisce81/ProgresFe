import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherDto, TeacherService } from '@proxy/teachers';

@Component({
  selector: 'app-list-teacher',
  imports: [FormsModule],
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

  // Delete confirmation state
  showDeleteConfirm = false;
  teacherToDelete!: TeacherDto;

  constructor(
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
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
}
