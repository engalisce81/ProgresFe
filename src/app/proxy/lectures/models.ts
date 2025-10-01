import type { EntityDto } from '@abp/ng.core';
import type { QuizInfoDto, QuizWithQuestionsDto } from '../quizzes/models';

export interface CreateUpdateLectureDto {
  title?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  chapterId?: string;
  isVisible: boolean;
  quizTime: number;
  quizTryCount: number;
  quizCount: number;
}

export interface LectureDto extends EntityDto<string> {
  title?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  chapterId?: string;
  courseId?: string;
  chapterName?: string;
  quizTime: number;
  quizTryCount: number;
  isVisible: boolean;
}

export interface LectureInfoDto {
  lectureId?: string;
  title?: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  quiz: QuizInfoDto;
}

export interface LectureWithQuizzesDto {
  id?: string;
  title?: string;
  quizzes: QuizWithQuestionsDto[];
}
