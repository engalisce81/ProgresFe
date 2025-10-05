import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';

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
  subjectName?: string;
  isActive: boolean;
  isLifetime: boolean;
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
  name?: string;
  description?: string;
  price: number;
  logoUrl?: string;
  userId?: string;
  userName?: string;
  rating: number;
  collegeId?: string;
  collegeName?: string;
  subjectId?: string;
  subjectName?: string;
  alreadyJoin: boolean;
  alreadyRequest: boolean;
  chapterCount: number;
  durationInWeeks?: number;
  infos: string[];
}

export interface CourseStudentDto extends EntityDto<string> {
  userId?: string;
  userName?: string;
  courseId?: string;
  courseName?: string;
  isSubscibe: boolean;
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
