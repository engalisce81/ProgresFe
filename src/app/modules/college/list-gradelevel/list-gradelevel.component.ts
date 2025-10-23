import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GradeLevelDto, GradeLevelService } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-gradelevel',
  imports: [FormsModule ,RouterLink],
  templateUrl: './list-gradelevel.component.html',
  styleUrl: './list-gradelevel.component.scss'
})
export class ListGradelevelComponent {
  gradeLevels: GradeLevelDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  collegeId!: string;

  constructor(
    private gradeLevelService: GradeLevelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 🔹 الحصول على collegeId من الـ route param
    this.collegeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadGradeLevels();
  }

  loadGradeLevels(): void {
    this.loading = true;

    this.gradeLevelService
      .getList(this.pageIndex, this.pageSize, this.search, this.collegeId)
      .subscribe({
        next: (res) => {
          this.gradeLevels = res.items;
          this.totalCount = res.totalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.loadGradeLevels();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadGradeLevels();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  showDeleteConfirm = false;
gradeLevelToDelete: any = null;

confirmDelete(level: any) {
  this.gradeLevelToDelete = level;
  this.showDeleteConfirm = true;
}

cancelDelete() {
  this.showDeleteConfirm = false;
  this.gradeLevelToDelete = null;
}

deleteGradeLevel() {
  if (!this.gradeLevelToDelete) return;

  this.gradeLevelService.delete(this.gradeLevelToDelete.id).subscribe({
    next: () => {
      this.showDeleteConfirm = false;
      this.gradeLevelToDelete = null;
      this.loadGradeLevels(); // إعادة تحميل القائمة
    },
    error: (err) => {
      console.error(err);
      alert('Failed to delete grade level.');
    },
  });
}

}
