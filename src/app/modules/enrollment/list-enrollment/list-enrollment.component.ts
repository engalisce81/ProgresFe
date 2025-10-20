import { PagedResultDto } from '@abp/ng.core';
import { ConfirmationService } from '@abp/ng.theme.shared';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStudentDto, CourseStudentService, CreateUpdateCourseStudentDto } from '@proxy/courses';
import { CreateUpdateStudentDto } from '@proxy/students';

@Component({
  selector: 'app-list-enrollment',
  imports: [FormsModule ,NgClass],
  templateUrl: './list-enrollment.component.html',
  styleUrl: './list-enrollment.component.scss'
})
export class ListEnrollmentComponent {
   students: CourseStudentDto[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  loading = false;
  search = '';
  isSubscribe = true;

  showDeleteConfirm = false;
  studentToDelete?: CourseStudentDto;
  studentToUpdate: CreateUpdateCourseStudentDto ;
  showDeleteAllConfirm = false;

  constructor(private courseStudentService: CourseStudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }
// ✅ تغيير حالة الاشتراك لكل الطلاب في الـ list الحالية
setAllSubscribed(value: boolean): void {
    this.isSubscribe=value;
    this.loadStudents();
}

  loadStudents(): void {
    this.loading = true;
    this.courseStudentService.getListStudents(this.pageNumber, this.pageSize, this.isSubscribe, this.search)
      .subscribe({
        next: (res: PagedResultDto<CourseStudentDto>) => {
          console.log('API Response:', res); // ✅ هتشوف الداتا هنا في الـ console
          this.students = res.items ?? [];
          console.log(this.students);
          this.totalCount = res.totalCount ?? 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

toggleSubscription(student: CourseStudentDto): void {
  const updateDto: CreateUpdateCourseStudentDto = {
    userId: student.userId!,
    courseId: student.courseId!,
    isSubscibe: !student.isSubscibe // ✅ عكس الحالة الحالية
  };

  this.courseStudentService.update(student.id!, updateDto).subscribe({
    next: () => {
      // ✅ بعد النجاح نحدث الـ UI مباشرة
      student.isSubscibe = !student.isSubscibe;
    },
    error: (err) => console.error('Failed to update subscription:', err)
  });
}


  confirmDelete(student: CourseStudentDto): void {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.studentToDelete = undefined;
  }

  deleteStudent(): void {
    if (!this.studentToDelete) return;
    this.courseStudentService.delete(this.studentToDelete.id!).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.id !== this.studentToDelete!.id);
        this.showDeleteConfirm = false;
      }
    });
  }

  confirmDeleteAll(): void {
    this.showDeleteAllConfirm = true;
  }

  cancelDeleteAll(): void {
    this.showDeleteAllConfirm = false;
  }

  deleteAllStudents(): void {
    this.courseStudentService.deleteAllStudentInAllCourses().subscribe({
      next: () => {
        this.students = [];
        this.totalCount = 0;
        this.showDeleteAllConfirm = false;
      }
    });
  }

  nextPage(): void {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.loadStudents();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadStudents();
    }
  }
}
