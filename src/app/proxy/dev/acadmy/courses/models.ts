import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { CourseChaptersDto } from '../chapters/models';

export interface CourseDto extends AuditedEntityDto<string> {
  name?: string;
  title?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  userId?: string;
  rating: number;
  userName?: string;
  collegeId?: string;
  collegeName?: string;
  subjectId?: string;
  questionBankId?: string;
  examId?: string;
  subjectName?: string;
  isActive: boolean;
  isLifetime: boolean;
  isPdf: boolean;
  pdfUrl?: string;
  introductionVideoUrl?: string;
  durationInDays?: number;
  infos: string[];
}

export interface CourseInfoDto extends AuditedEntityDto<string> {
  name?: string;
  courseId?: string;
  courseName?: string;
}

export interface CourseInfoHomeDto {
  id?: string;
  isPdf: boolean;
  pdfUrl?: string;
  name?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  userId?: string;
  userName?: string;
  teacherLogoUrl?: string;
  rating: number;
  collegeId?: string;
  collegeName?: string;
  subjectId?: string;
  subjectName?: string;
  gradelevelId?: string;
  gradelevelName?: string;
  alreadyJoin: boolean;
  alreadyRequest: boolean;
  chapterCount: number;
  lectureCount: number;
  introductionVideoUrl?: string;
  durationInWeeks?: number;
  infos: string[];
  courseChaptersDtos: CourseChaptersDto[];
}

export interface CourseLookupDto {
  courseId?: string;
  name?: string;
  isSelect: boolean;
}

export interface CourseStudentDto extends EntityDto<string> {
  userId?: string;
  name?: string;
  email?: string;
  creationTime?: string;
  logoUrl?: string;
  courseId?: string;
  courseName?: string;
  isSubscibe: boolean;
  phoneNumber?: string;
}

export interface CreateUpdateCourseDto {
  name?: string;
  title?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  isActive: boolean;
  isLifetime: boolean;
  durationInDays?: number;
  isPdf: boolean;
  pdfUrl?: string;
  introductionVideoUrl?: string;
  subjectId?: string;
  infos: string[];
}

export interface CreateUpdateCourseInfoDto {
  name?: string;
  courseId?: string;
}

export interface CreateUpdateCourseStudentDto {
  userId?: string;
  courseId?: string;
  isSubscibe: boolean;
}

export interface CreateUpdateStudentCoursesDto {
  userId?: string;
  courseIds: string[];
}

export interface StudentDegreeByCourseDto {
  userId?: string;
  name?: string;
  logoUrl?: string;
  quizzes: StudentQuizDto[];
}

export interface StudentQuizDto {
  quizName?: string;
  lectureName?: string;
  quizScore: number;
  tryCount: number;
}
