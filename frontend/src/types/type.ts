export interface User {
  id?: number;
  username: string;
  name?: string;
  gender?: string;
  birthDate?: Date;
  email?: string;
  password: string;
  role: string;
  province?: string;
  district?: string;
  ward?: string;
  grade?: number;
  educationLevel?: string;
  accountType: string;
  isDoingExam: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: string;
}

export interface Articles {
  id: number;
  date?: string;
  title: string;
  content: string;
  summaryContent: string;
  imageUrl: string;
  articlesType: string;
}

export interface Schedule {
  id: number;
  roundName: string;
  examDate: string;
}
