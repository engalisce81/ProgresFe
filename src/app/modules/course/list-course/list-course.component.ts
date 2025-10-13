import { ConfigStateService } from '@abp/ng.core';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseDto, CourseService } from '@proxy/courses';

@Component({
  selector: 'app-list-course',
  imports: [RouterLink,FormsModule],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.scss'
})
export class ListCourseComponent {
 courses: CourseDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;
roles:string []  =[] ;
  showDeleteConfirm = false;
  courseToDelete!: CourseDto;

  constructor(
    private courseService: CourseService,
    private router: Router,
private config: ConfigStateService  ) {}

  ngOnInit(): void {
    this.loadCourses();
      const user = this.config.getOne("currentUser");
  console.log('Current user:', user);
  this.roles = user?.roles ?? [];

  }
  hasRole(role: string): boolean {
  return this.roles.includes(role);
}

  loadCourses(): void {
    this.loading = true;

    this.courseService.getList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.courses = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadCourses();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadCourses();
  }

  confirmDelete(course: CourseDto): void {
    this.courseToDelete = course;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.courseToDelete = null!;
  }

  deleteCourse(): void {
    if (!this.courseToDelete) return;

    this.courseService.delete(this.courseToDelete.id).subscribe({
      next: () => {
        this.loadCourses();
        this.showDeleteConfirm = false;
        this.courseToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete course:', error);
        this.showDeleteConfirm = false;
        this.courseToDelete = null!;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  dublicate(id :string):void{
    this.courseService.duplicateCourse(id).subscribe({
      next:(next)=>  this.loadCourses(),
    });
   
  }
}
