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
  { title: "Sariq devni minib", pages: 240 },
  { title: "O'tkan kunlar", pages: 380 },
  { title: "Shum bola", pages: 160 },
  { title: "Dunyoning ishlari", pages: 220 },
  { title: "Kecha va kunduz", pages: 310 },
  { title: "Yulduzli tunlar", pages: 450 },
  { title: "Kichik shahzoda", pages: 110 },
  { title: "Robinzon Kruzo", pages: 280 },
  { title: "Sherlok Xolms sarguzashtlari", pages: 260 },
  { title: "Alpomish", pages: 340 },
  { title: "Ufq romani", pages: 420 },
  { title: "Boburnoma", pages: 390 },
  { title: "Ikki eshik orasi", pages: 490 }
];

export const RAW_STUDENT_NAMES: string[] = [
  "Azizbek Karimov",
  "Muhammadali Abdullayev",
  "Bekzod Ismoilov",
  "Sardor Rahimov",
  "Jasur Tursunov",
  "Diyorbek Ergashev",
  "Shoxrux Qodirov",
  "Otabek Yusupov",
  "Asadbek Mahmudov",
  "Akmaljon Sodiqov",
  "Javohir Xasanov",
  "Bobur Mirzayev",
  "Ulug‘bek Raxmatov",
  "Farrux Olimov",
  "Temur Norqulov",
  "Sanjar Yoqubov",
  "Zafar Rustamov",
  "Islombek To‘xtayev",
  "Sherzod Aliyev",
  "Oybek Nazarov",
  "Abdulloh Hamroyev",
  "Ibrohim Sobirov",
  "Davron Murodov",
  "Umidjon G‘ulomov",
  "Jamshid Eshonqulov",
  "Mirjalol Haydarov",
  "Komiljon Jo‘rayev",
  "Shukurulloh Xolmatov",
  "Anvarbek Usmonov",
  "Behruz Po‘latov",
  "Dilshod Abduqahhorov",
  "Elyor Vohidov",
  "Rustam Qo‘chqorov",
  "Alisher Sa’dullayev",
  "Nodirbek Karimov",
  "Shohruh Bekmurodov",
  "Doniyor Tursunov",
  "Murodjon Abdumalikov",
  "Farhod Iskandarov",
  "Kamron Qosimov",
  "Muhammadaziz Rasulov",
  "Oybek Hamidov",
  "Azizjon Nematov",
  "Sardorbek Jalilov",
  "Akbar Xudoyberdiyev",
  "Jahongir Oripov",
  "Shavkat Mirzaqulov",
  "Doston Sobitov",
  "Bekmurod Yo‘ldoshev",
  "Sirojiddin Abdullayev",
  "Madina Karimova",
  "Zilola Ismoilova",
  "Shahnoza Rahimova",
  "Mohira Tursunova",
  "Sevinch Ergasheva",
  "Dilnoza Qodirova",
  "Maftuna Yusupova",
  "Nilufar Mahmudova",
  "Mushtariy Sodiqova",
  "Aziza Xasanova",
  "Malika Mirzayeva",
  "Gulnoza Raxmatova",
  "Nafisa Olimova",
  "Rayhona Norqulova",
  "Shaxzoda Yoqubova",
  "Madina Rustamova",
  "Iroda To‘xtayeva",
  "Feruza Aliyeva",
  "Dildora Nazarova",
  "Mohinur Hamroyeva",
  "Laylo Sobirova",
  "Umida Murodova",
  "Zarina G‘ulomova",
  "Shahzoda Eshonqulova",
  "Diyora Haydarova",
  "Munisa Jo‘rayeva",
  "Sitora Xolmatova",
  "Nigina Usmonova",
  "Gavhar Po‘latova",
  "Lola Abduqahhorova",
  "Shirin Vohidova",
  "Rayhona Qo‘chqorova",
  "Mohigul Sa’dullayeva",
  "Zebo Karimova",
  "Gulbahor Bekmurodova",
  "Fotima Tursunova",
  "Oydin Abdumalikova",
  "Shahlo Iskandarova",
  "Madinabonu Qosimova",
  "Zumrad Rasulova",
  "Sevara Hamidova",
  "Azimaxon Nematova",
  "Durdona Jalilova",
  "Munavvara Xudoyberdiyeva",
  "Nigora Oripova",
  "Rayyona Mirzaqulova",
  "Saodat Sobitova",
  "Nargiza Yo‘ldosheva",
  "Mohlaroyim Abdullayeva",
  "Gulrux Sirojiddinov"
];

// Generate 100 test students distributed across 5-11 grades
export function generate100TestStudents(): Student[] {
  return RAW_STUDENT_NAMES.map((name, index) => {
    const parts = name.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    const grade = GRADES[index % GRADES.length];
    
    // Deterministic point distribution to test Green (30%), Yellow (40%), and Red (30%) zones
    // Modulo cycle to vary high, medium, and low scores:
    const tier = (index * 7 + 3) % 10;
    
    let bookCount = 0;
    if (tier >= 7) {
      // High score tier (Yashil zona - Green)
      bookCount = 3 + (index % 3);
    } else if (tier >= 3) {
      // Middle score tier (Sariq zona - Yellow)
      bookCount = 2;
    } else {
      // Low score tier (Qizil zona - Red)
      bookCount = index % 4 === 0 ? 0 : 1;
    }

    const readingLogs = [];
    let totalPoints = 0;

    for (let b = 0; b < bookCount; b++) {
      const bookTemplate = MOCK_BOOKS[(index + b * 4) % MOCK_BOOKS.length];
      const pages = Math.floor(bookTemplate.pages * (0.8 + (index % 5) * 0.1));
      totalPoints += pages;
      readingLogs.push({
        id: `log-test-${index}-${b + 1}`,
        bookTitle: bookTemplate.title,
        pages,
        date: new Date(Date.now() - (b + 1) * 86400000 * 3).toISOString()
      });
    }

    return {
      id: `student-test-${index + 1}`,
      firstName,
      lastName,
      grade,
      readingLogs,
      totalPoints,
      createdAt: new Date(Date.now() - (100 - index) * 3600000).toISOString()
    };
  });
}

// Default empty initial students for clean production use
export const INITIAL_STUDENTS: Student[] = [];
