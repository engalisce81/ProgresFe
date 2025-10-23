import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChapterDto, ChapterService } from '@proxy/dev/acadmy/chapters';


@Component({
  selector: 'app-list-chapter',
  imports: [FormsModule,RouterLink],
  templateUrl: './list-chapter.component.html',
  styleUrl: './list-chapter.component.scss'
})
export class ListChapterComponent {
 chapters: ChapterDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  showDeleteConfirm = false;
  chapterToDelete!: ChapterDto;

  constructor(
    private chapterService: ChapterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChapters();
  }

  loadChapters(): void {
    this.loading = true;
    this.chapterService.getList(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.chapters = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadChapters();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadChapters();
  }

  confirmDelete(chapter: ChapterDto): void {
    this.chapterToDelete = chapter;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.chapterToDelete = null!;
  }

  deleteChapter(): void {
    if (!this.chapterToDelete) return;

    this.chapterService.delete(this.chapterToDelete.id).subscribe({
      next: () => {
        this.loadChapters();
        this.showDeleteConfirm = false;
        this.chapterToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete chapter:', error);
        this.showDeleteConfirm = false;
        this.chapterToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

}
