import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistercustomDto, AccountcustomService } from '@proxy/account-customs';
import { LookupDto } from '@proxy/look-up';
import { UniversityService, CollegeService } from '@proxy/universites';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
 registerDto: RegistercustomDto = {
    fullName: '',
    userName: '',
    password: '',
    gender: true,
    universityId: '',
    collegeId: '',
    accountTypeKey: 2 // 🔹 ثابتة زي ما حضرتك قلت
  };

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];

  errorMessage: string = '';

  constructor(
    private accountService: AccountcustomService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => {
        this.universities = res.items;
      },
      error: (err) => console.error('Error loading universities', err)
    });
  }

  onUniversityChange(universityId: string) {
    this.registerDto.collegeId = '';
    this.colleges = [];
    if (universityId) {
      this.collegeService.getCollegesList(universityId).subscribe({
        next: (res) => {
          this.colleges = res.items;
        },
        error: (err) => console.error('Error loading colleges', err)
      });
    }
  }

  register() {
    this.accountService.register(this.registerDto).subscribe({
      next: (res) => {
        alert('✅ Register success');
        this.router.navigateByUrl('/accountc');
      },
      error: (err) => {
        console.error('❌ Register failed', err);
        this.errorMessage = err.error?.message || 'Register failed';
      }
    });
  }
}
