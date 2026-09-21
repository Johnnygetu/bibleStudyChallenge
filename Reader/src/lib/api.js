function parseChapters(chaptersStr) {
  const result = [];
  for (const part of chaptersStr.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      result.push(Number(trimmed));
    }
  }
  return result;
}
function getChapterLabels(book, chapters) {
  return parseChapters(chapters).map((ch) => `${book} ${ch}`);
}
const DUMMY_PLAN = [
  {
    "id": "rp-1",
    "day_number": 1,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-2",
    "day_number": 2,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-3",
    "day_number": 3,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-4",
    "day_number": 4,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-5",
    "day_number": 5,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-6",
    "day_number": 6,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-7",
    "day_number": 7,
    "week_number": 1,
    "book": "Genesis",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-8",
    "day_number": 8,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-9",
    "day_number": 9,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-10",
    "day_number": 10,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-11",
    "day_number": 11,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-12",
    "day_number": 12,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-13",
    "day_number": 13,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-14",
    "day_number": 14,
    "week_number": 2,
    "book": "Genesis",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-15",
    "day_number": 15,
    "week_number": 3,
    "book": "Genesis",
    "chapters": "43-45",
    "chapters_total": 3
  },
  {
    "id": "rp-16",
    "day_number": 16,
    "week_number": 3,
    "book": "Genesis",
    "chapters": "46-48",
    "chapters_total": 3
  },
  {
    "id": "rp-17",
    "day_number": 17,
    "week_number": 3,
    "book": "Genesis",
    "chapters": "49-50",
    "chapters_total": 2
  },
  {
    "id": "rp-18",
    "day_number": 18,
    "week_number": 3,
    "book": "Exodus",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-19",
    "day_number": 19,
    "week_number": 3,
    "book": "Exodus",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-20",
    "day_number": 20,
    "week_number": 3,
    "book": "Exodus",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-21",
    "day_number": 21,
    "week_number": 3,
    "book": "Exodus",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-22",
    "day_number": 22,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-23",
    "day_number": 23,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-24",
    "day_number": 24,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-25",
    "day_number": 25,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-26",
    "day_number": 26,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-27",
    "day_number": 27,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-28",
    "day_number": 28,
    "week_number": 4,
    "book": "Exodus",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-29",
    "day_number": 29,
    "week_number": 5,
    "book": "Exodus",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-30",
    "day_number": 30,
    "week_number": 5,
    "book": "Exodus",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-31",
    "day_number": 31,
    "week_number": 5,
    "book": "Exodus",
    "chapters": "40",
    "chapters_total": 1
  },
  {
    "id": "rp-32",
    "day_number": 32,
    "week_number": 5,
    "book": "Leviticus",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-33",
    "day_number": 33,
    "week_number": 5,
    "book": "Leviticus",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-34",
    "day_number": 34,
    "week_number": 5,
    "book": "Leviticus",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-35",
    "day_number": 35,
    "week_number": 5,
    "book": "Leviticus",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-36",
    "day_number": 36,
    "week_number": 6,
    "book": "Leviticus",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-37",
    "day_number": 37,
    "week_number": 6,
    "book": "Leviticus",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-38",
    "day_number": 38,
    "week_number": 6,
    "book": "Leviticus",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-39",
    "day_number": 39,
    "week_number": 6,
    "book": "Leviticus",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-40",
    "day_number": 40,
    "week_number": 6,
    "book": "Leviticus",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-41",
    "day_number": 41,
    "week_number": 6,
    "book": "Numbers",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-42",
    "day_number": 42,
    "week_number": 6,
    "book": "Numbers",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-43",
    "day_number": 43,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-44",
    "day_number": 44,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-45",
    "day_number": 45,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-46",
    "day_number": 46,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-47",
    "day_number": 47,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-48",
    "day_number": 48,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-49",
    "day_number": 49,
    "week_number": 7,
    "book": "Numbers",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-50",
    "day_number": 50,
    "week_number": 8,
    "book": "Numbers",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-51",
    "day_number": 51,
    "week_number": 8,
    "book": "Numbers",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-52",
    "day_number": 52,
    "week_number": 8,
    "book": "Numbers",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-53",
    "day_number": 53,
    "week_number": 8,
    "book": "Deuteronomy",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-54",
    "day_number": 54,
    "week_number": 8,
    "book": "Deuteronomy",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-55",
    "day_number": 55,
    "week_number": 8,
    "book": "Deuteronomy",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-56",
    "day_number": 56,
    "week_number": 8,
    "book": "Deuteronomy",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-57",
    "day_number": 57,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-58",
    "day_number": 58,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-59",
    "day_number": 59,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-60",
    "day_number": 60,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-61",
    "day_number": 61,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-62",
    "day_number": 62,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-63",
    "day_number": 63,
    "week_number": 9,
    "book": "Deuteronomy",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-64",
    "day_number": 64,
    "week_number": 10,
    "book": "Deuteronomy",
    "chapters": "34",
    "chapters_total": 1
  },
  {
    "id": "rp-65",
    "day_number": 65,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-66",
    "day_number": 66,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-67",
    "day_number": 67,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-68",
    "day_number": 68,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-69",
    "day_number": 69,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-70",
    "day_number": 70,
    "week_number": 10,
    "book": "Joshua",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-71",
    "day_number": 71,
    "week_number": 11,
    "book": "Joshua",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-72",
    "day_number": 72,
    "week_number": 11,
    "book": "Joshua",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-73",
    "day_number": 73,
    "week_number": 11,
    "book": "Judges",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-74",
    "day_number": 74,
    "week_number": 11,
    "book": "Judges",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-75",
    "day_number": 75,
    "week_number": 11,
    "book": "Judges",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-76",
    "day_number": 76,
    "week_number": 11,
    "book": "Judges",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-77",
    "day_number": 77,
    "week_number": 11,
    "book": "Judges",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-78",
    "day_number": 78,
    "week_number": 12,
    "book": "Judges",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-79",
    "day_number": 79,
    "week_number": 12,
    "book": "Judges",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-80",
    "day_number": 80,
    "week_number": 12,
    "book": "Ruth",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-81",
    "day_number": 81,
    "week_number": 12,
    "book": "Ruth",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-82",
    "day_number": 82,
    "week_number": 12,
    "book": "1 Samuel",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-83",
    "day_number": 83,
    "week_number": 12,
    "book": "1 Samuel",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-84",
    "day_number": 84,
    "week_number": 12,
    "book": "1 Samuel",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-85",
    "day_number": 85,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-86",
    "day_number": 86,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-87",
    "day_number": 87,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-88",
    "day_number": 88,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-89",
    "day_number": 89,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-90",
    "day_number": 90,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-91",
    "day_number": 91,
    "week_number": 13,
    "book": "1 Samuel",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-92",
    "day_number": 92,
    "week_number": 14,
    "book": "1 Samuel",
    "chapters": "31",
    "chapters_total": 1
  },
  {
    "id": "rp-93",
    "day_number": 93,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-94",
    "day_number": 94,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-95",
    "day_number": 95,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-96",
    "day_number": 96,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-97",
    "day_number": 97,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-98",
    "day_number": 98,
    "week_number": 14,
    "book": "2 Samuel",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-99",
    "day_number": 99,
    "week_number": 15,
    "book": "2 Samuel",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-100",
    "day_number": 100,
    "week_number": 15,
    "book": "2 Samuel",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-101",
    "day_number": 101,
    "week_number": 15,
    "book": "1 Kings",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-102",
    "day_number": 102,
    "week_number": 15,
    "book": "1 Kings",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-103",
    "day_number": 103,
    "week_number": 15,
    "book": "1 Kings",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-104",
    "day_number": 104,
    "week_number": 15,
    "book": "1 Kings",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-105",
    "day_number": 105,
    "week_number": 15,
    "book": "1 Kings",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-106",
    "day_number": 106,
    "week_number": 16,
    "book": "1 Kings",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-107",
    "day_number": 107,
    "week_number": 16,
    "book": "1 Kings",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-108",
    "day_number": 108,
    "week_number": 16,
    "book": "1 Kings",
    "chapters": "22",
    "chapters_total": 1
  },
  {
    "id": "rp-109",
    "day_number": 109,
    "week_number": 16,
    "book": "2 Kings",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-110",
    "day_number": 110,
    "week_number": 16,
    "book": "2 Kings",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-111",
    "day_number": 111,
    "week_number": 16,
    "book": "2 Kings",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-112",
    "day_number": 112,
    "week_number": 16,
    "book": "2 Kings",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-113",
    "day_number": 113,
    "week_number": 17,
    "book": "2 Kings",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-114",
    "day_number": 114,
    "week_number": 17,
    "book": "2 Kings",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-115",
    "day_number": 115,
    "week_number": 17,
    "book": "2 Kings",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-116",
    "day_number": 116,
    "week_number": 17,
    "book": "2 Kings",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-117",
    "day_number": 117,
    "week_number": 17,
    "book": "2 Kings",
    "chapters": "25",
    "chapters_total": 1
  },
  {
    "id": "rp-118",
    "day_number": 118,
    "week_number": 17,
    "book": "1 Chronicles",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-119",
    "day_number": 119,
    "week_number": 17,
    "book": "1 Chronicles",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-120",
    "day_number": 120,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-121",
    "day_number": 121,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-122",
    "day_number": 122,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-123",
    "day_number": 123,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-124",
    "day_number": 124,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-125",
    "day_number": 125,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-126",
    "day_number": 126,
    "week_number": 18,
    "book": "1 Chronicles",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-127",
    "day_number": 127,
    "week_number": 19,
    "book": "1 Chronicles",
    "chapters": "28-29",
    "chapters_total": 2
  },
  {
    "id": "rp-128",
    "day_number": 128,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-129",
    "day_number": 129,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-130",
    "day_number": 130,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-131",
    "day_number": 131,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-132",
    "day_number": 132,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-133",
    "day_number": 133,
    "week_number": 19,
    "book": "2 Chronicles",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-134",
    "day_number": 134,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-135",
    "day_number": 135,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-136",
    "day_number": 136,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-137",
    "day_number": 137,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-138",
    "day_number": 138,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-139",
    "day_number": 139,
    "week_number": 20,
    "book": "2 Chronicles",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-140",
    "day_number": 140,
    "week_number": 20,
    "book": "Ezra",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-141",
    "day_number": 141,
    "week_number": 21,
    "book": "Ezra",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-142",
    "day_number": 142,
    "week_number": 21,
    "book": "Ezra",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-143",
    "day_number": 143,
    "week_number": 21,
    "book": "Ezra",
    "chapters": "10",
    "chapters_total": 1
  },
  {
    "id": "rp-144",
    "day_number": 144,
    "week_number": 21,
    "book": "Nehemiah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-145",
    "day_number": 145,
    "week_number": 21,
    "book": "Nehemiah",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-146",
    "day_number": 146,
    "week_number": 21,
    "book": "Nehemiah",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-147",
    "day_number": 147,
    "week_number": 21,
    "book": "Nehemiah",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-148",
    "day_number": 148,
    "week_number": 22,
    "book": "Nehemiah",
    "chapters": "13",
    "chapters_total": 1
  },
  {
    "id": "rp-149",
    "day_number": 149,
    "week_number": 22,
    "book": "Esther",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-150",
    "day_number": 150,
    "week_number": 22,
    "book": "Esther",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-151",
    "day_number": 151,
    "week_number": 22,
    "book": "Esther",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-152",
    "day_number": 152,
    "week_number": 22,
    "book": "Esther",
    "chapters": "10",
    "chapters_total": 1
  },
  {
    "id": "rp-153",
    "day_number": 153,
    "week_number": 22,
    "book": "Job",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-154",
    "day_number": 154,
    "week_number": 22,
    "book": "Job",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-155",
    "day_number": 155,
    "week_number": 23,
    "book": "Job",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-156",
    "day_number": 156,
    "week_number": 23,
    "book": "Job",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-157",
    "day_number": 157,
    "week_number": 23,
    "book": "Job",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-158",
    "day_number": 158,
    "week_number": 23,
    "book": "Job",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-159",
    "day_number": 159,
    "week_number": 23,
    "book": "Job",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-160",
    "day_number": 160,
    "week_number": 23,
    "book": "Job",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-161",
    "day_number": 161,
    "week_number": 23,
    "book": "Job",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-162",
    "day_number": 162,
    "week_number": 24,
    "book": "Job",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-163",
    "day_number": 163,
    "week_number": 24,
    "book": "Job",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-164",
    "day_number": 164,
    "week_number": 24,
    "book": "Job",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-165",
    "day_number": 165,
    "week_number": 24,
    "book": "Job",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-166",
    "day_number": 166,
    "week_number": 24,
    "book": "Job",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-167",
    "day_number": 167,
    "week_number": 24,
    "book": "Psalms",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-168",
    "day_number": 168,
    "week_number": 24,
    "book": "Psalms",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-169",
    "day_number": 169,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-170",
    "day_number": 170,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-171",
    "day_number": 171,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-172",
    "day_number": 172,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-173",
    "day_number": 173,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-174",
    "day_number": 174,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-175",
    "day_number": 175,
    "week_number": 25,
    "book": "Psalms",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-176",
    "day_number": 176,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-177",
    "day_number": 177,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-178",
    "day_number": 178,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-179",
    "day_number": 179,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-180",
    "day_number": 180,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-181",
    "day_number": 181,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "43-45",
    "chapters_total": 3
  },
  {
    "id": "rp-182",
    "day_number": 182,
    "week_number": 26,
    "book": "Psalms",
    "chapters": "46-48",
    "chapters_total": 3
  },
  {
    "id": "rp-183",
    "day_number": 183,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "49-51",
    "chapters_total": 3
  },
  {
    "id": "rp-184",
    "day_number": 184,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "52-54",
    "chapters_total": 3
  },
  {
    "id": "rp-185",
    "day_number": 185,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "55-57",
    "chapters_total": 3
  },
  {
    "id": "rp-186",
    "day_number": 186,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "58-60",
    "chapters_total": 3
  },
  {
    "id": "rp-187",
    "day_number": 187,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "61-63",
    "chapters_total": 3
  },
  {
    "id": "rp-188",
    "day_number": 188,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "64-66",
    "chapters_total": 3
  },
  {
    "id": "rp-189",
    "day_number": 189,
    "week_number": 27,
    "book": "Psalms",
    "chapters": "67-69",
    "chapters_total": 3
  },
  {
    "id": "rp-190",
    "day_number": 190,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "70-72",
    "chapters_total": 3
  },
  {
    "id": "rp-191",
    "day_number": 191,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "73-75",
    "chapters_total": 3
  },
  {
    "id": "rp-192",
    "day_number": 192,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "76-78",
    "chapters_total": 3
  },
  {
    "id": "rp-193",
    "day_number": 193,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "79-81",
    "chapters_total": 3
  },
  {
    "id": "rp-194",
    "day_number": 194,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "82-84",
    "chapters_total": 3
  },
  {
    "id": "rp-195",
    "day_number": 195,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "85-87",
    "chapters_total": 3
  },
  {
    "id": "rp-196",
    "day_number": 196,
    "week_number": 28,
    "book": "Psalms",
    "chapters": "88-90",
    "chapters_total": 3
  },
  {
    "id": "rp-197",
    "day_number": 197,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "91-93",
    "chapters_total": 3
  },
  {
    "id": "rp-198",
    "day_number": 198,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "94-96",
    "chapters_total": 3
  },
  {
    "id": "rp-199",
    "day_number": 199,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "97-99",
    "chapters_total": 3
  },
  {
    "id": "rp-200",
    "day_number": 200,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "100-102",
    "chapters_total": 3
  },
  {
    "id": "rp-201",
    "day_number": 201,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "103-105",
    "chapters_total": 3
  },
  {
    "id": "rp-202",
    "day_number": 202,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "106-108",
    "chapters_total": 3
  },
  {
    "id": "rp-203",
    "day_number": 203,
    "week_number": 29,
    "book": "Psalms",
    "chapters": "109-111",
    "chapters_total": 3
  },
  {
    "id": "rp-204",
    "day_number": 204,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "112-114",
    "chapters_total": 3
  },
  {
    "id": "rp-205",
    "day_number": 205,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "115-117",
    "chapters_total": 3
  },
  {
    "id": "rp-206",
    "day_number": 206,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "118-120",
    "chapters_total": 3
  },
  {
    "id": "rp-207",
    "day_number": 207,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "121-123",
    "chapters_total": 3
  },
  {
    "id": "rp-208",
    "day_number": 208,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "124-126",
    "chapters_total": 3
  },
  {
    "id": "rp-209",
    "day_number": 209,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "127-129",
    "chapters_total": 3
  },
  {
    "id": "rp-210",
    "day_number": 210,
    "week_number": 30,
    "book": "Psalms",
    "chapters": "130-132",
    "chapters_total": 3
  },
  {
    "id": "rp-211",
    "day_number": 211,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "133-135",
    "chapters_total": 3
  },
  {
    "id": "rp-212",
    "day_number": 212,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "136-138",
    "chapters_total": 3
  },
  {
    "id": "rp-213",
    "day_number": 213,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "139-141",
    "chapters_total": 3
  },
  {
    "id": "rp-214",
    "day_number": 214,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "142-144",
    "chapters_total": 3
  },
  {
    "id": "rp-215",
    "day_number": 215,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "145-147",
    "chapters_total": 3
  },
  {
    "id": "rp-216",
    "day_number": 216,
    "week_number": 31,
    "book": "Psalms",
    "chapters": "148-150",
    "chapters_total": 3
  },
  {
    "id": "rp-217",
    "day_number": 217,
    "week_number": 31,
    "book": "Proverbs",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-218",
    "day_number": 218,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-219",
    "day_number": 219,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-220",
    "day_number": 220,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-221",
    "day_number": 221,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-222",
    "day_number": 222,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-223",
    "day_number": 223,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-224",
    "day_number": 224,
    "week_number": 32,
    "book": "Proverbs",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-225",
    "day_number": 225,
    "week_number": 33,
    "book": "Proverbs",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-226",
    "day_number": 226,
    "week_number": 33,
    "book": "Proverbs",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-227",
    "day_number": 227,
    "week_number": 33,
    "book": "Proverbs",
    "chapters": "31",
    "chapters_total": 1
  },
  {
    "id": "rp-228",
    "day_number": 228,
    "week_number": 33,
    "book": "Ecclesiastes",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-229",
    "day_number": 229,
    "week_number": 33,
    "book": "Ecclesiastes",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-230",
    "day_number": 230,
    "week_number": 33,
    "book": "Ecclesiastes",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-231",
    "day_number": 231,
    "week_number": 33,
    "book": "Ecclesiastes",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-232",
    "day_number": 232,
    "week_number": 34,
    "book": "Song of Solomon",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-233",
    "day_number": 233,
    "week_number": 34,
    "book": "Song of Solomon",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-234",
    "day_number": 234,
    "week_number": 34,
    "book": "Song of Solomon",
    "chapters": "7-8",
    "chapters_total": 2
  },
  {
    "id": "rp-235",
    "day_number": 235,
    "week_number": 34,
    "book": "Isaiah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-236",
    "day_number": 236,
    "week_number": 34,
    "book": "Isaiah",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-237",
    "day_number": 237,
    "week_number": 34,
    "book": "Isaiah",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-238",
    "day_number": 238,
    "week_number": 34,
    "book": "Isaiah",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-239",
    "day_number": 239,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-240",
    "day_number": 240,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-241",
    "day_number": 241,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-242",
    "day_number": 242,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-243",
    "day_number": 243,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-244",
    "day_number": 244,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-245",
    "day_number": 245,
    "week_number": 35,
    "book": "Isaiah",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-246",
    "day_number": 246,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-247",
    "day_number": 247,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-248",
    "day_number": 248,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-249",
    "day_number": 249,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "43-45",
    "chapters_total": 3
  },
  {
    "id": "rp-250",
    "day_number": 250,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "46-48",
    "chapters_total": 3
  },
  {
    "id": "rp-251",
    "day_number": 251,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "49-51",
    "chapters_total": 3
  },
  {
    "id": "rp-252",
    "day_number": 252,
    "week_number": 36,
    "book": "Isaiah",
    "chapters": "52-54",
    "chapters_total": 3
  },
  {
    "id": "rp-253",
    "day_number": 253,
    "week_number": 37,
    "book": "Isaiah",
    "chapters": "55-57",
    "chapters_total": 3
  },
  {
    "id": "rp-254",
    "day_number": 254,
    "week_number": 37,
    "book": "Isaiah",
    "chapters": "58-60",
    "chapters_total": 3
  },
  {
    "id": "rp-255",
    "day_number": 255,
    "week_number": 37,
    "book": "Isaiah",
    "chapters": "61-63",
    "chapters_total": 3
  },
  {
    "id": "rp-256",
    "day_number": 256,
    "week_number": 37,
    "book": "Isaiah",
    "chapters": "64-66",
    "chapters_total": 3
  },
  {
    "id": "rp-257",
    "day_number": 257,
    "week_number": 37,
    "book": "Jeremiah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-258",
    "day_number": 258,
    "week_number": 37,
    "book": "Jeremiah",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-259",
    "day_number": 259,
    "week_number": 37,
    "book": "Jeremiah",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-260",
    "day_number": 260,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-261",
    "day_number": 261,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-262",
    "day_number": 262,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-263",
    "day_number": 263,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-264",
    "day_number": 264,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-265",
    "day_number": 265,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-266",
    "day_number": 266,
    "week_number": 38,
    "book": "Jeremiah",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-267",
    "day_number": 267,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-268",
    "day_number": 268,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-269",
    "day_number": 269,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-270",
    "day_number": 270,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-271",
    "day_number": 271,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "43-45",
    "chapters_total": 3
  },
  {
    "id": "rp-272",
    "day_number": 272,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "46-48",
    "chapters_total": 3
  },
  {
    "id": "rp-273",
    "day_number": 273,
    "week_number": 39,
    "book": "Jeremiah",
    "chapters": "49-51",
    "chapters_total": 3
  },
  {
    "id": "rp-274",
    "day_number": 274,
    "week_number": 40,
    "book": "Jeremiah",
    "chapters": "52",
    "chapters_total": 1
  },
  {
    "id": "rp-275",
    "day_number": 275,
    "week_number": 40,
    "book": "Lamentations",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-276",
    "day_number": 276,
    "week_number": 40,
    "book": "Lamentations",
    "chapters": "4-5",
    "chapters_total": 2
  },
  {
    "id": "rp-277",
    "day_number": 277,
    "week_number": 40,
    "book": "Ezekiel",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-278",
    "day_number": 278,
    "week_number": 40,
    "book": "Ezekiel",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-279",
    "day_number": 279,
    "week_number": 40,
    "book": "Ezekiel",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-280",
    "day_number": 280,
    "week_number": 40,
    "book": "Ezekiel",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-281",
    "day_number": 281,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-282",
    "day_number": 282,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-283",
    "day_number": 283,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-284",
    "day_number": 284,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-285",
    "day_number": 285,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-286",
    "day_number": 286,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "28-30",
    "chapters_total": 3
  },
  {
    "id": "rp-287",
    "day_number": 287,
    "week_number": 41,
    "book": "Ezekiel",
    "chapters": "31-33",
    "chapters_total": 3
  },
  {
    "id": "rp-288",
    "day_number": 288,
    "week_number": 42,
    "book": "Ezekiel",
    "chapters": "34-36",
    "chapters_total": 3
  },
  {
    "id": "rp-289",
    "day_number": 289,
    "week_number": 42,
    "book": "Ezekiel",
    "chapters": "37-39",
    "chapters_total": 3
  },
  {
    "id": "rp-290",
    "day_number": 290,
    "week_number": 42,
    "book": "Ezekiel",
    "chapters": "40-42",
    "chapters_total": 3
  },
  {
    "id": "rp-291",
    "day_number": 291,
    "week_number": 42,
    "book": "Ezekiel",
    "chapters": "43-45",
    "chapters_total": 3
  },
  {
    "id": "rp-292",
    "day_number": 292,
    "week_number": 42,
    "book": "Ezekiel",
    "chapters": "46-48",
    "chapters_total": 3
  },
  {
    "id": "rp-293",
    "day_number": 293,
    "week_number": 42,
    "book": "Daniel",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-294",
    "day_number": 294,
    "week_number": 42,
    "book": "Daniel",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-295",
    "day_number": 295,
    "week_number": 43,
    "book": "Daniel",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-296",
    "day_number": 296,
    "week_number": 43,
    "book": "Daniel",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-297",
    "day_number": 297,
    "week_number": 43,
    "book": "Hosea",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-298",
    "day_number": 298,
    "week_number": 43,
    "book": "Hosea",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-299",
    "day_number": 299,
    "week_number": 43,
    "book": "Hosea",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-300",
    "day_number": 300,
    "week_number": 43,
    "book": "Hosea",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-301",
    "day_number": 301,
    "week_number": 43,
    "book": "Hosea",
    "chapters": "13-14",
    "chapters_total": 2
  },
  {
    "id": "rp-302",
    "day_number": 302,
    "week_number": 44,
    "book": "Joel",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-303",
    "day_number": 303,
    "week_number": 44,
    "book": "Amos",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-304",
    "day_number": 304,
    "week_number": 44,
    "book": "Amos",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-305",
    "day_number": 305,
    "week_number": 44,
    "book": "Amos",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-306",
    "day_number": 306,
    "week_number": 44,
    "book": "Obadiah",
    "chapters": "1",
    "chapters_total": 1
  },
  {
    "id": "rp-307",
    "day_number": 307,
    "week_number": 44,
    "book": "Jonah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-308",
    "day_number": 308,
    "week_number": 44,
    "book": "Jonah",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-309",
    "day_number": 309,
    "week_number": 45,
    "book": "Micah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-310",
    "day_number": 310,
    "week_number": 45,
    "book": "Micah",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-311",
    "day_number": 311,
    "week_number": 45,
    "book": "Micah",
    "chapters": "7",
    "chapters_total": 1
  },
  {
    "id": "rp-312",
    "day_number": 312,
    "week_number": 45,
    "book": "Nahum",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-313",
    "day_number": 313,
    "week_number": 45,
    "book": "Habakkuk",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-314",
    "day_number": 314,
    "week_number": 45,
    "book": "Zephaniah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-315",
    "day_number": 315,
    "week_number": 45,
    "book": "Haggai",
    "chapters": "1-2",
    "chapters_total": 2
  },
  {
    "id": "rp-316",
    "day_number": 316,
    "week_number": 46,
    "book": "Zechariah",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-317",
    "day_number": 317,
    "week_number": 46,
    "book": "Zechariah",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-318",
    "day_number": 318,
    "week_number": 46,
    "book": "Zechariah",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-319",
    "day_number": 319,
    "week_number": 46,
    "book": "Zechariah",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-320",
    "day_number": 320,
    "week_number": 46,
    "book": "Zechariah",
    "chapters": "13-14",
    "chapters_total": 2
  },
  {
    "id": "rp-321",
    "day_number": 321,
    "week_number": 46,
    "book": "Malachi",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-322",
    "day_number": 322,
    "week_number": 46,
    "book": "Malachi",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-323",
    "day_number": 323,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-324",
    "day_number": 324,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-325",
    "day_number": 325,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-326",
    "day_number": 326,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-327",
    "day_number": 327,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-328",
    "day_number": 328,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-329",
    "day_number": 329,
    "week_number": 47,
    "book": "Matthew",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-330",
    "day_number": 330,
    "week_number": 48,
    "book": "Matthew",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-331",
    "day_number": 331,
    "week_number": 48,
    "book": "Matthew",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-332",
    "day_number": 332,
    "week_number": 48,
    "book": "Matthew",
    "chapters": "28",
    "chapters_total": 1
  },
  {
    "id": "rp-333",
    "day_number": 333,
    "week_number": 48,
    "book": "Mark",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-334",
    "day_number": 334,
    "week_number": 48,
    "book": "Mark",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-335",
    "day_number": 335,
    "week_number": 48,
    "book": "Mark",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-336",
    "day_number": 336,
    "week_number": 48,
    "book": "Mark",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-337",
    "day_number": 337,
    "week_number": 49,
    "book": "Mark",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-338",
    "day_number": 338,
    "week_number": 49,
    "book": "Mark",
    "chapters": "16",
    "chapters_total": 1
  },
  {
    "id": "rp-339",
    "day_number": 339,
    "week_number": 49,
    "book": "Luke",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-340",
    "day_number": 340,
    "week_number": 49,
    "book": "Luke",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-341",
    "day_number": 341,
    "week_number": 49,
    "book": "Luke",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-342",
    "day_number": 342,
    "week_number": 49,
    "book": "Luke",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-343",
    "day_number": 343,
    "week_number": 49,
    "book": "Luke",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-344",
    "day_number": 344,
    "week_number": 50,
    "book": "Luke",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-345",
    "day_number": 345,
    "week_number": 50,
    "book": "Luke",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-346",
    "day_number": 346,
    "week_number": 50,
    "book": "Luke",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-347",
    "day_number": 347,
    "week_number": 50,
    "book": "John",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-348",
    "day_number": 348,
    "week_number": 50,
    "book": "John",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-349",
    "day_number": 349,
    "week_number": 50,
    "book": "John",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-350",
    "day_number": 350,
    "week_number": 50,
    "book": "John",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-351",
    "day_number": 351,
    "week_number": 51,
    "book": "John",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-352",
    "day_number": 352,
    "week_number": 51,
    "book": "John",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-353",
    "day_number": 353,
    "week_number": 51,
    "book": "John",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-354",
    "day_number": 354,
    "week_number": 51,
    "book": "Acts",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-355",
    "day_number": 355,
    "week_number": 51,
    "book": "Acts",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-356",
    "day_number": 356,
    "week_number": 51,
    "book": "Acts",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-357",
    "day_number": 357,
    "week_number": 51,
    "book": "Acts",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-358",
    "day_number": 358,
    "week_number": 52,
    "book": "Acts",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-359",
    "day_number": 359,
    "week_number": 52,
    "book": "Acts",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-360",
    "day_number": 360,
    "week_number": 52,
    "book": "Acts",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-361",
    "day_number": 361,
    "week_number": 52,
    "book": "Acts",
    "chapters": "22-24",
    "chapters_total": 3
  },
  {
    "id": "rp-362",
    "day_number": 362,
    "week_number": 52,
    "book": "Acts",
    "chapters": "25-27",
    "chapters_total": 3
  },
  {
    "id": "rp-363",
    "day_number": 363,
    "week_number": 52,
    "book": "Acts",
    "chapters": "28",
    "chapters_total": 1
  },
  {
    "id": "rp-364",
    "day_number": 364,
    "week_number": 52,
    "book": "Romans",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-365",
    "day_number": 365,
    "week_number": 53,
    "book": "Romans",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-366",
    "day_number": 366,
    "week_number": 53,
    "book": "Romans",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-367",
    "day_number": 367,
    "week_number": 53,
    "book": "Romans",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-368",
    "day_number": 368,
    "week_number": 53,
    "book": "Romans",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-369",
    "day_number": 369,
    "week_number": 53,
    "book": "Romans",
    "chapters": "16",
    "chapters_total": 1
  },
  {
    "id": "rp-370",
    "day_number": 370,
    "week_number": 53,
    "book": "1 Corinthians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-371",
    "day_number": 371,
    "week_number": 53,
    "book": "1 Corinthians",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-372",
    "day_number": 372,
    "week_number": 54,
    "book": "1 Corinthians",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-373",
    "day_number": 373,
    "week_number": 54,
    "book": "1 Corinthians",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-374",
    "day_number": 374,
    "week_number": 54,
    "book": "1 Corinthians",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-375",
    "day_number": 375,
    "week_number": 54,
    "book": "1 Corinthians",
    "chapters": "16",
    "chapters_total": 1
  },
  {
    "id": "rp-376",
    "day_number": 376,
    "week_number": 54,
    "book": "2 Corinthians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-377",
    "day_number": 377,
    "week_number": 54,
    "book": "2 Corinthians",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-378",
    "day_number": 378,
    "week_number": 54,
    "book": "2 Corinthians",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-379",
    "day_number": 379,
    "week_number": 55,
    "book": "2 Corinthians",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-380",
    "day_number": 380,
    "week_number": 55,
    "book": "2 Corinthians",
    "chapters": "13",
    "chapters_total": 1
  },
  {
    "id": "rp-381",
    "day_number": 381,
    "week_number": 55,
    "book": "Galatians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-382",
    "day_number": 382,
    "week_number": 55,
    "book": "Galatians",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-383",
    "day_number": 383,
    "week_number": 55,
    "book": "Ephesians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-384",
    "day_number": 384,
    "week_number": 55,
    "book": "Ephesians",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-385",
    "day_number": 385,
    "week_number": 55,
    "book": "Philippians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-386",
    "day_number": 386,
    "week_number": 56,
    "book": "Philippians",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-387",
    "day_number": 387,
    "week_number": 56,
    "book": "Colossians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-388",
    "day_number": 388,
    "week_number": 56,
    "book": "Colossians",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-389",
    "day_number": 389,
    "week_number": 56,
    "book": "1 Thessalonians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-390",
    "day_number": 390,
    "week_number": 56,
    "book": "1 Thessalonians",
    "chapters": "4-5",
    "chapters_total": 2
  },
  {
    "id": "rp-391",
    "day_number": 391,
    "week_number": 56,
    "book": "2 Thessalonians",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-392",
    "day_number": 392,
    "week_number": 56,
    "book": "1 Timothy",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-393",
    "day_number": 393,
    "week_number": 57,
    "book": "1 Timothy",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-394",
    "day_number": 394,
    "week_number": 57,
    "book": "2 Timothy",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-395",
    "day_number": 395,
    "week_number": 57,
    "book": "2 Timothy",
    "chapters": "4",
    "chapters_total": 1
  },
  {
    "id": "rp-396",
    "day_number": 396,
    "week_number": 57,
    "book": "Titus",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-397",
    "day_number": 397,
    "week_number": 57,
    "book": "Philemon",
    "chapters": "1",
    "chapters_total": 1
  },
  {
    "id": "rp-398",
    "day_number": 398,
    "week_number": 57,
    "book": "Hebrews",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-399",
    "day_number": 399,
    "week_number": 57,
    "book": "Hebrews",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-400",
    "day_number": 400,
    "week_number": 58,
    "book": "Hebrews",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-401",
    "day_number": 401,
    "week_number": 58,
    "book": "Hebrews",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-402",
    "day_number": 402,
    "week_number": 58,
    "book": "Hebrews",
    "chapters": "13",
    "chapters_total": 1
  },
  {
    "id": "rp-403",
    "day_number": 403,
    "week_number": 58,
    "book": "James",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-404",
    "day_number": 404,
    "week_number": 58,
    "book": "James",
    "chapters": "4-5",
    "chapters_total": 2
  },
  {
    "id": "rp-405",
    "day_number": 405,
    "week_number": 58,
    "book": "1 Peter",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-406",
    "day_number": 406,
    "week_number": 58,
    "book": "1 Peter",
    "chapters": "4-5",
    "chapters_total": 2
  },
  {
    "id": "rp-407",
    "day_number": 407,
    "week_number": 59,
    "book": "2 Peter",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-408",
    "day_number": 408,
    "week_number": 59,
    "book": "1 John",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-409",
    "day_number": 409,
    "week_number": 59,
    "book": "1 John",
    "chapters": "4-5",
    "chapters_total": 2
  },
  {
    "id": "rp-410",
    "day_number": 410,
    "week_number": 59,
    "book": "2 John",
    "chapters": "1",
    "chapters_total": 1
  },
  {
    "id": "rp-411",
    "day_number": 411,
    "week_number": 59,
    "book": "3 John",
    "chapters": "1",
    "chapters_total": 1
  },
  {
    "id": "rp-412",
    "day_number": 412,
    "week_number": 59,
    "book": "Jude",
    "chapters": "1",
    "chapters_total": 1
  },
  {
    "id": "rp-413",
    "day_number": 413,
    "week_number": 59,
    "book": "Revelation",
    "chapters": "1-3",
    "chapters_total": 3
  },
  {
    "id": "rp-414",
    "day_number": 414,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "4-6",
    "chapters_total": 3
  },
  {
    "id": "rp-415",
    "day_number": 415,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "7-9",
    "chapters_total": 3
  },
  {
    "id": "rp-416",
    "day_number": 416,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "10-12",
    "chapters_total": 3
  },
  {
    "id": "rp-417",
    "day_number": 417,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "13-15",
    "chapters_total": 3
  },
  {
    "id": "rp-418",
    "day_number": 418,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "16-18",
    "chapters_total": 3
  },
  {
    "id": "rp-419",
    "day_number": 419,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "19-21",
    "chapters_total": 3
  },
  {
    "id": "rp-420",
    "day_number": 420,
    "week_number": 60,
    "book": "Revelation",
    "chapters": "22",
    "chapters_total": 1
  }
];
async function fetchReadingPlanForDay(dayNumber) {
  await new Promise((r) => setTimeout(r, 100));
  return DUMMY_PLAN.filter((p) => p.day_number === dayNumber);
}
async function fetchReadingPlanForWeek(weekNumber) {
  await new Promise((r) => setTimeout(r, 100));
  return DUMMY_PLAN.filter((p) => p.week_number === weekNumber);
}
function getLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem("dummy_reading_progress") || "[]");
  } catch {
    return [];
  }
}
function setLocalProgress(progress) {
  localStorage.setItem("dummy_reading_progress", JSON.stringify(progress));
}
async function fetchReadingProgress(profileId, planDayIds) {
  await new Promise((r) => setTimeout(r, 100));
  return getLocalProgress().filter((p) => p.profile_id === profileId && planDayIds.includes(p.plan_day_id));
}
async function fetchAllReadingProgress(profileId) {
  await new Promise((r) => setTimeout(r, 100));
  return getLocalProgress().filter((p) => p.profile_id === profileId);
}
async function markChapterComplete(profileId, planDayId, chapterLabel) {
  const prog = getLocalProgress();
  if (!prog.find((p) => p.profile_id === profileId && p.plan_day_id === planDayId && p.chapter_label === chapterLabel)) {
    prog.push({
      id: "prog-" + Date.now(),
      profile_id: profileId,
      plan_day_id: planDayId,
      chapter_label: chapterLabel,
      completed_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    setLocalProgress(prog);
  }
}
async function unmarkChapter(profileId, planDayId, chapterLabel) {
  let prog = getLocalProgress();
  prog = prog.filter((p) => !(p.profile_id === profileId && p.plan_day_id === planDayId && p.chapter_label === chapterLabel));
  setLocalProgress(prog);
}
async function updateStreak(profileId, currentStreak, longestStreak, lastReadDate) {
  const cached = localStorage.getItem("bible_challenge_profile");
  if (cached) {
    const data = JSON.parse(cached);
    data.profile.current_streak = currentStreak;
    data.profile.longest_streak = longestStreak;
    data.profile.last_read_date = lastReadDate;
    localStorage.setItem("bible_challenge_profile", JSON.stringify(data));
    return data.profile;
  }
  throw new Error("Profile not found locally");
}
function getLocalQuestions() {
  try {
    return JSON.parse(localStorage.getItem("dummy_quizzes") || "[]");
  } catch {
    return [];
  }
}
async function fetchQuizQuestionsForChapter(chapterLabel) {
  await new Promise((r) => setTimeout(r, 100));
  const localQs = getLocalQuestions();
  const allQs = [...[
    {
      "id": "dummy-1",
      "week_number": 1,
      "book": "Genesis",
      "chapter": 1,
      "question_text": "What did God create on the first day?",
      "option_a": "Light",
      "option_b": "Sky",
      "option_c": "Land",
      "option_d": "Sun, Moon, and Stars",
      "correct_option": "a",
      "bible_reference": "Genesis 1:3",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-2",
      "week_number": 1,
      "book": "Genesis",
      "chapter": 2,
      "question_text": "What tree were Adam and Eve forbidden to eat from?",
      "option_a": "Tree of Life",
      "option_b": "Tree of Knowledge of Good and Evil",
      "option_c": "Fig Tree",
      "option_d": "Olive Tree",
      "correct_option": "b",
      "bible_reference": "Genesis 2:17",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-3",
      "week_number": 1,
      "book": "Exodus",
      "chapter": 2,
      "question_text": "Who found baby Moses in the river?",
      "option_a": "Pharaoh's daughter",
      "option_b": "Miriam",
      "option_c": "Jochebed",
      "option_d": "Zipporah",
      "correct_option": "a",
      "bible_reference": "Exodus 2:5",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-4",
      "week_number": 2,
      "book": "Matthew",
      "chapter": 5,
      "question_text": "According to the Beatitudes, who shall inherit the earth?",
      "option_a": "The merciful",
      "option_b": "The pure in heart",
      "option_c": "The meek",
      "option_d": "The peacemakers",
      "correct_option": "c",
      "bible_reference": "Matthew 5:5",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-5",
      "week_number": 2,
      "book": "John",
      "chapter": 1,
      "question_text": "In the beginning was the Word, and the Word was with God, and the Word was ___",
      "option_a": "Light",
      "option_b": "Life",
      "option_c": "Flesh",
      "option_d": "God",
      "correct_option": "d",
      "bible_reference": "John 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-6",
      "week_number": 4,
      "book": "Judges",
      "chapter": 1,
      "question_text": "What is the main theme of Judges chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Judges 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-7",
      "week_number": 4,
      "book": "Ruth",
      "chapter": 1,
      "question_text": "What is the main theme of Ruth chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Ruth 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-8",
      "week_number": 5,
      "book": "1 Samuel",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Samuel chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Samuel 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-9",
      "week_number": 5,
      "book": "2 Samuel",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Samuel chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Samuel 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-10",
      "week_number": 6,
      "book": "1 Kings",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Kings chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Kings 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-11",
      "week_number": 6,
      "book": "2 Kings",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Kings chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Kings 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-12",
      "week_number": 7,
      "book": "1 Chronicles",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Chronicles chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Chronicles 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-13",
      "week_number": 7,
      "book": "2 Chronicles",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Chronicles chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Chronicles 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-14",
      "week_number": 8,
      "book": "Ezra",
      "chapter": 1,
      "question_text": "What is the main theme of Ezra chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Ezra 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-15",
      "week_number": 8,
      "book": "Nehemiah",
      "chapter": 1,
      "question_text": "What is the main theme of Nehemiah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Nehemiah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-16",
      "week_number": 9,
      "book": "Esther",
      "chapter": 1,
      "question_text": "What is the main theme of Esther chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Esther 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-17",
      "week_number": 9,
      "book": "Job",
      "chapter": 1,
      "question_text": "What is the main theme of Job chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Job 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-18",
      "week_number": 10,
      "book": "Psalms",
      "chapter": 1,
      "question_text": "What is the main theme of Psalms chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Psalms 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-19",
      "week_number": 10,
      "book": "Proverbs",
      "chapter": 1,
      "question_text": "What is the main theme of Proverbs chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Proverbs 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-20",
      "week_number": 11,
      "book": "Ecclesiastes",
      "chapter": 1,
      "question_text": "What is the main theme of Ecclesiastes chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Ecclesiastes 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-21",
      "week_number": 11,
      "book": "Song of Solomon",
      "chapter": 1,
      "question_text": "What is the main theme of Song of Solomon chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Song of Solomon 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-22",
      "week_number": 12,
      "book": "Isaiah",
      "chapter": 1,
      "question_text": "What is the main theme of Isaiah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Isaiah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-23",
      "week_number": 12,
      "book": "Jeremiah",
      "chapter": 1,
      "question_text": "What is the main theme of Jeremiah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Jeremiah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-24",
      "week_number": 13,
      "book": "Lamentations",
      "chapter": 1,
      "question_text": "What is the main theme of Lamentations chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Lamentations 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-25",
      "week_number": 13,
      "book": "Ezekiel",
      "chapter": 1,
      "question_text": "What is the main theme of Ezekiel chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Ezekiel 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-26",
      "week_number": 14,
      "book": "Daniel",
      "chapter": 1,
      "question_text": "What is the main theme of Daniel chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Daniel 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-27",
      "week_number": 14,
      "book": "Hosea",
      "chapter": 1,
      "question_text": "What is the main theme of Hosea chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Hosea 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-28",
      "week_number": 15,
      "book": "Joel",
      "chapter": 1,
      "question_text": "What is the main theme of Joel chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Joel 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-29",
      "week_number": 15,
      "book": "Amos",
      "chapter": 1,
      "question_text": "What is the main theme of Amos chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Amos 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-30",
      "week_number": 16,
      "book": "Obadiah",
      "chapter": 1,
      "question_text": "What is the main theme of Obadiah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Obadiah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-31",
      "week_number": 16,
      "book": "Jonah",
      "chapter": 1,
      "question_text": "What is the main theme of Jonah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Jonah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-32",
      "week_number": 17,
      "book": "Micah",
      "chapter": 1,
      "question_text": "What is the main theme of Micah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Micah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-33",
      "week_number": 17,
      "book": "Nahum",
      "chapter": 1,
      "question_text": "What is the main theme of Nahum chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Nahum 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-34",
      "week_number": 18,
      "book": "Habakkuk",
      "chapter": 1,
      "question_text": "What is the main theme of Habakkuk chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Habakkuk 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-35",
      "week_number": 18,
      "book": "Zephaniah",
      "chapter": 1,
      "question_text": "What is the main theme of Zephaniah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Zephaniah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-36",
      "week_number": 19,
      "book": "Haggai",
      "chapter": 1,
      "question_text": "What is the main theme of Haggai chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Haggai 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-37",
      "week_number": 19,
      "book": "Zechariah",
      "chapter": 1,
      "question_text": "What is the main theme of Zechariah chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Zechariah 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-38",
      "week_number": 20,
      "book": "Malachi",
      "chapter": 1,
      "question_text": "What is the main theme of Malachi chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Malachi 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-39",
      "week_number": 20,
      "book": "Matthew",
      "chapter": 1,
      "question_text": "What is the main theme of Matthew chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Matthew 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-40",
      "week_number": 21,
      "book": "Mark",
      "chapter": 1,
      "question_text": "What is the main theme of Mark chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Mark 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-41",
      "week_number": 21,
      "book": "Luke",
      "chapter": 1,
      "question_text": "What is the main theme of Luke chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Luke 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-42",
      "week_number": 22,
      "book": "John",
      "chapter": 1,
      "question_text": "What is the main theme of John chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "John 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-43",
      "week_number": 22,
      "book": "Acts",
      "chapter": 1,
      "question_text": "What is the main theme of Acts chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Acts 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-44",
      "week_number": 23,
      "book": "Romans",
      "chapter": 1,
      "question_text": "What is the main theme of Romans chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Romans 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-45",
      "week_number": 23,
      "book": "1 Corinthians",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Corinthians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Corinthians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-46",
      "week_number": 24,
      "book": "2 Corinthians",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Corinthians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Corinthians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-47",
      "week_number": 24,
      "book": "Galatians",
      "chapter": 1,
      "question_text": "What is the main theme of Galatians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Galatians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-48",
      "week_number": 25,
      "book": "Ephesians",
      "chapter": 1,
      "question_text": "What is the main theme of Ephesians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Ephesians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-49",
      "week_number": 25,
      "book": "Philippians",
      "chapter": 1,
      "question_text": "What is the main theme of Philippians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Philippians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-50",
      "week_number": 26,
      "book": "Colossians",
      "chapter": 1,
      "question_text": "What is the main theme of Colossians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Colossians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-51",
      "week_number": 26,
      "book": "1 Thessalonians",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Thessalonians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Thessalonians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-52",
      "week_number": 27,
      "book": "2 Thessalonians",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Thessalonians chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Thessalonians 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-53",
      "week_number": 27,
      "book": "1 Timothy",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Timothy chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Timothy 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-54",
      "week_number": 28,
      "book": "2 Timothy",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Timothy chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Timothy 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-55",
      "week_number": 28,
      "book": "Titus",
      "chapter": 1,
      "question_text": "What is the main theme of Titus chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Titus 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-56",
      "week_number": 29,
      "book": "Philemon",
      "chapter": 1,
      "question_text": "What is the main theme of Philemon chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Philemon 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-57",
      "week_number": 29,
      "book": "Hebrews",
      "chapter": 1,
      "question_text": "What is the main theme of Hebrews chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Hebrews 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-58",
      "week_number": 30,
      "book": "James",
      "chapter": 1,
      "question_text": "What is the main theme of James chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "James 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-59",
      "week_number": 30,
      "book": "1 Peter",
      "chapter": 1,
      "question_text": "What is the main theme of 1 Peter chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 Peter 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-60",
      "week_number": 31,
      "book": "2 Peter",
      "chapter": 1,
      "question_text": "What is the main theme of 2 Peter chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 Peter 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-61",
      "week_number": 31,
      "book": "1 John",
      "chapter": 1,
      "question_text": "What is the main theme of 1 John chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "1 John 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-62",
      "week_number": 32,
      "book": "2 John",
      "chapter": 1,
      "question_text": "What is the main theme of 2 John chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "2 John 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-63",
      "week_number": 32,
      "book": "3 John",
      "chapter": 1,
      "question_text": "What is the main theme of 3 John chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "3 John 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-64",
      "week_number": 33,
      "book": "Jude",
      "chapter": 1,
      "question_text": "What is the main theme of Jude chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Jude 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    },
    {
      "id": "dummy-auto-65",
      "week_number": 33,
      "book": "Revelation",
      "chapter": 1,
      "question_text": "What is the main theme of Revelation chapter 1?",
      "option_a": "Faith",
      "option_b": "Hope",
      "option_c": "Love",
      "option_d": "Obedience",
      "correct_option": "a",
      "bible_reference": "Revelation 1:1",
      "created_at": "2026-09-19T19:14:08.604Z"
    }
  ], ...localQs];
  const questions = allQs.filter((q) => {
    return `${q.book} ${q.chapter}` === chapterLabel;
  });
  if (questions.length === 0) {
    return [
      {
        id: "dummy-1",
        chapter_label: chapterLabel,
        question_text: "What was poured out in this chapter?",
        option_a: "Seven bowls of wrath",
        option_b: "Seven trumpets",
        option_c: "Seven seals",
        option_d: "Seven thunders",
        correct_option: "a",
        book: "Genesis",
        chapter: 1,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
  return questions;
}
async function fetchAllQuizQuestions() {
  await new Promise((r) => setTimeout(r, 100));
  return getLocalQuestions();
}
function getLocalAnswers() {
  try {
    return JSON.parse(localStorage.getItem("dummy_quiz_answers") || "[]");
  } catch {
    return [];
  }
}
function setLocalAnswers(answers) {
  localStorage.setItem("dummy_quiz_answers", JSON.stringify(answers));
}
async function fetchQuizAnswers(profileId, questionIds) {
  await new Promise((r) => setTimeout(r, 100));
  return getLocalAnswers().filter((a) => a.profile_id === profileId && questionIds.includes(a.question_id));
}
async function fetchAllQuizAnswers(profileId) {
  await new Promise((r) => setTimeout(r, 100));
  return getLocalAnswers().filter((a) => a.profile_id === profileId);
}
async function submitQuizAnswer(profileId, questionId, selectedOption, isCorrect, currentCorrect, currentAnswered) {
  const answers = getLocalAnswers();
  if (!answers.find((a) => a.profile_id === profileId && a.question_id === questionId)) {
    answers.push({
      id: "ans-" + Date.now(),
      profile_id: profileId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      answered_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    setLocalAnswers(answers);
  }
  const cached = localStorage.getItem("bible_challenge_profile");
  if (cached) {
    const data = JSON.parse(cached);
    data.profile.total_quiz_correct = currentCorrect + (isCorrect ? 1 : 0);
    data.profile.total_quiz_answered = currentAnswered + 1;
    localStorage.setItem("bible_challenge_profile", JSON.stringify(data));
  }
}
async function fetchLeaderboard(currentProfileId) {
  await new Promise((r) => setTimeout(r, 100));
  const dummyEntries = [
    {
      "id": "u29",
      "telegram_id": 100030,
      "username": "thomasjones",
      "first_name": "Thomas",
      "last_name": "Jones",
      "photo_url": null,
      "current_streak": 13,
      "longest_streak": 21,
      "total_quiz_correct": 20,
      "total_quiz_answered": 66,
      "score": 72
    },
    {
      "id": "u24",
      "telegram_id": 100025,
      "username": "sandrawilson",
      "first_name": "Sandra",
      "last_name": "Wilson",
      "photo_url": null,
      "current_streak": 19,
      "longest_streak": 24,
      "total_quiz_correct": 39,
      "total_quiz_answered": 69,
      "score": 71
    },
    {
      "id": "u22",
      "telegram_id": 100023,
      "username": "lindajones",
      "first_name": "Linda",
      "last_name": "Jones",
      "photo_url": null,
      "current_streak": 11,
      "longest_streak": 13,
      "total_quiz_correct": 26,
      "total_quiz_answered": 52,
      "score": 63
    },
    {
      "id": "u18",
      "telegram_id": 100019,
      "username": "nancyanderson",
      "first_name": "Nancy",
      "last_name": "Anderson",
      "photo_url": null,
      "current_streak": 10,
      "longest_streak": 12,
      "total_quiz_correct": 39,
      "total_quiz_answered": 63,
      "score": 58
    },
    {
      "id": "u3",
      "telegram_id": 100004,
      "username": "jessicajackson",
      "first_name": "Jessica",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 4,
      "longest_streak": 9,
      "total_quiz_correct": 6,
      "total_quiz_answered": 52,
      "score": 55
    },
    {
      "id": "u13",
      "telegram_id": 100014,
      "username": "bettyjackson",
      "first_name": "Betty",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 17,
      "longest_streak": 20,
      "total_quiz_correct": 0,
      "total_quiz_answered": 53,
      "score": 55
    },
    {
      "id": "u8",
      "telegram_id": 100009,
      "username": "johnlopez",
      "first_name": "John",
      "last_name": "Lopez",
      "photo_url": null,
      "current_streak": 6,
      "longest_streak": 12,
      "total_quiz_correct": 45,
      "total_quiz_answered": 56,
      "score": 52
    },
    {
      "id": "u15",
      "telegram_id": 100016,
      "username": "elizabethbrown",
      "first_name": "Elizabeth",
      "last_name": "Brown",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 6,
      "total_quiz_correct": 39,
      "total_quiz_answered": 63,
      "score": 48
    },
    {
      "id": "u6",
      "telegram_id": 100007,
      "username": "sarahgarcia",
      "first_name": "Sarah",
      "last_name": "Garcia",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 7,
      "total_quiz_correct": 6,
      "total_quiz_answered": 55,
      "score": 44
    },
    {
      "id": "u17",
      "telegram_id": 100018,
      "username": "margaretjackson",
      "first_name": "Margaret",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 7,
      "total_quiz_correct": 30,
      "total_quiz_answered": 50,
      "score": 43
    },
    {
      "id": "u11",
      "telegram_id": 100012,
      "username": "johnjackson",
      "first_name": "John",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 5,
      "total_quiz_correct": 9,
      "total_quiz_answered": 61,
      "score": 40
    },
    {
      "id": "u4",
      "telegram_id": 100005,
      "username": "barbarajohnson",
      "first_name": "Barbara",
      "last_name": "Johnson",
      "photo_url": null,
      "current_streak": 12,
      "longest_streak": 20,
      "total_quiz_correct": 15,
      "total_quiz_answered": 63,
      "score": 35
    },
    {
      "id": "u9",
      "telegram_id": 100010,
      "username": "sandragarcia",
      "first_name": "Sandra",
      "last_name": "Garcia",
      "photo_url": null,
      "current_streak": 4,
      "longest_streak": 13,
      "total_quiz_correct": 41,
      "total_quiz_answered": 69,
      "score": 34
    },
    {
      "id": "u0",
      "telegram_id": 100001,
      "username": "thomasjackson",
      "first_name": "Thomas",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 13,
      "longest_streak": 20,
      "total_quiz_correct": 3,
      "total_quiz_answered": 55,
      "score": 30
    },
    {
      "id": "u19",
      "telegram_id": 100020,
      "username": "robertjackson",
      "first_name": "Robert",
      "last_name": "Jackson",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 2,
      "total_quiz_correct": 18,
      "total_quiz_answered": 51,
      "score": 29
    },
    {
      "id": "u21",
      "telegram_id": 100022,
      "username": "michaeljones",
      "first_name": "Michael",
      "last_name": "Jones",
      "photo_url": null,
      "current_streak": 8,
      "longest_streak": 15,
      "total_quiz_correct": 26,
      "total_quiz_answered": 57,
      "score": 29
    },
    {
      "id": "u1",
      "telegram_id": 100002,
      "username": "robertmartinez",
      "first_name": "Robert",
      "last_name": "Martinez",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 1,
      "total_quiz_correct": 24,
      "total_quiz_answered": 68,
      "score": 28
    },
    {
      "id": "u2",
      "telegram_id": 100003,
      "username": "marymartinez",
      "first_name": "Mary",
      "last_name": "Martinez",
      "photo_url": null,
      "current_streak": 1,
      "longest_streak": 5,
      "total_quiz_correct": 48,
      "total_quiz_answered": 55,
      "score": 27
    },
    {
      "id": "u14",
      "telegram_id": 100015,
      "username": "susanbrown",
      "first_name": "Susan",
      "last_name": "Brown",
      "photo_url": null,
      "current_streak": 3,
      "longest_streak": 8,
      "total_quiz_correct": 37,
      "total_quiz_answered": 59,
      "score": 27
    },
    {
      "id": "u25",
      "telegram_id": 100026,
      "username": "michaeljohnson",
      "first_name": "Michael",
      "last_name": "Johnson",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 9,
      "total_quiz_correct": 14,
      "total_quiz_answered": 54,
      "score": 27
    },
    {
      "id": "u26",
      "telegram_id": 100027,
      "username": "jameswilson",
      "first_name": "James",
      "last_name": "Wilson",
      "photo_url": null,
      "current_streak": 11,
      "longest_streak": 15,
      "total_quiz_correct": 35,
      "total_quiz_answered": 64,
      "score": 25
    },
    {
      "id": "u12",
      "telegram_id": 100013,
      "username": "thomashernandez",
      "first_name": "Thomas",
      "last_name": "Hernandez",
      "photo_url": null,
      "current_streak": 7,
      "longest_streak": 15,
      "total_quiz_correct": 32,
      "total_quiz_answered": 57,
      "score": 24
    },
    {
      "id": "u16",
      "telegram_id": 100017,
      "username": "williammoore",
      "first_name": "William",
      "last_name": "Moore",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 6,
      "total_quiz_correct": 19,
      "total_quiz_answered": 57,
      "score": 22
    },
    {
      "id": "u7",
      "telegram_id": 100008,
      "username": "jenniferlopez",
      "first_name": "Jennifer",
      "last_name": "Lopez",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 2,
      "total_quiz_correct": 16,
      "total_quiz_answered": 67,
      "score": 17
    },
    {
      "id": "u10",
      "telegram_id": 100011,
      "username": "jamessmith",
      "first_name": "James",
      "last_name": "Smith",
      "photo_url": null,
      "current_streak": 8,
      "longest_streak": 11,
      "total_quiz_correct": 43,
      "total_quiz_answered": 64,
      "score": 17
    },
    {
      "id": "u28",
      "telegram_id": 100029,
      "username": "jamessmith",
      "first_name": "James",
      "last_name": "Smith",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 8,
      "total_quiz_correct": 44,
      "total_quiz_answered": 52,
      "score": 16
    },
    {
      "id": "u20",
      "telegram_id": 100021,
      "username": "patriciarodriguez",
      "first_name": "Patricia",
      "last_name": "Rodriguez",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 8,
      "total_quiz_correct": 0,
      "total_quiz_answered": 60,
      "score": 9
    },
    {
      "id": "u23",
      "telegram_id": 100024,
      "username": "margaretjones",
      "first_name": "Margaret",
      "last_name": "Jones",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 7,
      "total_quiz_correct": 47,
      "total_quiz_answered": 66,
      "score": 6
    },
    {
      "id": "u27",
      "telegram_id": 100028,
      "username": "josephmoore",
      "first_name": "Joseph",
      "last_name": "Moore",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 4,
      "total_quiz_correct": 21,
      "total_quiz_answered": 51,
      "score": 5
    },
    {
      "id": "u5",
      "telegram_id": 100006,
      "username": "nancywilson",
      "first_name": "Nancy",
      "last_name": "Wilson",
      "photo_url": null,
      "current_streak": 0,
      "longest_streak": 4,
      "total_quiz_correct": 36,
      "total_quiz_answered": 53,
      "score": 1
    }
  ];
  dummyEntries.sort((a, b) => b.score - a.score);
  const myRank = dummyEntries.findIndex((e) => e.id === currentProfileId);
  return { entries: dummyEntries, myRank: myRank >= 0 ? myRank + 1 : null };
}
function calculateStreak(currentStreak, lastReadDate, today) {
  const todayStr = today.toISOString().split("T")[0];
  if (lastReadDate === todayStr) {
    return { newStreak: currentStreak, newLongestStreak: Math.max(currentStreak, 0), shouldUpdate: false };
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  let newStreak;
  if (lastReadDate === yesterdayStr) {
    newStreak = currentStreak + 1;
  } else {
    newStreak = 1;
  }
  const newLongestStreak = Math.max(newStreak, 0);
  return { newStreak, newLongestStreak, shouldUpdate: true };
}
export {
  calculateStreak,
  fetchAllQuizAnswers,
  fetchAllQuizQuestions,
  fetchAllReadingProgress,
  fetchLeaderboard,
  fetchQuizAnswers,
  fetchQuizQuestionsForChapter,
  fetchReadingPlanForDay,
  fetchReadingPlanForWeek,
  fetchReadingProgress,
  getChapterLabels,
  markChapterComplete,
  submitQuizAnswer,
  unmarkChapter,
  updateStreak
};
