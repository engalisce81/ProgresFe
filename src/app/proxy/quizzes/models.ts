import type { QuestionAnswerInfoDto, QuestionDetailesDto, QuestionWithAnswersDto } from '../questions/models';
import type { EntityDto } from '@abp/ng.core';

export interface QuizInfoDto {
  quizId?: string;
  title?: string;
  questionsCount: number;
  quizTryCount: number;
  tryedCount: number;
  alreadyAnswer: boolean;
}

export interface QuizWithQuestionsDto {
  id?: string;
  title?: string;
  questions: QuestionWithAnswersDto[];
}

export interface CreateUpdateQuizDto {
  createrId?: string;
  title?: string;
  description?: string;
  quizTime: number;
  quizTryCount: number;
  lectureId?: string;
}

export interface QuizAnswerDto {
  quizId?: string;
  answers: QuestionAnswerInfoDto[];
}

export interface QuizDetailsDto {
  quizId?: string;
  title?: string;
  quizTime: number;
  quizTryCount: number;
  questions: QuestionDetailesDto[];
}

export interface QuizDto extends EntityDto<string> {
  title?: string;
  description?: string;
  quizTime: number;
  quizTryCount: number;
  leactureName?: string;
}

export interface QuizResultDto {
  quizId?: string;
  totalScore: number;
  studentScore: number;
}

export interface QuizStudentDto {
  lectureId?: string;
  userId?: string;
  quizId?: string;
  score: number;
}
