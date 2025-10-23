import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UniversityDto, UniversityService } from '@proxy/dev/acadmy/universites';

@Component({
  selector: 'app-list-university',
  imports: [FormsModule ,RouterLink],
  templateUrl: './list-university.component.html',
  styleUrl: './list-university.component.scss'
})
export class ListUniversityComponent {
  universities: UniversityDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation state
  showDeleteConfirm = false;
  universityToDelete!:UniversityDto;

  constructor(
    private universityService: UniversityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.loading = true;

    this.universityService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.universities = res.items;
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
    this.loadUniversities();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadUniversities();
  }

  confirmDelete(university: UniversityDto): void {
    this.universityToDelete = university;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.universityToDelete = null!;
  }

  deleteUniversity(): void {
    if (!this.universityToDelete) return;

    this.universityService.delete(this.universityToDelete.id).subscribe({
      next: () => {
        this.loadUniversities();
        this.showDeleteConfirm = false;
        this.universityToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete university:', error);
        this.showDeleteConfirm = false;
        this.universityToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
