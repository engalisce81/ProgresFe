import { AuthService } from '@abp/ng.core';
import { Component, inject } from '@angular/core';
import { ChartService } from '../service/chartServices';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  stats = [
    { title: 'Number of Students', value: '2,548', icon: 'fas fa-user-graduate', class: 'students', increase: '15%' },
    { title: 'Number of Teachers', value: '128', icon: 'fas fa-chalkboard-teacher', class: 'teachers', increase: '5%' },
    { title: 'Number of Courses', value: '356', icon: 'fas fa-book', class: 'courses', increase: '12%' },
  ];

  activities = [
    { icon: 'fas fa-user-plus', title: 'A new student joined the platform', time: '10 minutes ago' },
    { icon: 'fas fa-book', title: 'A new programming course was added', time: '2 hours ago' },
    { icon: 'fas fa-chart-line', title: 'Total revenue reached 50,000 SAR', time: '5 hours ago' },
    { icon: 'fas fa-graduation-cap', title: '100 students completed the Web Development course', time: '2 days ago' }
  ];

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.chartService.initGrowthChart('growthChart');
    this.chartService.initCategoryChart('categoryChart');
  }
}
