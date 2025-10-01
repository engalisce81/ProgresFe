import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
     {
  path: '/',
  name: 'Home',
  iconClass: 'fas fa-home',
  order: 1,
  layout: eLayoutType.application,
},
{
  path: 'universties',
  name: 'Universties',
  iconClass: 'fas fa-university',
  order: 2,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Universites',
},
{
  path: 'colleges',
  name: 'Colleges',
  iconClass: 'fas fa-building',
  order: 3,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Colleges',
},
{
  path: 'subjects',
  name: 'Subjects',
  iconClass: 'fas fa-book',
  order: 4,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Subjects',
},
{
  path: 'courses',
  name: 'Courses',
  iconClass: 'fas fa-book',
  order: 5,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Courses',
},
{
  path: 'chapters',
  name: 'Chapters',
  iconClass: 'fas fa-file-alt',
  order: 6,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Chapters',
},
{
  path: 'lectures',
  name: 'Lectures',
  iconClass: 'fas fa-chalkboard',
  order: 7,
  layout: eLayoutType.application,
  requiredPolicy: 'Acadmy.Lectures',
},

    ]);
  };
}
