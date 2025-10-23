import { PagedResultDto } from '@abp/ng.core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseStudentDto, CourseStudentService, CreateUpdateCourseStudentDto } from '@proxy/dev/acadmy/courses';

@Component({
  selector: 'app-list-requestjoin',
  imports: [],
  templateUrl: './list-requestjoin.component.html',
  styleUrl: './list-requestjoin.component.scss'
})
export class ListRequestjoinComponent {
students: CourseStudentDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  courseId!: string;
  loading = false;

  constructor(
    private courseStudentService: CourseStudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadStudents();
  }

  loadStudents() {
    if (!this.courseId) return;
    this.loading = true;

    // 🟢 هنا نجيب غير المشتركين
    this.courseStudentService.getList(
      this.pageNumber,
      this.pageSize,
      false,                // isSubscribe = false => غير المشتركين
      this.courseId,
      ''
    ).subscribe((res: PagedResultDto<CourseStudentDto>) => {
      this.students = res.items ?? [];
      this.totalCount = res.totalCount;
      this.loading = false;
    });
  }

  // ✅ Approve Student
  approveStudent(student: CourseStudentDto) {
    const input: CreateUpdateCourseStudentDto = {
      userId: student.userId,
      courseId: this.courseId,
      isSubscibe: true
    };

    this.courseStudentService.update(student.id, input).subscribe(() => {
      student.isSubscibe = true; // تحديث الحالة في الواجهة
      this.loadStudents();
    });
  }

  // ❌ Reject Student
  rejectStudent(student: CourseStudentDto) {
    const input: CreateUpdateCourseStudentDto = {
      userId: student.userId,
      courseId: this.courseId,
      isSubscibe: false
    };

    this.courseStudentService.update(student.id, input).subscribe(() => {
      student.isSubscibe = false; // تحديث الحالة في الواجهة
      this.loadStudents();
    });
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.loadStudents();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadStudents();
    }
  }
}
