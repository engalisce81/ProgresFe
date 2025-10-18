
export interface CreateUpdateTeacherDto {
  fullName?: string;
  phoneNumber?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  accountTypeKey: number;
}

export interface TeacherDto {
  id?: string;
  phoneNumber?: string;
  fullName?: string;
  userName?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  accountTypeKey: number;
}
