import type { CreateUpdateExamDto, CreateUpdateExamQuestionDto, ExamDto, ExamQuestionsDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  apiName = 'Default';
  

  addQuestionToExam = (input: CreateUpdateExamQuestionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/exam/question-to-exam',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateExamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ExamDto>>({
      method: 'POST',
      url: '/api/app/exam',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/exam/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ExamDto>>({
      method: 'GET',
      url: `/api/app/exam/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ExamDto>>({
      method: 'GET',
      url: '/api/app/exam',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getQuestionsFromBank = (bankIds: string[], examId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ExamQuestionsDto>>({
      method: 'GET',
      url: `/api/app/exam/questions-from-bank/${examId}`,
      params: { bankIds },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateExamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<ExamDto>>({
      method: 'PUT',
      url: `/api/app/exam/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
