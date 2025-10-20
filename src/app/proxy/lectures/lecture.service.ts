import type { CreateUpdateLectureDto, LectureDto, LectureWithQuizzesDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LectureQuizResultDto, QuizAnswerDto, QuizDetailsDto, QuizResultDto, QuizStudentDto } from '../quizzes/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class LectureService {
  apiName = 'Default';
  

  correctQuiz = (input: QuizAnswerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizResultDto>>({
      method: 'POST',
      url: '/api/app/lecture/correct-quiz',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLectureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'POST',
      url: '/api/app/lecture',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/lecture/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'GET',
      url: `/api/app/lecture/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getLectureQuizResults = (lectureId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureQuizResultDto>>({
      method: 'GET',
      url: `/api/app/lecture/lecture-quiz-results/${lectureId}`,
    },
    { apiName: this.apiName,...config });
  

  getLectureWithQuizzes = (lectureId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureWithQuizzesDto>>({
      method: 'GET',
      url: `/api/app/lecture/lecture-with-quizzes/${lectureId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (pageNumber: number, pageSize: number, search: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LectureDto>>({
      method: 'GET',
      url: '/api/app/lecture',
      params: { pageNumber, pageSize, search },
    },
    { apiName: this.apiName,...config });
  

  getQuizDetails = (quizId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizDetailsDto>>({
      method: 'GET',
      url: `/api/app/lecture/quiz-details/${quizId}`,
    },
    { apiName: this.apiName,...config });
  

  markQuiz = (quizId: string, score: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<QuizStudentDto>>({
      method: 'POST',
      url: `/api/app/lecture/mark-quiz/${quizId}`,
      params: { score },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLectureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LectureDto>>({
      method: 'PUT',
      url: `/api/app/lecture/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
