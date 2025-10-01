import type { CourseStudentDto, CreateUpdateCourseStudentDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class CourseStudentService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCourseStudentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseStudentDto>>({
      method: 'POST',
      url: '/api/app/course-student',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/course-student/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseStudentDto>>({
      method: 'GET',
      url: `/api/app/course-student/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, isSubscribe: boolean, courseId: string, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseStudentDto>>({
      method: 'GET',
      url: '/api/app/course-student',
      params: { pageNumber, pageSize, isSubscribe, courseId, search },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseStudentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<CourseStudentDto>>({
      method: 'PUT',
      url: `/api/app/course-student/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
