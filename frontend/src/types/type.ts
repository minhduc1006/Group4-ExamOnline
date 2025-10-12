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
  isDoingExam?: boolean;
  expiredDatePackage?: Date;
  isLocked?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: string;
}

export interface Articles {
  id?: number;
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

export interface SupportRequest {
  id: number;
  name: string;
  email: string;
  issueCategory: string;
  detail: string;
  dateCreated: string;
  supportAnswer: string;
  status: "open" | "close";
}

export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  user_id: number;
}
