
export interface CreateUpdateExamDto {
  name?: string;
  timeExam: number;
  isActive: boolean;
  questionIds: string[];
}

export interface ExamDto {
  id?: string;
  name?: string;
  timeExam: number;
  isActive: boolean;
  examQuestions: ExamQuestions[];
}

export interface ExamQuestions {
  id?: string;
  tittle?: string;
  isSelected: boolean;
}
