import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateExamDto {
  name?: string;
  timeExam: number;
  score: number;
  isActive: boolean;
  courseId?: string;
}

export interface CreateUpdateExamQuestionDto {
  examId?: string;
  questionIds: string[];
  questionBankIds: string[];
}

export interface ExamDto extends EntityDto<string> {
  name?: string;
  timeExam: number;
  score: number;
  isActive: boolean;
  courseId?: string;
}

export interface ExamQuestionAnswerDto {
  answerId?: string;
  answer?: string;
  isSelected: boolean;
}

export interface ExamQuestionsDto {
  id?: string;
  tittle?: string;
  questionType?: string;
  isSelected: boolean;
  questionAnswers: ExamQuestionAnswerDto[];
}
