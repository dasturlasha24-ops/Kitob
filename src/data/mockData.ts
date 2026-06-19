import { Student } from "../types";

export const GRADES = [
  "5-sinf",
  "6-sinf",
  "7-sinf",
  "8-sinf",
  "9-sinf",
  "10-sinf",
  "11-sinf"
];

export const MOCK_BOOKS = [
  "Sariq devni minib",
  "O'tkan kunlar",
  "Shum bola",
  "Dunyoning ishlari",
  "Kecha va kunduz",
  "Yulduzli tunlar",
  "Kichik shahzoda",
  "Robinzon Kruzo",
  "Sherlok Xolms sarguzashtlari",
  "Alpomish",
  "Ufq romani",
  "Boburnoma",
  "Ikki eshik orasi"
];

// Seed standard mock students
export const INITIAL_STUDENTS: Student[] = [
  {
    id: "stud-1",
    firstName: "Asadbek",
    lastName: "Karimov",
    grade: "5-sinf",
    totalPoints: 340,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-1", bookTitle: "Sariq devni minib", pages: 120, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-2", bookTitle: "Kichik shahzoda", pages: 90, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-3", bookTitle: "Shum bola", pages: 130, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-2",
    firstName: "Madina",
    lastName: "Sirojiddinova",
    grade: "5-sinf",
    totalPoints: 420,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-4", bookTitle: "Dunyoning ishlari", pages: 180, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-5", bookTitle: "Kichik shahzoda", pages: 120, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-6", bookTitle: "Sariq devni minib", pages: 120, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-3",
    firstName: "Diyorbek",
    lastName: "Tursunov",
    grade: "6-sinf",
    totalPoints: 210,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-7", bookTitle: "Shum bola", pages: 110, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-8", bookTitle: "Robinzon Kruzo", pages: 100, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-4",
    firstName: "Guli",
    lastName: "Yo'ldosheva",
    grade: "7-sinf",
    totalPoints: 580,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-9", bookTitle: "O'tkan kunlar", pages: 350, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-10", bookTitle: "Ikki eshik orasi", pages: 230, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-5",
    firstName: "Sardor",
    lastName: "Alimov",
    grade: "7-sinf",
    totalPoints: 150,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-11", bookTitle: "Sherlok Xolms sarguzashtlari", pages: 150, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-6",
    firstName: "Nodira",
    lastName: "Shamsiyeva",
    grade: "8-sinf",
    totalPoints: 620,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-12", bookTitle: "Yulduzli tunlar", pages: 400, date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-13", bookTitle: "Kecha va kunduz", pages: 220, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-7",
    firstName: "Jahongir",
    lastName: "Rustamov",
    grade: "9-sinf",
    totalPoints: 310,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-14", bookTitle: "Boburnoma", pages: 160, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-15", bookTitle: "Sherlok Xolms sarguzashtlari", pages: 150, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-8",
    firstName: "Zahro",
    lastName: "Hakimova",
    grade: "10-sinf",
    totalPoints: 780,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-16", bookTitle: "Ikki eshik orasi", pages: 450, date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-17", bookTitle: "Ufq romani", pages: 330, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-9",
    firstName: "Bekzod",
    lastName: "Qodirov",
    grade: "11-sinf",
    totalPoints: 290,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-18", bookTitle: "O'tkan kunlar", pages: 290, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "stud-10",
    firstName: "Lobar",
    lastName: "Fayzullayeva",
    grade: "11-sinf",
    totalPoints: 810,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    readingLogs: [
      { id: "log-19", bookTitle: "Ufq romani", pages: 420, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "log-20", bookTitle: "Yulduzli tunlar", pages: 390, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];
