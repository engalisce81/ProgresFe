import { PagedResultDto } from '@abp/ng.core';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseStudentDto, CourseStudentService } from '@proxy/courses';

@Component({
  selector: 'app-list-subscriber',
  imports: [RouterLink],
  templateUrl: './list-subscriber.component.html',
  styleUrl: './list-subscriber.component.scss'
})
export class ListSubscriberComponent {
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
    // اقرأ الكورس Id من ال Route
    this.courseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadStudents();
  }

  loadStudents() {
    if (!this.courseId) return;
    this.loading = true;

    this.courseStudentService.getList(
      this.pageNumber,
      this.pageSize,
      true,                 // isSubscribe = true => المشتركين فقط
      this.courseId,
      ''
    ).subscribe((res: PagedResultDto<CourseStudentDto>) => {
      this.students = res.items ?? [];
      this.totalCount = res.totalCount;
      this.loading = false;
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
