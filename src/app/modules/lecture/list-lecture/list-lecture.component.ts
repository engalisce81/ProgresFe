import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LectureDto, LectureService } from '@proxy/dev/acadmy/lectures';


@Component({
  selector: 'app-list-lecture',
  imports: [FormsModule ,RouterLink],
  templateUrl: './list-lecture.component.html',
  styleUrl: './list-lecture.component.scss'
})
export class ListLectureComponent {
 lectures: LectureDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  showDeleteConfirm = false;
  lectureToDelete!: LectureDto;

  constructor(
    private lectureService: LectureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLectures();
  }

  loadLectures(): void {
    this.loading = true;
    this.lectureService.getList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.lectures = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadLectures();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadLectures();
  }

  confirmDelete(lecture: LectureDto): void {
    this.lectureToDelete = lecture;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.lectureToDelete = null!;
  }

  deleteLecture(): void {
    if (!this.lectureToDelete) return;

    this.lectureService.delete(this.lectureToDelete.id).subscribe({
      next: () => {
        this.loadLectures();
        this.showDeleteConfirm = false;
        this.lectureToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete lecture:', error);
        this.showDeleteConfirm = false;
        this.lectureToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
