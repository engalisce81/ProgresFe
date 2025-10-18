import type { EntityDto } from '@abp/ng.core';
import type { LectureInfoDto } from '../lectures/models';

export interface ChapterDto extends EntityDto<string> {
  name?: string;
  courseId?: string;
  courseName?: string;
}

export interface CourseChaptersDto {
  chapterId?: string;
  chapterName?: string;
  courseId?: string;
  courseName?: string;
  lectureCount: number;
  lectures: LectureInfoDto[];
}

export interface CreateUpdateChapterDto {
  name?: string;
  courseId?: string;
}
