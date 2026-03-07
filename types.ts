export enum CourseType {
  WEB = 'web',
  DATA = 'data'
}

export interface TechnicalChallenge {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  learningPoints: string[];
  detailedContent: string;
  seniorTip: string;
  challenge: TechnicalChallenge;
}

export interface CourseData {
  id: CourseType;
  title: string;
  description: string;
  modules: CourseModule[];
}

export interface User {
  id: string;
  email: string;
  courseChosen: CourseType | null;
  lastStepCompleted: number;
  isLoggedIn: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
