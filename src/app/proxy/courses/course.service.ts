import type { CourseDto, CourseInfoHomeDto, CreateUpdateCourseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'POST',
      url: '/api/app/course',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  duplicateCourse = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: `/api/app/course/duplicate-course/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'GET',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCoursesInfo = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseInfoHomeDto>>({
      method: 'GET',
      url: `/api/app/course/courses-info/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  getCoursesInfoList = (pageNumber: number, pageSize: number, search: string, alreadyJoin: boolean, collegeId: string, subjectId: string, gradelevelId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseInfoHomeDto>>({
      method: 'GET',
      url: '/api/app/course/courses-info-list',
      params: { pageNumber, pageSize, search, alreadyJoin, collegeId, subjectId, gradelevelId },
    },
    { apiName: this.apiName,...config });
  

  getCoursesList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/course/courses-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseDto>>({
      method: 'GET',
      url: '/api/app/course',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getMyCoursesLookUp = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupDto>>({
      method: 'GET',
      url: '/api/app/course/my-courses-look-up',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseDto>>({
      method: 'PUT',
      url: `/api/app/course/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
