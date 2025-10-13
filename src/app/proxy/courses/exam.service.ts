import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateExamDto, ExamDto } from '../exams/models';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  apiName = 'Default';
  

  get = (questionBankId: string, examId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExamDto>({
      method: 'GET',
      url: '/api/app/exam',
      params: { questionBankId, examId },
    },
    { apiName: this.apiName,...config });
  

  updateExamByIdAndInput = (id: string, input: CreateUpdateExamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/exam/${id}/exam`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
