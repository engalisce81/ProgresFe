
export interface CreateUpdateStudentDto {
  fullName?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  gradeLevelId?: string;
  accountTypeKey: number;
  studentMobileIP?: string;
}

export interface StudentDto {
  id?: string;
  fullName?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  gradeLevelId?: string;
  accountTypeKey: number;
  studentMobileIP?: string;
}
