import type { EntityDto } from '@abp/ng.core';
import type { QuizInfoDto, QuizWithQuestionsDto } from '../quizzes/models';

export interface CreateUpdateLectureDto {
  title?: string;
  content?: string;
  videoUrl?: string;
  chapterId?: string;
  isVisible: boolean;
  quizTime: number;
  quizTryCount: number;
  quizCount: number;
  isFree: boolean;
  pdfUrls: string[];
}

export interface LectureDto extends EntityDto<string> {
  title?: string;
  content?: string;
  videoUrl?: string;
  chapterId?: string;
  courseId?: string;
  courseName?: string;
  chapterName?: string;
  quizTime: number;
  quizTryCount: number;
  quizCount: number;
  isVisible: boolean;
  isFree: boolean;
  pdfUrls: string[];
}

export interface LectureInfoDto {
  lectureId?: string;
  title?: string;
  content?: string;
  videoUrl?: string;
  pdfUrls: string[];
  quiz: QuizInfoDto;
}

export interface LectureWithQuizzesDto {
  id?: string;
  title?: string;
  quizzes: QuizWithQuestionsDto[];
}
