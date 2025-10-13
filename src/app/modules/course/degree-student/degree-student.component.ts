import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentDegreeByCourseDto, CourseStudentService } from '@proxy/courses';

@Component({
  selector: 'app-degree-student',
  imports: [],
  templateUrl: './degree-student.component.html',
  styleUrl: './degree-student.component.scss'
})
export class DegreeStudentComponent {
courseId!: string;
  userId!: string;
  studentDegree?: StudentDegreeByCourseDto;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseStudentService: CourseStudentService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;        // من المسار subscriber/:id/degree/:userId
    this.userId = this.route.snapshot.paramMap.get('userId')!;

    this.loadDegree();
  }

  loadDegree() {
    this.isLoading = true;
    this.courseStudentService.getStudentDegreByCourse(1, 50, this.courseId, this.userId)
      .subscribe({
        next: (res) => {
          this.studentDegree = res.items[0]; // حسب نوع الـ API
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }
}
