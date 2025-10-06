import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  initGrowthChart(canvasId: string) {
    const growthCtx = document.getElementById(canvasId) as HTMLCanvasElement;
    return new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        datasets: [
          {
            label: 'الطلاب',
            data: [1200, 1350, 1450, 1600, 1750, 1900, 2100, 2250, 2350, 2450, 2500, 2548],
            borderColor: '#63D8F2',
            backgroundColor: 'rgba(99, 216, 242, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'المعلمين',
            data: [80, 85, 90, 95, 100, 105, 110, 115, 118, 122, 125, 128],
            borderColor: '#7749A6',
            backgroundColor: 'rgba(119, 73, 166, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            rtl: true,
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(191, 195, 217, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  initCategoryChart(canvasId: string) {
    const categoryCtx = document.getElementById(canvasId) as HTMLCanvasElement;
    return new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['تطوير الويب', 'البرمجة', 'التسويق', 'التصميم', 'اللغات'],
        datasets: [{
          data: [95, 80, 65, 55, 61],
          backgroundColor: [
            '#4B93BF',
            '#7749A6',
            '#A2A0D9',
            '#63D8F2',
            '#371559'
          ],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            rtl: true,
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}