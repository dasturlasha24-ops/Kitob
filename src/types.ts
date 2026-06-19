export interface ReadingLog {
  id: string;
  bookTitle: string;
  pages: number;
  date: string; // ISO string
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string; // e.g., "5-sinf", "6-sinf", etc.
  totalPoints: number; // 1 page = 1 point
  createdAt: string;
  readingLogs: ReadingLog[];
}

export interface GradeSummary {
  grade: string;
  totalStudents: number;
  totalPages: number;
}
