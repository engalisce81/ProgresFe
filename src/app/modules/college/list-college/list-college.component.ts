import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CollegeDto, CollegeService } from '@proxy/universites';

@Component({
  selector: 'app-list-college',
  imports: [FormsModule,RouterLink],
  templateUrl: './list-college.component.html',
  styleUrl: './list-college.component.scss'
})
export class ListCollegeComponent {
colleges: CollegeDto[] = [];
  loading = false;
  search = '';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 1;

  // Delete confirmation state
  showDeleteConfirm = false;
  collegeToDelete!: CollegeDto;

  constructor(
    private collegeService: CollegeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadColleges();
  }

  loadColleges(): void {
    this.loading = true;

    this.collegeService
      .getList(this.pageIndex, this.pageSize, this.search)
      .subscribe({
        next: (res) => {
          this.colleges = res.items;
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
    this.loadColleges();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadColleges();
  }

  confirmDelete(college: CollegeDto): void {
    this.collegeToDelete = college;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.collegeToDelete = null!;
  }

  deleteCollege(): void {
    if (!this.collegeToDelete) return;

    this.collegeService.delete(this.collegeToDelete.id).subscribe({
      next: () => {
        this.loadColleges();
        this.showDeleteConfirm = false;
        this.collegeToDelete = null!;
      },
      error: (error) => {
        console.error('Failed to delete college:', error);
        this.showDeleteConfirm = false;
        this.collegeToDelete = null!;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
