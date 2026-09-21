import type { Reader, QuizQuestion, ReadingSchedule, ReadingProgress, QuizResponse, LeaderboardEntry } from './types';

export const dummyReaders: Reader[] = [
  {
    "id": "r1",
    "name": "Thomas Jackson",
    "phone": "+1 345 293 5791",
    "telegram_id": "100001",
    "status": "active",
    "current_streak": 13,
    "longest_streak": 20,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-16T19:14:08.604Z"
  },
  {
    "id": "r2",
    "name": "Robert Martinez",
    "phone": "+1 875 966 5433",
    "telegram_id": "100002",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 1,
    "last_read_date": "2026-09-14T19:14:08.604Z",
    "created_at": "2026-09-05T19:14:08.604Z"
  },
  {
    "id": "r3",
    "name": "Mary Martinez",
    "phone": "+1 723 386 8291",
    "telegram_id": "100003",
    "status": "active",
    "current_streak": 1,
    "longest_streak": 5,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-08T19:14:08.604Z"
  },
  {
    "id": "r4",
    "name": "Jessica Jackson",
    "phone": "+1 673 255 7385",
    "telegram_id": "100004",
    "status": "active",
    "current_streak": 4,
    "longest_streak": 9,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-27T19:14:08.604Z"
  },
  {
    "id": "r5",
    "name": "Barbara Johnson",
    "phone": "+1 645 901 9946",
    "telegram_id": "100005",
    "status": "active",
    "current_streak": 12,
    "longest_streak": 20,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-29T19:14:08.604Z"
  },
  {
    "id": "r6",
    "name": "Nancy Wilson",
    "phone": "+1 334 961 6862",
    "telegram_id": "100006",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 4,
    "last_read_date": "2026-09-11T19:14:08.604Z",
    "created_at": "2026-08-17T19:14:08.604Z"
  },
  {
    "id": "r7",
    "name": "Sarah Garcia",
    "phone": "+1 776 549 1273",
    "telegram_id": "100007",
    "status": "dropped",
    "current_streak": 0,
    "longest_streak": 7,
    "last_read_date": "2026-09-14T19:14:08.604Z",
    "created_at": "2026-08-30T19:14:08.604Z"
  },
  {
    "id": "r8",
    "name": "Jennifer Lopez",
    "phone": "+1 506 764 5137",
    "telegram_id": "100008",
    "status": "dropped",
    "current_streak": 0,
    "longest_streak": 2,
    "last_read_date": "2026-09-14T19:14:08.604Z",
    "created_at": "2026-08-12T19:14:08.604Z"
  },
  {
    "id": "r9",
    "name": "John Lopez",
    "phone": "+1 691 107 3432",
    "telegram_id": "100009",
    "status": "active",
    "current_streak": 6,
    "longest_streak": 12,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-05T19:14:08.604Z"
  },
  {
    "id": "r10",
    "name": "Sandra Garcia",
    "phone": "+1 969 681 2845",
    "telegram_id": "100010",
    "status": "active",
    "current_streak": 4,
    "longest_streak": 13,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-15T19:14:08.604Z"
  },
  {
    "id": "r11",
    "name": "James Smith",
    "phone": "+1 226 297 8601",
    "telegram_id": "100011",
    "status": "active",
    "current_streak": 8,
    "longest_streak": 11,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-01T19:14:08.604Z"
  },
  {
    "id": "r12",
    "name": "John Jackson",
    "phone": "+1 538 334 4545",
    "telegram_id": "100012",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 5,
    "last_read_date": "2026-09-17T19:14:08.604Z",
    "created_at": "2026-08-19T19:14:08.604Z"
  },
  {
    "id": "r13",
    "name": "Thomas Hernandez",
    "phone": "+1 309 148 5654",
    "telegram_id": "100013",
    "status": "active",
    "current_streak": 7,
    "longest_streak": 15,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-30T19:14:08.604Z"
  },
  {
    "id": "r14",
    "name": "Betty Jackson",
    "phone": "+1 876 837 7255",
    "telegram_id": "100014",
    "status": "active",
    "current_streak": 17,
    "longest_streak": 20,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-30T19:14:08.604Z"
  },
  {
    "id": "r15",
    "name": "Susan Brown",
    "phone": "+1 574 969 8808",
    "telegram_id": "100015",
    "status": "active",
    "current_streak": 3,
    "longest_streak": 8,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-29T19:14:08.604Z"
  },
  {
    "id": "r16",
    "name": "Elizabeth Brown",
    "phone": "+1 554 172 7594",
    "telegram_id": "100016",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 6,
    "last_read_date": "2026-09-10T19:14:08.604Z",
    "created_at": "2026-08-21T19:14:08.604Z"
  },
  {
    "id": "r17",
    "name": "William Moore",
    "phone": "+1 309 592 1669",
    "telegram_id": "100017",
    "status": "dropped",
    "current_streak": 0,
    "longest_streak": 6,
    "last_read_date": "2026-09-12T19:14:08.604Z",
    "created_at": "2026-08-11T19:14:08.604Z"
  },
  {
    "id": "r18",
    "name": "Margaret Jackson",
    "phone": "+1 552 487 8064",
    "telegram_id": "100018",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 7,
    "last_read_date": "2026-09-17T19:14:08.604Z",
    "created_at": "2026-08-20T19:14:08.604Z"
  },
  {
    "id": "r19",
    "name": "Nancy Anderson",
    "phone": "+1 854 374 8779",
    "telegram_id": "100019",
    "status": "active",
    "current_streak": 10,
    "longest_streak": 12,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-08T19:14:08.604Z"
  },
  {
    "id": "r20",
    "name": "Robert Jackson",
    "phone": "+1 715 583 8059",
    "telegram_id": "100020",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 2,
    "last_read_date": "2026-09-18T19:14:08.604Z",
    "created_at": "2026-08-15T19:14:08.604Z"
  },
  {
    "id": "r21",
    "name": "Patricia Rodriguez",
    "phone": "+1 320 417 4613",
    "telegram_id": "100021",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 8,
    "last_read_date": "2026-09-16T19:14:08.604Z",
    "created_at": "2026-08-23T19:14:08.604Z"
  },
  {
    "id": "r22",
    "name": "Michael Jones",
    "phone": "+1 850 949 3670",
    "telegram_id": "100022",
    "status": "active",
    "current_streak": 8,
    "longest_streak": 15,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-28T19:14:08.604Z"
  },
  {
    "id": "r23",
    "name": "Linda Jones",
    "phone": "+1 359 488 2785",
    "telegram_id": "100023",
    "status": "active",
    "current_streak": 11,
    "longest_streak": 13,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-25T19:14:08.604Z"
  },
  {
    "id": "r24",
    "name": "Margaret Jones",
    "phone": "+1 564 915 4412",
    "telegram_id": "100024",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 7,
    "last_read_date": "2026-09-13T19:14:08.604Z",
    "created_at": "2026-08-24T19:14:08.604Z"
  },
  {
    "id": "r25",
    "name": "Sandra Wilson",
    "phone": "+1 488 651 6165",
    "telegram_id": "100025",
    "status": "active",
    "current_streak": 19,
    "longest_streak": 24,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-28T19:14:08.604Z"
  },
  {
    "id": "r26",
    "name": "Michael Johnson",
    "phone": "+1 471 444 6841",
    "telegram_id": "100026",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 9,
    "last_read_date": "2026-09-10T19:14:08.604Z",
    "created_at": "2026-09-08T19:14:08.604Z"
  },
  {
    "id": "r27",
    "name": "James Wilson",
    "phone": "+1 526 330 7143",
    "telegram_id": "100027",
    "status": "active",
    "current_streak": 11,
    "longest_streak": 15,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-07T19:14:08.604Z"
  },
  {
    "id": "r28",
    "name": "Joseph Moore",
    "phone": "+1 965 911 3239",
    "telegram_id": "100028",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 4,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-08-31T19:14:08.604Z"
  },
  {
    "id": "r29",
    "name": "James Smith",
    "phone": "+1 798 787 4495",
    "telegram_id": "100029",
    "status": "paused",
    "current_streak": 0,
    "longest_streak": 8,
    "last_read_date": "2026-09-16T19:14:08.604Z",
    "created_at": "2026-09-01T19:14:08.604Z"
  },
  {
    "id": "r30",
    "name": "Thomas Jones",
    "phone": "+1 718 484 7477",
    "telegram_id": "100030",
    "status": "active",
    "current_streak": 13,
    "longest_streak": 21,
    "last_read_date": "2026-09-19T19:14:08.604Z",
    "created_at": "2026-09-05T19:14:08.604Z"
  }
];
export const dummySchedule: ReadingSchedule[] = [
  {
    "id": "s1",
    "day_number": 1,
    "week_number": 1,
    "reading_from": "Genesis 1",
    "reading_to": "Genesis 3",
    "section": "Genesis",
    "release_date": "2026-09-21T00:00:00.000Z"
  },
  {
    "id": "s2",
    "day_number": 2,
    "week_number": 1,
    "reading_from": "Genesis 4",
    "reading_to": "Genesis 6",
    "section": "Genesis",
    "release_date": "2026-09-22T00:00:00.000Z"
  },
  {
    "id": "s3",
    "day_number": 3,
    "week_number": 1,
    "reading_from": "Genesis 7",
    "reading_to": "Genesis 9",
    "section": "Genesis",
    "release_date": "2026-09-23T00:00:00.000Z"
  },
  {
    "id": "s4",
    "day_number": 4,
    "week_number": 1,
    "reading_from": "Genesis 10",
    "reading_to": "Genesis 12",
    "section": "Genesis",
    "release_date": "2026-09-24T00:00:00.000Z"
  },
  {
    "id": "s5",
    "day_number": 5,
    "week_number": 1,
    "reading_from": "Genesis 13",
    "reading_to": "Genesis 15",
    "section": "Genesis",
    "release_date": "2026-09-25T00:00:00.000Z"
  },
  {
    "id": "s6",
    "day_number": 6,
    "week_number": 1,
    "reading_from": "Genesis 16",
    "reading_to": "Genesis 18",
    "section": "Genesis",
    "release_date": "2026-09-26T00:00:00.000Z"
  },
  {
    "id": "s7",
    "day_number": 7,
    "week_number": 1,
    "reading_from": "Genesis 19",
    "reading_to": "Genesis 21",
    "section": "Genesis",
    "release_date": "2026-09-27T00:00:00.000Z"
  },
  {
    "id": "s8",
    "day_number": 8,
    "week_number": 2,
    "reading_from": "Genesis 22",
    "reading_to": "Genesis 24",
    "section": "Genesis",
    "release_date": "2026-09-28T00:00:00.000Z"
  },
  {
    "id": "s9",
    "day_number": 9,
    "week_number": 2,
    "reading_from": "Genesis 25",
    "reading_to": "Genesis 27",
    "section": "Genesis",
    "release_date": "2026-09-29T00:00:00.000Z"
  },
  {
    "id": "s10",
    "day_number": 10,
    "week_number": 2,
    "reading_from": "Genesis 28",
    "reading_to": "Genesis 30",
    "section": "Genesis",
    "release_date": "2026-09-30T00:00:00.000Z"
  },
  {
    "id": "s11",
    "day_number": 11,
    "week_number": 2,
    "reading_from": "Genesis 31",
    "reading_to": "Genesis 33",
    "section": "Genesis",
    "release_date": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "s12",
    "day_number": 12,
    "week_number": 2,
    "reading_from": "Genesis 34",
    "reading_to": "Genesis 36",
    "section": "Genesis",
    "release_date": "2026-10-02T00:00:00.000Z"
  },
  {
    "id": "s13",
    "day_number": 13,
    "week_number": 2,
    "reading_from": "Genesis 37",
    "reading_to": "Genesis 39",
    "section": "Genesis",
    "release_date": "2026-10-03T00:00:00.000Z"
  },
  {
    "id": "s14",
    "day_number": 14,
    "week_number": 2,
    "reading_from": "Genesis 40",
    "reading_to": "Genesis 42",
    "section": "Genesis",
    "release_date": "2026-10-04T00:00:00.000Z"
  },
  {
    "id": "s15",
    "day_number": 15,
    "week_number": 3,
    "reading_from": "Genesis 43",
    "reading_to": "Genesis 45",
    "section": "Genesis",
    "release_date": "2026-10-05T00:00:00.000Z"
  },
  {
    "id": "s16",
    "day_number": 16,
    "week_number": 3,
    "reading_from": "Genesis 46",
    "reading_to": "Genesis 48",
    "section": "Genesis",
    "release_date": "2026-10-06T00:00:00.000Z"
  },
  {
    "id": "s17",
    "day_number": 17,
    "week_number": 3,
    "reading_from": "Genesis 49",
    "reading_to": "Genesis 50",
    "section": "Genesis",
    "release_date": "2026-10-07T00:00:00.000Z"
  },
  {
    "id": "s18",
    "day_number": 18,
    "week_number": 3,
    "reading_from": "Exodus 1",
    "reading_to": "Exodus 3",
    "section": "Exodus",
    "release_date": "2026-10-08T00:00:00.000Z"
  },
  {
    "id": "s19",
    "day_number": 19,
    "week_number": 3,
    "reading_from": "Exodus 4",
    "reading_to": "Exodus 6",
    "section": "Exodus",
    "release_date": "2026-10-09T00:00:00.000Z"
  },
  {
    "id": "s20",
    "day_number": 20,
    "week_number": 3,
    "reading_from": "Exodus 7",
    "reading_to": "Exodus 9",
    "section": "Exodus",
    "release_date": "2026-10-10T00:00:00.000Z"
  },
  {
    "id": "s21",
    "day_number": 21,
    "week_number": 3,
    "reading_from": "Exodus 10",
    "reading_to": "Exodus 12",
    "section": "Exodus",
    "release_date": "2026-10-11T00:00:00.000Z"
  },
  {
    "id": "s22",
    "day_number": 22,
    "week_number": 4,
    "reading_from": "Exodus 13",
    "reading_to": "Exodus 15",
    "section": "Exodus",
    "release_date": "2026-10-12T00:00:00.000Z"
  },
  {
    "id": "s23",
    "day_number": 23,
    "week_number": 4,
    "reading_from": "Exodus 16",
    "reading_to": "Exodus 18",
    "section": "Exodus",
    "release_date": "2026-10-13T00:00:00.000Z"
  },
  {
    "id": "s24",
    "day_number": 24,
    "week_number": 4,
    "reading_from": "Exodus 19",
    "reading_to": "Exodus 21",
    "section": "Exodus",
    "release_date": "2026-10-14T00:00:00.000Z"
  },
  {
    "id": "s25",
    "day_number": 25,
    "week_number": 4,
    "reading_from": "Exodus 22",
    "reading_to": "Exodus 24",
    "section": "Exodus",
    "release_date": "2026-10-15T00:00:00.000Z"
  },
  {
    "id": "s26",
    "day_number": 26,
    "week_number": 4,
    "reading_from": "Exodus 25",
    "reading_to": "Exodus 27",
    "section": "Exodus",
    "release_date": "2026-10-16T00:00:00.000Z"
  },
  {
    "id": "s27",
    "day_number": 27,
    "week_number": 4,
    "reading_from": "Exodus 28",
    "reading_to": "Exodus 30",
    "section": "Exodus",
    "release_date": "2026-10-17T00:00:00.000Z"
  },
  {
    "id": "s28",
    "day_number": 28,
    "week_number": 4,
    "reading_from": "Exodus 31",
    "reading_to": "Exodus 33",
    "section": "Exodus",
    "release_date": "2026-10-18T00:00:00.000Z"
  },
  {
    "id": "s29",
    "day_number": 29,
    "week_number": 5,
    "reading_from": "Exodus 34",
    "reading_to": "Exodus 36",
    "section": "Exodus",
    "release_date": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "s30",
    "day_number": 30,
    "week_number": 5,
    "reading_from": "Exodus 37",
    "reading_to": "Exodus 39",
    "section": "Exodus",
    "release_date": "2026-10-20T00:00:00.000Z"
  },
  {
    "id": "s31",
    "day_number": 31,
    "week_number": 5,
    "reading_from": "Exodus 40",
    "reading_to": "Exodus 40",
    "section": "Exodus",
    "release_date": "2026-10-21T00:00:00.000Z"
  },
  {
    "id": "s32",
    "day_number": 32,
    "week_number": 5,
    "reading_from": "Leviticus 1",
    "reading_to": "Leviticus 3",
    "section": "Leviticus",
    "release_date": "2026-10-22T00:00:00.000Z"
  },
  {
    "id": "s33",
    "day_number": 33,
    "week_number": 5,
    "reading_from": "Leviticus 4",
    "reading_to": "Leviticus 6",
    "section": "Leviticus",
    "release_date": "2026-10-23T00:00:00.000Z"
  },
  {
    "id": "s34",
    "day_number": 34,
    "week_number": 5,
    "reading_from": "Leviticus 7",
    "reading_to": "Leviticus 9",
    "section": "Leviticus",
    "release_date": "2026-10-24T00:00:00.000Z"
  },
  {
    "id": "s35",
    "day_number": 35,
    "week_number": 5,
    "reading_from": "Leviticus 10",
    "reading_to": "Leviticus 12",
    "section": "Leviticus",
    "release_date": "2026-10-25T00:00:00.000Z"
  },
  {
    "id": "s36",
    "day_number": 36,
    "week_number": 6,
    "reading_from": "Leviticus 13",
    "reading_to": "Leviticus 15",
    "section": "Leviticus",
    "release_date": "2026-10-26T00:00:00.000Z"
  },
  {
    "id": "s37",
    "day_number": 37,
    "week_number": 6,
    "reading_from": "Leviticus 16",
    "reading_to": "Leviticus 18",
    "section": "Leviticus",
    "release_date": "2026-10-27T00:00:00.000Z"
  },
  {
    "id": "s38",
    "day_number": 38,
    "week_number": 6,
    "reading_from": "Leviticus 19",
    "reading_to": "Leviticus 21",
    "section": "Leviticus",
    "release_date": "2026-10-28T00:00:00.000Z"
  },
  {
    "id": "s39",
    "day_number": 39,
    "week_number": 6,
    "reading_from": "Leviticus 22",
    "reading_to": "Leviticus 24",
    "section": "Leviticus",
    "release_date": "2026-10-29T00:00:00.000Z"
  },
  {
    "id": "s40",
    "day_number": 40,
    "week_number": 6,
    "reading_from": "Leviticus 25",
    "reading_to": "Leviticus 27",
    "section": "Leviticus",
    "release_date": "2026-10-30T00:00:00.000Z"
  },
  {
    "id": "s41",
    "day_number": 41,
    "week_number": 6,
    "reading_from": "Numbers 1",
    "reading_to": "Numbers 3",
    "section": "Numbers",
    "release_date": "2026-10-31T00:00:00.000Z"
  },
  {
    "id": "s42",
    "day_number": 42,
    "week_number": 6,
    "reading_from": "Numbers 4",
    "reading_to": "Numbers 6",
    "section": "Numbers",
    "release_date": "2026-11-01T00:00:00.000Z"
  },
  {
    "id": "s43",
    "day_number": 43,
    "week_number": 7,
    "reading_from": "Numbers 7",
    "reading_to": "Numbers 9",
    "section": "Numbers",
    "release_date": "2026-11-02T00:00:00.000Z"
  },
  {
    "id": "s44",
    "day_number": 44,
    "week_number": 7,
    "reading_from": "Numbers 10",
    "reading_to": "Numbers 12",
    "section": "Numbers",
    "release_date": "2026-11-03T00:00:00.000Z"
  },
  {
    "id": "s45",
    "day_number": 45,
    "week_number": 7,
    "reading_from": "Numbers 13",
    "reading_to": "Numbers 15",
    "section": "Numbers",
    "release_date": "2026-11-04T00:00:00.000Z"
  },
  {
    "id": "s46",
    "day_number": 46,
    "week_number": 7,
    "reading_from": "Numbers 16",
    "reading_to": "Numbers 18",
    "section": "Numbers",
    "release_date": "2026-11-05T00:00:00.000Z"
  },
  {
    "id": "s47",
    "day_number": 47,
    "week_number": 7,
    "reading_from": "Numbers 19",
    "reading_to": "Numbers 21",
    "section": "Numbers",
    "release_date": "2026-11-06T00:00:00.000Z"
  },
  {
    "id": "s48",
    "day_number": 48,
    "week_number": 7,
    "reading_from": "Numbers 22",
    "reading_to": "Numbers 24",
    "section": "Numbers",
    "release_date": "2026-11-07T00:00:00.000Z"
  },
  {
    "id": "s49",
    "day_number": 49,
    "week_number": 7,
    "reading_from": "Numbers 25",
    "reading_to": "Numbers 27",
    "section": "Numbers",
    "release_date": "2026-11-08T00:00:00.000Z"
  },
  {
    "id": "s50",
    "day_number": 50,
    "week_number": 8,
    "reading_from": "Numbers 28",
    "reading_to": "Numbers 30",
    "section": "Numbers",
    "release_date": "2026-11-09T00:00:00.000Z"
  },
  {
    "id": "s51",
    "day_number": 51,
    "week_number": 8,
    "reading_from": "Numbers 31",
    "reading_to": "Numbers 33",
    "section": "Numbers",
    "release_date": "2026-11-10T00:00:00.000Z"
  },
  {
    "id": "s52",
    "day_number": 52,
    "week_number": 8,
    "reading_from": "Numbers 34",
    "reading_to": "Numbers 36",
    "section": "Numbers",
    "release_date": "2026-11-11T00:00:00.000Z"
  },
  {
    "id": "s53",
    "day_number": 53,
    "week_number": 8,
    "reading_from": "Deuteronomy 1",
    "reading_to": "Deuteronomy 3",
    "section": "Deuteronomy",
    "release_date": "2026-11-12T00:00:00.000Z"
  },
  {
    "id": "s54",
    "day_number": 54,
    "week_number": 8,
    "reading_from": "Deuteronomy 4",
    "reading_to": "Deuteronomy 6",
    "section": "Deuteronomy",
    "release_date": "2026-11-13T00:00:00.000Z"
  },
  {
    "id": "s55",
    "day_number": 55,
    "week_number": 8,
    "reading_from": "Deuteronomy 7",
    "reading_to": "Deuteronomy 9",
    "section": "Deuteronomy",
    "release_date": "2026-11-14T00:00:00.000Z"
  },
  {
    "id": "s56",
    "day_number": 56,
    "week_number": 8,
    "reading_from": "Deuteronomy 10",
    "reading_to": "Deuteronomy 12",
    "section": "Deuteronomy",
    "release_date": "2026-11-15T00:00:00.000Z"
  },
  {
    "id": "s57",
    "day_number": 57,
    "week_number": 9,
    "reading_from": "Deuteronomy 13",
    "reading_to": "Deuteronomy 15",
    "section": "Deuteronomy",
    "release_date": "2026-11-16T00:00:00.000Z"
  },
  {
    "id": "s58",
    "day_number": 58,
    "week_number": 9,
    "reading_from": "Deuteronomy 16",
    "reading_to": "Deuteronomy 18",
    "section": "Deuteronomy",
    "release_date": "2026-11-17T00:00:00.000Z"
  },
  {
    "id": "s59",
    "day_number": 59,
    "week_number": 9,
    "reading_from": "Deuteronomy 19",
    "reading_to": "Deuteronomy 21",
    "section": "Deuteronomy",
    "release_date": "2026-11-18T00:00:00.000Z"
  },
  {
    "id": "s60",
    "day_number": 60,
    "week_number": 9,
    "reading_from": "Deuteronomy 22",
    "reading_to": "Deuteronomy 24",
    "section": "Deuteronomy",
    "release_date": "2026-11-19T00:00:00.000Z"
  },
  {
    "id": "s61",
    "day_number": 61,
    "week_number": 9,
    "reading_from": "Deuteronomy 25",
    "reading_to": "Deuteronomy 27",
    "section": "Deuteronomy",
    "release_date": "2026-11-20T00:00:00.000Z"
  },
  {
    "id": "s62",
    "day_number": 62,
    "week_number": 9,
    "reading_from": "Deuteronomy 28",
    "reading_to": "Deuteronomy 30",
    "section": "Deuteronomy",
    "release_date": "2026-11-21T00:00:00.000Z"
  },
  {
    "id": "s63",
    "day_number": 63,
    "week_number": 9,
    "reading_from": "Deuteronomy 31",
    "reading_to": "Deuteronomy 33",
    "section": "Deuteronomy",
    "release_date": "2026-11-22T00:00:00.000Z"
  },
  {
    "id": "s64",
    "day_number": 64,
    "week_number": 10,
    "reading_from": "Deuteronomy 34",
    "reading_to": "Deuteronomy 34",
    "section": "Deuteronomy",
    "release_date": "2026-11-23T00:00:00.000Z"
  },
  {
    "id": "s65",
    "day_number": 65,
    "week_number": 10,
    "reading_from": "Joshua 1",
    "reading_to": "Joshua 3",
    "section": "Joshua",
    "release_date": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "s66",
    "day_number": 66,
    "week_number": 10,
    "reading_from": "Joshua 4",
    "reading_to": "Joshua 6",
    "section": "Joshua",
    "release_date": "2026-11-25T00:00:00.000Z"
  },
  {
    "id": "s67",
    "day_number": 67,
    "week_number": 10,
    "reading_from": "Joshua 7",
    "reading_to": "Joshua 9",
    "section": "Joshua",
    "release_date": "2026-11-26T00:00:00.000Z"
  },
  {
    "id": "s68",
    "day_number": 68,
    "week_number": 10,
    "reading_from": "Joshua 10",
    "reading_to": "Joshua 12",
    "section": "Joshua",
    "release_date": "2026-11-27T00:00:00.000Z"
  },
  {
    "id": "s69",
    "day_number": 69,
    "week_number": 10,
    "reading_from": "Joshua 13",
    "reading_to": "Joshua 15",
    "section": "Joshua",
    "release_date": "2026-11-28T00:00:00.000Z"
  },
  {
    "id": "s70",
    "day_number": 70,
    "week_number": 10,
    "reading_from": "Joshua 16",
    "reading_to": "Joshua 18",
    "section": "Joshua",
    "release_date": "2026-11-29T00:00:00.000Z"
  },
  {
    "id": "s71",
    "day_number": 71,
    "week_number": 11,
    "reading_from": "Joshua 19",
    "reading_to": "Joshua 21",
    "section": "Joshua",
    "release_date": "2026-11-30T00:00:00.000Z"
  },
  {
    "id": "s72",
    "day_number": 72,
    "week_number": 11,
    "reading_from": "Joshua 22",
    "reading_to": "Joshua 24",
    "section": "Joshua",
    "release_date": "2026-12-01T00:00:00.000Z"
  },
  {
    "id": "s73",
    "day_number": 73,
    "week_number": 11,
    "reading_from": "Judges 1",
    "reading_to": "Judges 3",
    "section": "Judges",
    "release_date": "2026-12-02T00:00:00.000Z"
  },
  {
    "id": "s74",
    "day_number": 74,
    "week_number": 11,
    "reading_from": "Judges 4",
    "reading_to": "Judges 6",
    "section": "Judges",
    "release_date": "2026-12-03T00:00:00.000Z"
  },
  {
    "id": "s75",
    "day_number": 75,
    "week_number": 11,
    "reading_from": "Judges 7",
    "reading_to": "Judges 9",
    "section": "Judges",
    "release_date": "2026-12-04T00:00:00.000Z"
  },
  {
    "id": "s76",
    "day_number": 76,
    "week_number": 11,
    "reading_from": "Judges 10",
    "reading_to": "Judges 12",
    "section": "Judges",
    "release_date": "2026-12-05T00:00:00.000Z"
  },
  {
    "id": "s77",
    "day_number": 77,
    "week_number": 11,
    "reading_from": "Judges 13",
    "reading_to": "Judges 15",
    "section": "Judges",
    "release_date": "2026-12-06T00:00:00.000Z"
  },
  {
    "id": "s78",
    "day_number": 78,
    "week_number": 12,
    "reading_from": "Judges 16",
    "reading_to": "Judges 18",
    "section": "Judges",
    "release_date": "2026-12-07T00:00:00.000Z"
  },
  {
    "id": "s79",
    "day_number": 79,
    "week_number": 12,
    "reading_from": "Judges 19",
    "reading_to": "Judges 21",
    "section": "Judges",
    "release_date": "2026-12-08T00:00:00.000Z"
  },
  {
    "id": "s80",
    "day_number": 80,
    "week_number": 12,
    "reading_from": "Ruth 1",
    "reading_to": "Ruth 3",
    "section": "Ruth",
    "release_date": "2026-12-09T00:00:00.000Z"
  },
  {
    "id": "s81",
    "day_number": 81,
    "week_number": 12,
    "reading_from": "Ruth 4",
    "reading_to": "Ruth 4",
    "section": "Ruth",
    "release_date": "2026-12-10T00:00:00.000Z"
  },
  {
    "id": "s82",
    "day_number": 82,
    "week_number": 12,
    "reading_from": "1 Samuel 1",
    "reading_to": "1 Samuel 3",
    "section": "1 Samuel",
    "release_date": "2026-12-11T00:00:00.000Z"
  },
  {
    "id": "s83",
    "day_number": 83,
    "week_number": 12,
    "reading_from": "1 Samuel 4",
    "reading_to": "1 Samuel 6",
    "section": "1 Samuel",
    "release_date": "2026-12-12T00:00:00.000Z"
  },
  {
    "id": "s84",
    "day_number": 84,
    "week_number": 12,
    "reading_from": "1 Samuel 7",
    "reading_to": "1 Samuel 9",
    "section": "1 Samuel",
    "release_date": "2026-12-13T00:00:00.000Z"
  },
  {
    "id": "s85",
    "day_number": 85,
    "week_number": 13,
    "reading_from": "1 Samuel 10",
    "reading_to": "1 Samuel 12",
    "section": "1 Samuel",
    "release_date": "2026-12-14T00:00:00.000Z"
  },
  {
    "id": "s86",
    "day_number": 86,
    "week_number": 13,
    "reading_from": "1 Samuel 13",
    "reading_to": "1 Samuel 15",
    "section": "1 Samuel",
    "release_date": "2026-12-15T00:00:00.000Z"
  },
  {
    "id": "s87",
    "day_number": 87,
    "week_number": 13,
    "reading_from": "1 Samuel 16",
    "reading_to": "1 Samuel 18",
    "section": "1 Samuel",
    "release_date": "2026-12-16T00:00:00.000Z"
  },
  {
    "id": "s88",
    "day_number": 88,
    "week_number": 13,
    "reading_from": "1 Samuel 19",
    "reading_to": "1 Samuel 21",
    "section": "1 Samuel",
    "release_date": "2026-12-17T00:00:00.000Z"
  },
  {
    "id": "s89",
    "day_number": 89,
    "week_number": 13,
    "reading_from": "1 Samuel 22",
    "reading_to": "1 Samuel 24",
    "section": "1 Samuel",
    "release_date": "2026-12-18T00:00:00.000Z"
  },
  {
    "id": "s90",
    "day_number": 90,
    "week_number": 13,
    "reading_from": "1 Samuel 25",
    "reading_to": "1 Samuel 27",
    "section": "1 Samuel",
    "release_date": "2026-12-19T00:00:00.000Z"
  },
  {
    "id": "s91",
    "day_number": 91,
    "week_number": 13,
    "reading_from": "1 Samuel 28",
    "reading_to": "1 Samuel 30",
    "section": "1 Samuel",
    "release_date": "2026-12-20T00:00:00.000Z"
  },
  {
    "id": "s92",
    "day_number": 92,
    "week_number": 14,
    "reading_from": "1 Samuel 31",
    "reading_to": "1 Samuel 31",
    "section": "1 Samuel",
    "release_date": "2026-12-21T00:00:00.000Z"
  },
  {
    "id": "s93",
    "day_number": 93,
    "week_number": 14,
    "reading_from": "2 Samuel 1",
    "reading_to": "2 Samuel 3",
    "section": "2 Samuel",
    "release_date": "2026-12-22T00:00:00.000Z"
  },
  {
    "id": "s94",
    "day_number": 94,
    "week_number": 14,
    "reading_from": "2 Samuel 4",
    "reading_to": "2 Samuel 6",
    "section": "2 Samuel",
    "release_date": "2026-12-23T00:00:00.000Z"
  },
  {
    "id": "s95",
    "day_number": 95,
    "week_number": 14,
    "reading_from": "2 Samuel 7",
    "reading_to": "2 Samuel 9",
    "section": "2 Samuel",
    "release_date": "2026-12-24T00:00:00.000Z"
  },
  {
    "id": "s96",
    "day_number": 96,
    "week_number": 14,
    "reading_from": "2 Samuel 10",
    "reading_to": "2 Samuel 12",
    "section": "2 Samuel",
    "release_date": "2026-12-25T00:00:00.000Z"
  },
  {
    "id": "s97",
    "day_number": 97,
    "week_number": 14,
    "reading_from": "2 Samuel 13",
    "reading_to": "2 Samuel 15",
    "section": "2 Samuel",
    "release_date": "2026-12-26T00:00:00.000Z"
  },
  {
    "id": "s98",
    "day_number": 98,
    "week_number": 14,
    "reading_from": "2 Samuel 16",
    "reading_to": "2 Samuel 18",
    "section": "2 Samuel",
    "release_date": "2026-12-27T00:00:00.000Z"
  },
  {
    "id": "s99",
    "day_number": 99,
    "week_number": 15,
    "reading_from": "2 Samuel 19",
    "reading_to": "2 Samuel 21",
    "section": "2 Samuel",
    "release_date": "2026-12-28T00:00:00.000Z"
  },
  {
    "id": "s100",
    "day_number": 100,
    "week_number": 15,
    "reading_from": "2 Samuel 22",
    "reading_to": "2 Samuel 24",
    "section": "2 Samuel",
    "release_date": "2026-12-29T00:00:00.000Z"
  },
  {
    "id": "s101",
    "day_number": 101,
    "week_number": 15,
    "reading_from": "1 Kings 1",
    "reading_to": "1 Kings 3",
    "section": "1 Kings",
    "release_date": "2026-12-30T00:00:00.000Z"
  },
  {
    "id": "s102",
    "day_number": 102,
    "week_number": 15,
    "reading_from": "1 Kings 4",
    "reading_to": "1 Kings 6",
    "section": "1 Kings",
    "release_date": "2026-12-31T00:00:00.000Z"
  },
  {
    "id": "s103",
    "day_number": 103,
    "week_number": 15,
    "reading_from": "1 Kings 7",
    "reading_to": "1 Kings 9",
    "section": "1 Kings",
    "release_date": "2027-01-01T00:00:00.000Z"
  },
  {
    "id": "s104",
    "day_number": 104,
    "week_number": 15,
    "reading_from": "1 Kings 10",
    "reading_to": "1 Kings 12",
    "section": "1 Kings",
    "release_date": "2027-01-02T00:00:00.000Z"
  },
  {
    "id": "s105",
    "day_number": 105,
    "week_number": 15,
    "reading_from": "1 Kings 13",
    "reading_to": "1 Kings 15",
    "section": "1 Kings",
    "release_date": "2027-01-03T00:00:00.000Z"
  },
  {
    "id": "s106",
    "day_number": 106,
    "week_number": 16,
    "reading_from": "1 Kings 16",
    "reading_to": "1 Kings 18",
    "section": "1 Kings",
    "release_date": "2027-01-04T00:00:00.000Z"
  },
  {
    "id": "s107",
    "day_number": 107,
    "week_number": 16,
    "reading_from": "1 Kings 19",
    "reading_to": "1 Kings 21",
    "section": "1 Kings",
    "release_date": "2027-01-05T00:00:00.000Z"
  },
  {
    "id": "s108",
    "day_number": 108,
    "week_number": 16,
    "reading_from": "1 Kings 22",
    "reading_to": "1 Kings 22",
    "section": "1 Kings",
    "release_date": "2027-01-06T00:00:00.000Z"
  },
  {
    "id": "s109",
    "day_number": 109,
    "week_number": 16,
    "reading_from": "2 Kings 1",
    "reading_to": "2 Kings 3",
    "section": "2 Kings",
    "release_date": "2027-01-07T00:00:00.000Z"
  },
  {
    "id": "s110",
    "day_number": 110,
    "week_number": 16,
    "reading_from": "2 Kings 4",
    "reading_to": "2 Kings 6",
    "section": "2 Kings",
    "release_date": "2027-01-08T00:00:00.000Z"
  },
  {
    "id": "s111",
    "day_number": 111,
    "week_number": 16,
    "reading_from": "2 Kings 7",
    "reading_to": "2 Kings 9",
    "section": "2 Kings",
    "release_date": "2027-01-09T00:00:00.000Z"
  },
  {
    "id": "s112",
    "day_number": 112,
    "week_number": 16,
    "reading_from": "2 Kings 10",
    "reading_to": "2 Kings 12",
    "section": "2 Kings",
    "release_date": "2027-01-10T00:00:00.000Z"
  },
  {
    "id": "s113",
    "day_number": 113,
    "week_number": 17,
    "reading_from": "2 Kings 13",
    "reading_to": "2 Kings 15",
    "section": "2 Kings",
    "release_date": "2027-01-11T00:00:00.000Z"
  },
  {
    "id": "s114",
    "day_number": 114,
    "week_number": 17,
    "reading_from": "2 Kings 16",
    "reading_to": "2 Kings 18",
    "section": "2 Kings",
    "release_date": "2027-01-12T00:00:00.000Z"
  },
  {
    "id": "s115",
    "day_number": 115,
    "week_number": 17,
    "reading_from": "2 Kings 19",
    "reading_to": "2 Kings 21",
    "section": "2 Kings",
    "release_date": "2027-01-13T00:00:00.000Z"
  },
  {
    "id": "s116",
    "day_number": 116,
    "week_number": 17,
    "reading_from": "2 Kings 22",
    "reading_to": "2 Kings 24",
    "section": "2 Kings",
    "release_date": "2027-01-14T00:00:00.000Z"
  },
  {
    "id": "s117",
    "day_number": 117,
    "week_number": 17,
    "reading_from": "2 Kings 25",
    "reading_to": "2 Kings 25",
    "section": "2 Kings",
    "release_date": "2027-01-15T00:00:00.000Z"
  },
  {
    "id": "s118",
    "day_number": 118,
    "week_number": 17,
    "reading_from": "1 Chronicles 1",
    "reading_to": "1 Chronicles 3",
    "section": "1 Chronicles",
    "release_date": "2027-01-16T00:00:00.000Z"
  },
  {
    "id": "s119",
    "day_number": 119,
    "week_number": 17,
    "reading_from": "1 Chronicles 4",
    "reading_to": "1 Chronicles 6",
    "section": "1 Chronicles",
    "release_date": "2027-01-17T00:00:00.000Z"
  },
  {
    "id": "s120",
    "day_number": 120,
    "week_number": 18,
    "reading_from": "1 Chronicles 7",
    "reading_to": "1 Chronicles 9",
    "section": "1 Chronicles",
    "release_date": "2027-01-18T00:00:00.000Z"
  },
  {
    "id": "s121",
    "day_number": 121,
    "week_number": 18,
    "reading_from": "1 Chronicles 10",
    "reading_to": "1 Chronicles 12",
    "section": "1 Chronicles",
    "release_date": "2027-01-19T00:00:00.000Z"
  },
  {
    "id": "s122",
    "day_number": 122,
    "week_number": 18,
    "reading_from": "1 Chronicles 13",
    "reading_to": "1 Chronicles 15",
    "section": "1 Chronicles",
    "release_date": "2027-01-20T00:00:00.000Z"
  },
  {
    "id": "s123",
    "day_number": 123,
    "week_number": 18,
    "reading_from": "1 Chronicles 16",
    "reading_to": "1 Chronicles 18",
    "section": "1 Chronicles",
    "release_date": "2027-01-21T00:00:00.000Z"
  },
  {
    "id": "s124",
    "day_number": 124,
    "week_number": 18,
    "reading_from": "1 Chronicles 19",
    "reading_to": "1 Chronicles 21",
    "section": "1 Chronicles",
    "release_date": "2027-01-22T00:00:00.000Z"
  },
  {
    "id": "s125",
    "day_number": 125,
    "week_number": 18,
    "reading_from": "1 Chronicles 22",
    "reading_to": "1 Chronicles 24",
    "section": "1 Chronicles",
    "release_date": "2027-01-23T00:00:00.000Z"
  },
  {
    "id": "s126",
    "day_number": 126,
    "week_number": 18,
    "reading_from": "1 Chronicles 25",
    "reading_to": "1 Chronicles 27",
    "section": "1 Chronicles",
    "release_date": "2027-01-24T00:00:00.000Z"
  },
  {
    "id": "s127",
    "day_number": 127,
    "week_number": 19,
    "reading_from": "1 Chronicles 28",
    "reading_to": "1 Chronicles 29",
    "section": "1 Chronicles",
    "release_date": "2027-01-25T00:00:00.000Z"
  },
  {
    "id": "s128",
    "day_number": 128,
    "week_number": 19,
    "reading_from": "2 Chronicles 1",
    "reading_to": "2 Chronicles 3",
    "section": "2 Chronicles",
    "release_date": "2027-01-26T00:00:00.000Z"
  },
  {
    "id": "s129",
    "day_number": 129,
    "week_number": 19,
    "reading_from": "2 Chronicles 4",
    "reading_to": "2 Chronicles 6",
    "section": "2 Chronicles",
    "release_date": "2027-01-27T00:00:00.000Z"
  },
  {
    "id": "s130",
    "day_number": 130,
    "week_number": 19,
    "reading_from": "2 Chronicles 7",
    "reading_to": "2 Chronicles 9",
    "section": "2 Chronicles",
    "release_date": "2027-01-28T00:00:00.000Z"
  },
  {
    "id": "s131",
    "day_number": 131,
    "week_number": 19,
    "reading_from": "2 Chronicles 10",
    "reading_to": "2 Chronicles 12",
    "section": "2 Chronicles",
    "release_date": "2027-01-29T00:00:00.000Z"
  },
  {
    "id": "s132",
    "day_number": 132,
    "week_number": 19,
    "reading_from": "2 Chronicles 13",
    "reading_to": "2 Chronicles 15",
    "section": "2 Chronicles",
    "release_date": "2027-01-30T00:00:00.000Z"
  },
  {
    "id": "s133",
    "day_number": 133,
    "week_number": 19,
    "reading_from": "2 Chronicles 16",
    "reading_to": "2 Chronicles 18",
    "section": "2 Chronicles",
    "release_date": "2027-01-31T00:00:00.000Z"
  },
  {
    "id": "s134",
    "day_number": 134,
    "week_number": 20,
    "reading_from": "2 Chronicles 19",
    "reading_to": "2 Chronicles 21",
    "section": "2 Chronicles",
    "release_date": "2027-02-01T00:00:00.000Z"
  },
  {
    "id": "s135",
    "day_number": 135,
    "week_number": 20,
    "reading_from": "2 Chronicles 22",
    "reading_to": "2 Chronicles 24",
    "section": "2 Chronicles",
    "release_date": "2027-02-02T00:00:00.000Z"
  },
  {
    "id": "s136",
    "day_number": 136,
    "week_number": 20,
    "reading_from": "2 Chronicles 25",
    "reading_to": "2 Chronicles 27",
    "section": "2 Chronicles",
    "release_date": "2027-02-03T00:00:00.000Z"
  },
  {
    "id": "s137",
    "day_number": 137,
    "week_number": 20,
    "reading_from": "2 Chronicles 28",
    "reading_to": "2 Chronicles 30",
    "section": "2 Chronicles",
    "release_date": "2027-02-04T00:00:00.000Z"
  },
  {
    "id": "s138",
    "day_number": 138,
    "week_number": 20,
    "reading_from": "2 Chronicles 31",
    "reading_to": "2 Chronicles 33",
    "section": "2 Chronicles",
    "release_date": "2027-02-05T00:00:00.000Z"
  },
  {
    "id": "s139",
    "day_number": 139,
    "week_number": 20,
    "reading_from": "2 Chronicles 34",
    "reading_to": "2 Chronicles 36",
    "section": "2 Chronicles",
    "release_date": "2027-02-06T00:00:00.000Z"
  },
  {
    "id": "s140",
    "day_number": 140,
    "week_number": 20,
    "reading_from": "Ezra 1",
    "reading_to": "Ezra 3",
    "section": "Ezra",
    "release_date": "2027-02-07T00:00:00.000Z"
  },
  {
    "id": "s141",
    "day_number": 141,
    "week_number": 21,
    "reading_from": "Ezra 4",
    "reading_to": "Ezra 6",
    "section": "Ezra",
    "release_date": "2027-02-08T00:00:00.000Z"
  },
  {
    "id": "s142",
    "day_number": 142,
    "week_number": 21,
    "reading_from": "Ezra 7",
    "reading_to": "Ezra 9",
    "section": "Ezra",
    "release_date": "2027-02-09T00:00:00.000Z"
  },
  {
    "id": "s143",
    "day_number": 143,
    "week_number": 21,
    "reading_from": "Ezra 10",
    "reading_to": "Ezra 10",
    "section": "Ezra",
    "release_date": "2027-02-10T00:00:00.000Z"
  },
  {
    "id": "s144",
    "day_number": 144,
    "week_number": 21,
    "reading_from": "Nehemiah 1",
    "reading_to": "Nehemiah 3",
    "section": "Nehemiah",
    "release_date": "2027-02-11T00:00:00.000Z"
  },
  {
    "id": "s145",
    "day_number": 145,
    "week_number": 21,
    "reading_from": "Nehemiah 4",
    "reading_to": "Nehemiah 6",
    "section": "Nehemiah",
    "release_date": "2027-02-12T00:00:00.000Z"
  },
  {
    "id": "s146",
    "day_number": 146,
    "week_number": 21,
    "reading_from": "Nehemiah 7",
    "reading_to": "Nehemiah 9",
    "section": "Nehemiah",
    "release_date": "2027-02-13T00:00:00.000Z"
  },
  {
    "id": "s147",
    "day_number": 147,
    "week_number": 21,
    "reading_from": "Nehemiah 10",
    "reading_to": "Nehemiah 12",
    "section": "Nehemiah",
    "release_date": "2027-02-14T00:00:00.000Z"
  },
  {
    "id": "s148",
    "day_number": 148,
    "week_number": 22,
    "reading_from": "Nehemiah 13",
    "reading_to": "Nehemiah 13",
    "section": "Nehemiah",
    "release_date": "2027-02-15T00:00:00.000Z"
  },
  {
    "id": "s149",
    "day_number": 149,
    "week_number": 22,
    "reading_from": "Esther 1",
    "reading_to": "Esther 3",
    "section": "Esther",
    "release_date": "2027-02-16T00:00:00.000Z"
  },
  {
    "id": "s150",
    "day_number": 150,
    "week_number": 22,
    "reading_from": "Esther 4",
    "reading_to": "Esther 6",
    "section": "Esther",
    "release_date": "2027-02-17T00:00:00.000Z"
  },
  {
    "id": "s151",
    "day_number": 151,
    "week_number": 22,
    "reading_from": "Esther 7",
    "reading_to": "Esther 9",
    "section": "Esther",
    "release_date": "2027-02-18T00:00:00.000Z"
  },
  {
    "id": "s152",
    "day_number": 152,
    "week_number": 22,
    "reading_from": "Esther 10",
    "reading_to": "Esther 10",
    "section": "Esther",
    "release_date": "2027-02-19T00:00:00.000Z"
  },
  {
    "id": "s153",
    "day_number": 153,
    "week_number": 22,
    "reading_from": "Job 1",
    "reading_to": "Job 3",
    "section": "Job",
    "release_date": "2027-02-20T00:00:00.000Z"
  },
  {
    "id": "s154",
    "day_number": 154,
    "week_number": 22,
    "reading_from": "Job 4",
    "reading_to": "Job 6",
    "section": "Job",
    "release_date": "2027-02-21T00:00:00.000Z"
  },
  {
    "id": "s155",
    "day_number": 155,
    "week_number": 23,
    "reading_from": "Job 7",
    "reading_to": "Job 9",
    "section": "Job",
    "release_date": "2027-02-22T00:00:00.000Z"
  },
  {
    "id": "s156",
    "day_number": 156,
    "week_number": 23,
    "reading_from": "Job 10",
    "reading_to": "Job 12",
    "section": "Job",
    "release_date": "2027-02-23T00:00:00.000Z"
  },
  {
    "id": "s157",
    "day_number": 157,
    "week_number": 23,
    "reading_from": "Job 13",
    "reading_to": "Job 15",
    "section": "Job",
    "release_date": "2027-02-24T00:00:00.000Z"
  },
  {
    "id": "s158",
    "day_number": 158,
    "week_number": 23,
    "reading_from": "Job 16",
    "reading_to": "Job 18",
    "section": "Job",
    "release_date": "2027-02-25T00:00:00.000Z"
  },
  {
    "id": "s159",
    "day_number": 159,
    "week_number": 23,
    "reading_from": "Job 19",
    "reading_to": "Job 21",
    "section": "Job",
    "release_date": "2027-02-26T00:00:00.000Z"
  },
  {
    "id": "s160",
    "day_number": 160,
    "week_number": 23,
    "reading_from": "Job 22",
    "reading_to": "Job 24",
    "section": "Job",
    "release_date": "2027-02-27T00:00:00.000Z"
  },
  {
    "id": "s161",
    "day_number": 161,
    "week_number": 23,
    "reading_from": "Job 25",
    "reading_to": "Job 27",
    "section": "Job",
    "release_date": "2027-02-28T00:00:00.000Z"
  },
  {
    "id": "s162",
    "day_number": 162,
    "week_number": 24,
    "reading_from": "Job 28",
    "reading_to": "Job 30",
    "section": "Job",
    "release_date": "2027-03-01T00:00:00.000Z"
  },
  {
    "id": "s163",
    "day_number": 163,
    "week_number": 24,
    "reading_from": "Job 31",
    "reading_to": "Job 33",
    "section": "Job",
    "release_date": "2027-03-02T00:00:00.000Z"
  },
  {
    "id": "s164",
    "day_number": 164,
    "week_number": 24,
    "reading_from": "Job 34",
    "reading_to": "Job 36",
    "section": "Job",
    "release_date": "2027-03-03T00:00:00.000Z"
  },
  {
    "id": "s165",
    "day_number": 165,
    "week_number": 24,
    "reading_from": "Job 37",
    "reading_to": "Job 39",
    "section": "Job",
    "release_date": "2027-03-04T00:00:00.000Z"
  },
  {
    "id": "s166",
    "day_number": 166,
    "week_number": 24,
    "reading_from": "Job 40",
    "reading_to": "Job 42",
    "section": "Job",
    "release_date": "2027-03-05T00:00:00.000Z"
  },
  {
    "id": "s167",
    "day_number": 167,
    "week_number": 24,
    "reading_from": "Psalms 1",
    "reading_to": "Psalms 3",
    "section": "Psalms",
    "release_date": "2027-03-06T00:00:00.000Z"
  },
  {
    "id": "s168",
    "day_number": 168,
    "week_number": 24,
    "reading_from": "Psalms 4",
    "reading_to": "Psalms 6",
    "section": "Psalms",
    "release_date": "2027-03-07T00:00:00.000Z"
  },
  {
    "id": "s169",
    "day_number": 169,
    "week_number": 25,
    "reading_from": "Psalms 7",
    "reading_to": "Psalms 9",
    "section": "Psalms",
    "release_date": "2027-03-08T00:00:00.000Z"
  },
  {
    "id": "s170",
    "day_number": 170,
    "week_number": 25,
    "reading_from": "Psalms 10",
    "reading_to": "Psalms 12",
    "section": "Psalms",
    "release_date": "2027-03-09T00:00:00.000Z"
  },
  {
    "id": "s171",
    "day_number": 171,
    "week_number": 25,
    "reading_from": "Psalms 13",
    "reading_to": "Psalms 15",
    "section": "Psalms",
    "release_date": "2027-03-10T00:00:00.000Z"
  },
  {
    "id": "s172",
    "day_number": 172,
    "week_number": 25,
    "reading_from": "Psalms 16",
    "reading_to": "Psalms 18",
    "section": "Psalms",
    "release_date": "2027-03-11T00:00:00.000Z"
  },
  {
    "id": "s173",
    "day_number": 173,
    "week_number": 25,
    "reading_from": "Psalms 19",
    "reading_to": "Psalms 21",
    "section": "Psalms",
    "release_date": "2027-03-12T00:00:00.000Z"
  },
  {
    "id": "s174",
    "day_number": 174,
    "week_number": 25,
    "reading_from": "Psalms 22",
    "reading_to": "Psalms 24",
    "section": "Psalms",
    "release_date": "2027-03-13T00:00:00.000Z"
  },
  {
    "id": "s175",
    "day_number": 175,
    "week_number": 25,
    "reading_from": "Psalms 25",
    "reading_to": "Psalms 27",
    "section": "Psalms",
    "release_date": "2027-03-14T00:00:00.000Z"
  },
  {
    "id": "s176",
    "day_number": 176,
    "week_number": 26,
    "reading_from": "Psalms 28",
    "reading_to": "Psalms 30",
    "section": "Psalms",
    "release_date": "2027-03-15T00:00:00.000Z"
  },
  {
    "id": "s177",
    "day_number": 177,
    "week_number": 26,
    "reading_from": "Psalms 31",
    "reading_to": "Psalms 33",
    "section": "Psalms",
    "release_date": "2027-03-16T00:00:00.000Z"
  },
  {
    "id": "s178",
    "day_number": 178,
    "week_number": 26,
    "reading_from": "Psalms 34",
    "reading_to": "Psalms 36",
    "section": "Psalms",
    "release_date": "2027-03-17T00:00:00.000Z"
  },
  {
    "id": "s179",
    "day_number": 179,
    "week_number": 26,
    "reading_from": "Psalms 37",
    "reading_to": "Psalms 39",
    "section": "Psalms",
    "release_date": "2027-03-18T00:00:00.000Z"
  },
  {
    "id": "s180",
    "day_number": 180,
    "week_number": 26,
    "reading_from": "Psalms 40",
    "reading_to": "Psalms 42",
    "section": "Psalms",
    "release_date": "2027-03-19T00:00:00.000Z"
  },
  {
    "id": "s181",
    "day_number": 181,
    "week_number": 26,
    "reading_from": "Psalms 43",
    "reading_to": "Psalms 45",
    "section": "Psalms",
    "release_date": "2027-03-20T00:00:00.000Z"
  },
  {
    "id": "s182",
    "day_number": 182,
    "week_number": 26,
    "reading_from": "Psalms 46",
    "reading_to": "Psalms 48",
    "section": "Psalms",
    "release_date": "2027-03-21T00:00:00.000Z"
  },
  {
    "id": "s183",
    "day_number": 183,
    "week_number": 27,
    "reading_from": "Psalms 49",
    "reading_to": "Psalms 51",
    "section": "Psalms",
    "release_date": "2027-03-22T00:00:00.000Z"
  },
  {
    "id": "s184",
    "day_number": 184,
    "week_number": 27,
    "reading_from": "Psalms 52",
    "reading_to": "Psalms 54",
    "section": "Psalms",
    "release_date": "2027-03-23T00:00:00.000Z"
  },
  {
    "id": "s185",
    "day_number": 185,
    "week_number": 27,
    "reading_from": "Psalms 55",
    "reading_to": "Psalms 57",
    "section": "Psalms",
    "release_date": "2027-03-24T00:00:00.000Z"
  },
  {
    "id": "s186",
    "day_number": 186,
    "week_number": 27,
    "reading_from": "Psalms 58",
    "reading_to": "Psalms 60",
    "section": "Psalms",
    "release_date": "2027-03-25T00:00:00.000Z"
  },
  {
    "id": "s187",
    "day_number": 187,
    "week_number": 27,
    "reading_from": "Psalms 61",
    "reading_to": "Psalms 63",
    "section": "Psalms",
    "release_date": "2027-03-26T00:00:00.000Z"
  },
  {
    "id": "s188",
    "day_number": 188,
    "week_number": 27,
    "reading_from": "Psalms 64",
    "reading_to": "Psalms 66",
    "section": "Psalms",
    "release_date": "2027-03-27T00:00:00.000Z"
  },
  {
    "id": "s189",
    "day_number": 189,
    "week_number": 27,
    "reading_from": "Psalms 67",
    "reading_to": "Psalms 69",
    "section": "Psalms",
    "release_date": "2027-03-28T00:00:00.000Z"
  },
  {
    "id": "s190",
    "day_number": 190,
    "week_number": 28,
    "reading_from": "Psalms 70",
    "reading_to": "Psalms 72",
    "section": "Psalms",
    "release_date": "2027-03-29T00:00:00.000Z"
  },
  {
    "id": "s191",
    "day_number": 191,
    "week_number": 28,
    "reading_from": "Psalms 73",
    "reading_to": "Psalms 75",
    "section": "Psalms",
    "release_date": "2027-03-30T00:00:00.000Z"
  },
  {
    "id": "s192",
    "day_number": 192,
    "week_number": 28,
    "reading_from": "Psalms 76",
    "reading_to": "Psalms 78",
    "section": "Psalms",
    "release_date": "2027-03-31T00:00:00.000Z"
  },
  {
    "id": "s193",
    "day_number": 193,
    "week_number": 28,
    "reading_from": "Psalms 79",
    "reading_to": "Psalms 81",
    "section": "Psalms",
    "release_date": "2027-04-01T00:00:00.000Z"
  },
  {
    "id": "s194",
    "day_number": 194,
    "week_number": 28,
    "reading_from": "Psalms 82",
    "reading_to": "Psalms 84",
    "section": "Psalms",
    "release_date": "2027-04-02T00:00:00.000Z"
  },
  {
    "id": "s195",
    "day_number": 195,
    "week_number": 28,
    "reading_from": "Psalms 85",
    "reading_to": "Psalms 87",
    "section": "Psalms",
    "release_date": "2027-04-03T00:00:00.000Z"
  },
  {
    "id": "s196",
    "day_number": 196,
    "week_number": 28,
    "reading_from": "Psalms 88",
    "reading_to": "Psalms 90",
    "section": "Psalms",
    "release_date": "2027-04-04T00:00:00.000Z"
  },
  {
    "id": "s197",
    "day_number": 197,
    "week_number": 29,
    "reading_from": "Psalms 91",
    "reading_to": "Psalms 93",
    "section": "Psalms",
    "release_date": "2027-04-05T00:00:00.000Z"
  },
  {
    "id": "s198",
    "day_number": 198,
    "week_number": 29,
    "reading_from": "Psalms 94",
    "reading_to": "Psalms 96",
    "section": "Psalms",
    "release_date": "2027-04-06T00:00:00.000Z"
  },
  {
    "id": "s199",
    "day_number": 199,
    "week_number": 29,
    "reading_from": "Psalms 97",
    "reading_to": "Psalms 99",
    "section": "Psalms",
    "release_date": "2027-04-07T00:00:00.000Z"
  },
  {
    "id": "s200",
    "day_number": 200,
    "week_number": 29,
    "reading_from": "Psalms 100",
    "reading_to": "Psalms 102",
    "section": "Psalms",
    "release_date": "2027-04-08T00:00:00.000Z"
  },
  {
    "id": "s201",
    "day_number": 201,
    "week_number": 29,
    "reading_from": "Psalms 103",
    "reading_to": "Psalms 105",
    "section": "Psalms",
    "release_date": "2027-04-09T00:00:00.000Z"
  },
  {
    "id": "s202",
    "day_number": 202,
    "week_number": 29,
    "reading_from": "Psalms 106",
    "reading_to": "Psalms 108",
    "section": "Psalms",
    "release_date": "2027-04-10T00:00:00.000Z"
  },
  {
    "id": "s203",
    "day_number": 203,
    "week_number": 29,
    "reading_from": "Psalms 109",
    "reading_to": "Psalms 111",
    "section": "Psalms",
    "release_date": "2027-04-11T00:00:00.000Z"
  },
  {
    "id": "s204",
    "day_number": 204,
    "week_number": 30,
    "reading_from": "Psalms 112",
    "reading_to": "Psalms 114",
    "section": "Psalms",
    "release_date": "2027-04-12T00:00:00.000Z"
  },
  {
    "id": "s205",
    "day_number": 205,
    "week_number": 30,
    "reading_from": "Psalms 115",
    "reading_to": "Psalms 117",
    "section": "Psalms",
    "release_date": "2027-04-13T00:00:00.000Z"
  },
  {
    "id": "s206",
    "day_number": 206,
    "week_number": 30,
    "reading_from": "Psalms 118",
    "reading_to": "Psalms 120",
    "section": "Psalms",
    "release_date": "2027-04-14T00:00:00.000Z"
  },
  {
    "id": "s207",
    "day_number": 207,
    "week_number": 30,
    "reading_from": "Psalms 121",
    "reading_to": "Psalms 123",
    "section": "Psalms",
    "release_date": "2027-04-15T00:00:00.000Z"
  },
  {
    "id": "s208",
    "day_number": 208,
    "week_number": 30,
    "reading_from": "Psalms 124",
    "reading_to": "Psalms 126",
    "section": "Psalms",
    "release_date": "2027-04-16T00:00:00.000Z"
  },
  {
    "id": "s209",
    "day_number": 209,
    "week_number": 30,
    "reading_from": "Psalms 127",
    "reading_to": "Psalms 129",
    "section": "Psalms",
    "release_date": "2027-04-17T00:00:00.000Z"
  },
  {
    "id": "s210",
    "day_number": 210,
    "week_number": 30,
    "reading_from": "Psalms 130",
    "reading_to": "Psalms 132",
    "section": "Psalms",
    "release_date": "2027-04-18T00:00:00.000Z"
  },
  {
    "id": "s211",
    "day_number": 211,
    "week_number": 31,
    "reading_from": "Psalms 133",
    "reading_to": "Psalms 135",
    "section": "Psalms",
    "release_date": "2027-04-19T00:00:00.000Z"
  },
  {
    "id": "s212",
    "day_number": 212,
    "week_number": 31,
    "reading_from": "Psalms 136",
    "reading_to": "Psalms 138",
    "section": "Psalms",
    "release_date": "2027-04-20T00:00:00.000Z"
  },
  {
    "id": "s213",
    "day_number": 213,
    "week_number": 31,
    "reading_from": "Psalms 139",
    "reading_to": "Psalms 141",
    "section": "Psalms",
    "release_date": "2027-04-21T00:00:00.000Z"
  },
  {
    "id": "s214",
    "day_number": 214,
    "week_number": 31,
    "reading_from": "Psalms 142",
    "reading_to": "Psalms 144",
    "section": "Psalms",
    "release_date": "2027-04-22T00:00:00.000Z"
  },
  {
    "id": "s215",
    "day_number": 215,
    "week_number": 31,
    "reading_from": "Psalms 145",
    "reading_to": "Psalms 147",
    "section": "Psalms",
    "release_date": "2027-04-23T00:00:00.000Z"
  },
  {
    "id": "s216",
    "day_number": 216,
    "week_number": 31,
    "reading_from": "Psalms 148",
    "reading_to": "Psalms 150",
    "section": "Psalms",
    "release_date": "2027-04-24T00:00:00.000Z"
  },
  {
    "id": "s217",
    "day_number": 217,
    "week_number": 31,
    "reading_from": "Proverbs 1",
    "reading_to": "Proverbs 3",
    "section": "Proverbs",
    "release_date": "2027-04-25T00:00:00.000Z"
  },
  {
    "id": "s218",
    "day_number": 218,
    "week_number": 32,
    "reading_from": "Proverbs 4",
    "reading_to": "Proverbs 6",
    "section": "Proverbs",
    "release_date": "2027-04-26T00:00:00.000Z"
  },
  {
    "id": "s219",
    "day_number": 219,
    "week_number": 32,
    "reading_from": "Proverbs 7",
    "reading_to": "Proverbs 9",
    "section": "Proverbs",
    "release_date": "2027-04-27T00:00:00.000Z"
  },
  {
    "id": "s220",
    "day_number": 220,
    "week_number": 32,
    "reading_from": "Proverbs 10",
    "reading_to": "Proverbs 12",
    "section": "Proverbs",
    "release_date": "2027-04-28T00:00:00.000Z"
  },
  {
    "id": "s221",
    "day_number": 221,
    "week_number": 32,
    "reading_from": "Proverbs 13",
    "reading_to": "Proverbs 15",
    "section": "Proverbs",
    "release_date": "2027-04-29T00:00:00.000Z"
  },
  {
    "id": "s222",
    "day_number": 222,
    "week_number": 32,
    "reading_from": "Proverbs 16",
    "reading_to": "Proverbs 18",
    "section": "Proverbs",
    "release_date": "2027-04-30T00:00:00.000Z"
  },
  {
    "id": "s223",
    "day_number": 223,
    "week_number": 32,
    "reading_from": "Proverbs 19",
    "reading_to": "Proverbs 21",
    "section": "Proverbs",
    "release_date": "2027-05-01T00:00:00.000Z"
  },
  {
    "id": "s224",
    "day_number": 224,
    "week_number": 32,
    "reading_from": "Proverbs 22",
    "reading_to": "Proverbs 24",
    "section": "Proverbs",
    "release_date": "2027-05-02T00:00:00.000Z"
  },
  {
    "id": "s225",
    "day_number": 225,
    "week_number": 33,
    "reading_from": "Proverbs 25",
    "reading_to": "Proverbs 27",
    "section": "Proverbs",
    "release_date": "2027-05-03T00:00:00.000Z"
  },
  {
    "id": "s226",
    "day_number": 226,
    "week_number": 33,
    "reading_from": "Proverbs 28",
    "reading_to": "Proverbs 30",
    "section": "Proverbs",
    "release_date": "2027-05-04T00:00:00.000Z"
  },
  {
    "id": "s227",
    "day_number": 227,
    "week_number": 33,
    "reading_from": "Proverbs 31",
    "reading_to": "Proverbs 31",
    "section": "Proverbs",
    "release_date": "2027-05-05T00:00:00.000Z"
  },
  {
    "id": "s228",
    "day_number": 228,
    "week_number": 33,
    "reading_from": "Ecclesiastes 1",
    "reading_to": "Ecclesiastes 3",
    "section": "Ecclesiastes",
    "release_date": "2027-05-06T00:00:00.000Z"
  },
  {
    "id": "s229",
    "day_number": 229,
    "week_number": 33,
    "reading_from": "Ecclesiastes 4",
    "reading_to": "Ecclesiastes 6",
    "section": "Ecclesiastes",
    "release_date": "2027-05-07T00:00:00.000Z"
  },
  {
    "id": "s230",
    "day_number": 230,
    "week_number": 33,
    "reading_from": "Ecclesiastes 7",
    "reading_to": "Ecclesiastes 9",
    "section": "Ecclesiastes",
    "release_date": "2027-05-08T00:00:00.000Z"
  },
  {
    "id": "s231",
    "day_number": 231,
    "week_number": 33,
    "reading_from": "Ecclesiastes 10",
    "reading_to": "Ecclesiastes 12",
    "section": "Ecclesiastes",
    "release_date": "2027-05-09T00:00:00.000Z"
  },
  {
    "id": "s232",
    "day_number": 232,
    "week_number": 34,
    "reading_from": "Song of Solomon 1",
    "reading_to": "Song of Solomon 3",
    "section": "Song of Solomon",
    "release_date": "2027-05-10T00:00:00.000Z"
  },
  {
    "id": "s233",
    "day_number": 233,
    "week_number": 34,
    "reading_from": "Song of Solomon 4",
    "reading_to": "Song of Solomon 6",
    "section": "Song of Solomon",
    "release_date": "2027-05-11T00:00:00.000Z"
  },
  {
    "id": "s234",
    "day_number": 234,
    "week_number": 34,
    "reading_from": "Song of Solomon 7",
    "reading_to": "Song of Solomon 8",
    "section": "Song of Solomon",
    "release_date": "2027-05-12T00:00:00.000Z"
  },
  {
    "id": "s235",
    "day_number": 235,
    "week_number": 34,
    "reading_from": "Isaiah 1",
    "reading_to": "Isaiah 3",
    "section": "Isaiah",
    "release_date": "2027-05-13T00:00:00.000Z"
  },
  {
    "id": "s236",
    "day_number": 236,
    "week_number": 34,
    "reading_from": "Isaiah 4",
    "reading_to": "Isaiah 6",
    "section": "Isaiah",
    "release_date": "2027-05-14T00:00:00.000Z"
  },
  {
    "id": "s237",
    "day_number": 237,
    "week_number": 34,
    "reading_from": "Isaiah 7",
    "reading_to": "Isaiah 9",
    "section": "Isaiah",
    "release_date": "2027-05-15T00:00:00.000Z"
  },
  {
    "id": "s238",
    "day_number": 238,
    "week_number": 34,
    "reading_from": "Isaiah 10",
    "reading_to": "Isaiah 12",
    "section": "Isaiah",
    "release_date": "2027-05-16T00:00:00.000Z"
  },
  {
    "id": "s239",
    "day_number": 239,
    "week_number": 35,
    "reading_from": "Isaiah 13",
    "reading_to": "Isaiah 15",
    "section": "Isaiah",
    "release_date": "2027-05-17T00:00:00.000Z"
  },
  {
    "id": "s240",
    "day_number": 240,
    "week_number": 35,
    "reading_from": "Isaiah 16",
    "reading_to": "Isaiah 18",
    "section": "Isaiah",
    "release_date": "2027-05-18T00:00:00.000Z"
  },
  {
    "id": "s241",
    "day_number": 241,
    "week_number": 35,
    "reading_from": "Isaiah 19",
    "reading_to": "Isaiah 21",
    "section": "Isaiah",
    "release_date": "2027-05-19T00:00:00.000Z"
  },
  {
    "id": "s242",
    "day_number": 242,
    "week_number": 35,
    "reading_from": "Isaiah 22",
    "reading_to": "Isaiah 24",
    "section": "Isaiah",
    "release_date": "2027-05-20T00:00:00.000Z"
  },
  {
    "id": "s243",
    "day_number": 243,
    "week_number": 35,
    "reading_from": "Isaiah 25",
    "reading_to": "Isaiah 27",
    "section": "Isaiah",
    "release_date": "2027-05-21T00:00:00.000Z"
  },
  {
    "id": "s244",
    "day_number": 244,
    "week_number": 35,
    "reading_from": "Isaiah 28",
    "reading_to": "Isaiah 30",
    "section": "Isaiah",
    "release_date": "2027-05-22T00:00:00.000Z"
  },
  {
    "id": "s245",
    "day_number": 245,
    "week_number": 35,
    "reading_from": "Isaiah 31",
    "reading_to": "Isaiah 33",
    "section": "Isaiah",
    "release_date": "2027-05-23T00:00:00.000Z"
  },
  {
    "id": "s246",
    "day_number": 246,
    "week_number": 36,
    "reading_from": "Isaiah 34",
    "reading_to": "Isaiah 36",
    "section": "Isaiah",
    "release_date": "2027-05-24T00:00:00.000Z"
  },
  {
    "id": "s247",
    "day_number": 247,
    "week_number": 36,
    "reading_from": "Isaiah 37",
    "reading_to": "Isaiah 39",
    "section": "Isaiah",
    "release_date": "2027-05-25T00:00:00.000Z"
  },
  {
    "id": "s248",
    "day_number": 248,
    "week_number": 36,
    "reading_from": "Isaiah 40",
    "reading_to": "Isaiah 42",
    "section": "Isaiah",
    "release_date": "2027-05-26T00:00:00.000Z"
  },
  {
    "id": "s249",
    "day_number": 249,
    "week_number": 36,
    "reading_from": "Isaiah 43",
    "reading_to": "Isaiah 45",
    "section": "Isaiah",
    "release_date": "2027-05-27T00:00:00.000Z"
  },
  {
    "id": "s250",
    "day_number": 250,
    "week_number": 36,
    "reading_from": "Isaiah 46",
    "reading_to": "Isaiah 48",
    "section": "Isaiah",
    "release_date": "2027-05-28T00:00:00.000Z"
  },
  {
    "id": "s251",
    "day_number": 251,
    "week_number": 36,
    "reading_from": "Isaiah 49",
    "reading_to": "Isaiah 51",
    "section": "Isaiah",
    "release_date": "2027-05-29T00:00:00.000Z"
  },
  {
    "id": "s252",
    "day_number": 252,
    "week_number": 36,
    "reading_from": "Isaiah 52",
    "reading_to": "Isaiah 54",
    "section": "Isaiah",
    "release_date": "2027-05-30T00:00:00.000Z"
  },
  {
    "id": "s253",
    "day_number": 253,
    "week_number": 37,
    "reading_from": "Isaiah 55",
    "reading_to": "Isaiah 57",
    "section": "Isaiah",
    "release_date": "2027-05-31T00:00:00.000Z"
  },
  {
    "id": "s254",
    "day_number": 254,
    "week_number": 37,
    "reading_from": "Isaiah 58",
    "reading_to": "Isaiah 60",
    "section": "Isaiah",
    "release_date": "2027-06-01T00:00:00.000Z"
  },
  {
    "id": "s255",
    "day_number": 255,
    "week_number": 37,
    "reading_from": "Isaiah 61",
    "reading_to": "Isaiah 63",
    "section": "Isaiah",
    "release_date": "2027-06-02T00:00:00.000Z"
  },
  {
    "id": "s256",
    "day_number": 256,
    "week_number": 37,
    "reading_from": "Isaiah 64",
    "reading_to": "Isaiah 66",
    "section": "Isaiah",
    "release_date": "2027-06-03T00:00:00.000Z"
  },
  {
    "id": "s257",
    "day_number": 257,
    "week_number": 37,
    "reading_from": "Jeremiah 1",
    "reading_to": "Jeremiah 3",
    "section": "Jeremiah",
    "release_date": "2027-06-04T00:00:00.000Z"
  },
  {
    "id": "s258",
    "day_number": 258,
    "week_number": 37,
    "reading_from": "Jeremiah 4",
    "reading_to": "Jeremiah 6",
    "section": "Jeremiah",
    "release_date": "2027-06-05T00:00:00.000Z"
  },
  {
    "id": "s259",
    "day_number": 259,
    "week_number": 37,
    "reading_from": "Jeremiah 7",
    "reading_to": "Jeremiah 9",
    "section": "Jeremiah",
    "release_date": "2027-06-06T00:00:00.000Z"
  },
  {
    "id": "s260",
    "day_number": 260,
    "week_number": 38,
    "reading_from": "Jeremiah 10",
    "reading_to": "Jeremiah 12",
    "section": "Jeremiah",
    "release_date": "2027-06-07T00:00:00.000Z"
  },
  {
    "id": "s261",
    "day_number": 261,
    "week_number": 38,
    "reading_from": "Jeremiah 13",
    "reading_to": "Jeremiah 15",
    "section": "Jeremiah",
    "release_date": "2027-06-08T00:00:00.000Z"
  },
  {
    "id": "s262",
    "day_number": 262,
    "week_number": 38,
    "reading_from": "Jeremiah 16",
    "reading_to": "Jeremiah 18",
    "section": "Jeremiah",
    "release_date": "2027-06-09T00:00:00.000Z"
  },
  {
    "id": "s263",
    "day_number": 263,
    "week_number": 38,
    "reading_from": "Jeremiah 19",
    "reading_to": "Jeremiah 21",
    "section": "Jeremiah",
    "release_date": "2027-06-10T00:00:00.000Z"
  },
  {
    "id": "s264",
    "day_number": 264,
    "week_number": 38,
    "reading_from": "Jeremiah 22",
    "reading_to": "Jeremiah 24",
    "section": "Jeremiah",
    "release_date": "2027-06-11T00:00:00.000Z"
  },
  {
    "id": "s265",
    "day_number": 265,
    "week_number": 38,
    "reading_from": "Jeremiah 25",
    "reading_to": "Jeremiah 27",
    "section": "Jeremiah",
    "release_date": "2027-06-12T00:00:00.000Z"
  },
  {
    "id": "s266",
    "day_number": 266,
    "week_number": 38,
    "reading_from": "Jeremiah 28",
    "reading_to": "Jeremiah 30",
    "section": "Jeremiah",
    "release_date": "2027-06-13T00:00:00.000Z"
  },
  {
    "id": "s267",
    "day_number": 267,
    "week_number": 39,
    "reading_from": "Jeremiah 31",
    "reading_to": "Jeremiah 33",
    "section": "Jeremiah",
    "release_date": "2027-06-14T00:00:00.000Z"
  },
  {
    "id": "s268",
    "day_number": 268,
    "week_number": 39,
    "reading_from": "Jeremiah 34",
    "reading_to": "Jeremiah 36",
    "section": "Jeremiah",
    "release_date": "2027-06-15T00:00:00.000Z"
  },
  {
    "id": "s269",
    "day_number": 269,
    "week_number": 39,
    "reading_from": "Jeremiah 37",
    "reading_to": "Jeremiah 39",
    "section": "Jeremiah",
    "release_date": "2027-06-16T00:00:00.000Z"
  },
  {
    "id": "s270",
    "day_number": 270,
    "week_number": 39,
    "reading_from": "Jeremiah 40",
    "reading_to": "Jeremiah 42",
    "section": "Jeremiah",
    "release_date": "2027-06-17T00:00:00.000Z"
  },
  {
    "id": "s271",
    "day_number": 271,
    "week_number": 39,
    "reading_from": "Jeremiah 43",
    "reading_to": "Jeremiah 45",
    "section": "Jeremiah",
    "release_date": "2027-06-18T00:00:00.000Z"
  },
  {
    "id": "s272",
    "day_number": 272,
    "week_number": 39,
    "reading_from": "Jeremiah 46",
    "reading_to": "Jeremiah 48",
    "section": "Jeremiah",
    "release_date": "2027-06-19T00:00:00.000Z"
  },
  {
    "id": "s273",
    "day_number": 273,
    "week_number": 39,
    "reading_from": "Jeremiah 49",
    "reading_to": "Jeremiah 51",
    "section": "Jeremiah",
    "release_date": "2027-06-20T00:00:00.000Z"
  },
  {
    "id": "s274",
    "day_number": 274,
    "week_number": 40,
    "reading_from": "Jeremiah 52",
    "reading_to": "Jeremiah 52",
    "section": "Jeremiah",
    "release_date": "2027-06-21T00:00:00.000Z"
  },
  {
    "id": "s275",
    "day_number": 275,
    "week_number": 40,
    "reading_from": "Lamentations 1",
    "reading_to": "Lamentations 3",
    "section": "Lamentations",
    "release_date": "2027-06-22T00:00:00.000Z"
  },
  {
    "id": "s276",
    "day_number": 276,
    "week_number": 40,
    "reading_from": "Lamentations 4",
    "reading_to": "Lamentations 5",
    "section": "Lamentations",
    "release_date": "2027-06-23T00:00:00.000Z"
  },
  {
    "id": "s277",
    "day_number": 277,
    "week_number": 40,
    "reading_from": "Ezekiel 1",
    "reading_to": "Ezekiel 3",
    "section": "Ezekiel",
    "release_date": "2027-06-24T00:00:00.000Z"
  },
  {
    "id": "s278",
    "day_number": 278,
    "week_number": 40,
    "reading_from": "Ezekiel 4",
    "reading_to": "Ezekiel 6",
    "section": "Ezekiel",
    "release_date": "2027-06-25T00:00:00.000Z"
  },
  {
    "id": "s279",
    "day_number": 279,
    "week_number": 40,
    "reading_from": "Ezekiel 7",
    "reading_to": "Ezekiel 9",
    "section": "Ezekiel",
    "release_date": "2027-06-26T00:00:00.000Z"
  },
  {
    "id": "s280",
    "day_number": 280,
    "week_number": 40,
    "reading_from": "Ezekiel 10",
    "reading_to": "Ezekiel 12",
    "section": "Ezekiel",
    "release_date": "2027-06-27T00:00:00.000Z"
  },
  {
    "id": "s281",
    "day_number": 281,
    "week_number": 41,
    "reading_from": "Ezekiel 13",
    "reading_to": "Ezekiel 15",
    "section": "Ezekiel",
    "release_date": "2027-06-28T00:00:00.000Z"
  },
  {
    "id": "s282",
    "day_number": 282,
    "week_number": 41,
    "reading_from": "Ezekiel 16",
    "reading_to": "Ezekiel 18",
    "section": "Ezekiel",
    "release_date": "2027-06-29T00:00:00.000Z"
  },
  {
    "id": "s283",
    "day_number": 283,
    "week_number": 41,
    "reading_from": "Ezekiel 19",
    "reading_to": "Ezekiel 21",
    "section": "Ezekiel",
    "release_date": "2027-06-30T00:00:00.000Z"
  },
  {
    "id": "s284",
    "day_number": 284,
    "week_number": 41,
    "reading_from": "Ezekiel 22",
    "reading_to": "Ezekiel 24",
    "section": "Ezekiel",
    "release_date": "2027-07-01T00:00:00.000Z"
  },
  {
    "id": "s285",
    "day_number": 285,
    "week_number": 41,
    "reading_from": "Ezekiel 25",
    "reading_to": "Ezekiel 27",
    "section": "Ezekiel",
    "release_date": "2027-07-02T00:00:00.000Z"
  },
  {
    "id": "s286",
    "day_number": 286,
    "week_number": 41,
    "reading_from": "Ezekiel 28",
    "reading_to": "Ezekiel 30",
    "section": "Ezekiel",
    "release_date": "2027-07-03T00:00:00.000Z"
  },
  {
    "id": "s287",
    "day_number": 287,
    "week_number": 41,
    "reading_from": "Ezekiel 31",
    "reading_to": "Ezekiel 33",
    "section": "Ezekiel",
    "release_date": "2027-07-04T00:00:00.000Z"
  },
  {
    "id": "s288",
    "day_number": 288,
    "week_number": 42,
    "reading_from": "Ezekiel 34",
    "reading_to": "Ezekiel 36",
    "section": "Ezekiel",
    "release_date": "2027-07-05T00:00:00.000Z"
  },
  {
    "id": "s289",
    "day_number": 289,
    "week_number": 42,
    "reading_from": "Ezekiel 37",
    "reading_to": "Ezekiel 39",
    "section": "Ezekiel",
    "release_date": "2027-07-06T00:00:00.000Z"
  },
  {
    "id": "s290",
    "day_number": 290,
    "week_number": 42,
    "reading_from": "Ezekiel 40",
    "reading_to": "Ezekiel 42",
    "section": "Ezekiel",
    "release_date": "2027-07-07T00:00:00.000Z"
  },
  {
    "id": "s291",
    "day_number": 291,
    "week_number": 42,
    "reading_from": "Ezekiel 43",
    "reading_to": "Ezekiel 45",
    "section": "Ezekiel",
    "release_date": "2027-07-08T00:00:00.000Z"
  },
  {
    "id": "s292",
    "day_number": 292,
    "week_number": 42,
    "reading_from": "Ezekiel 46",
    "reading_to": "Ezekiel 48",
    "section": "Ezekiel",
    "release_date": "2027-07-09T00:00:00.000Z"
  },
  {
    "id": "s293",
    "day_number": 293,
    "week_number": 42,
    "reading_from": "Daniel 1",
    "reading_to": "Daniel 3",
    "section": "Daniel",
    "release_date": "2027-07-10T00:00:00.000Z"
  },
  {
    "id": "s294",
    "day_number": 294,
    "week_number": 42,
    "reading_from": "Daniel 4",
    "reading_to": "Daniel 6",
    "section": "Daniel",
    "release_date": "2027-07-11T00:00:00.000Z"
  },
  {
    "id": "s295",
    "day_number": 295,
    "week_number": 43,
    "reading_from": "Daniel 7",
    "reading_to": "Daniel 9",
    "section": "Daniel",
    "release_date": "2027-07-12T00:00:00.000Z"
  },
  {
    "id": "s296",
    "day_number": 296,
    "week_number": 43,
    "reading_from": "Daniel 10",
    "reading_to": "Daniel 12",
    "section": "Daniel",
    "release_date": "2027-07-13T00:00:00.000Z"
  },
  {
    "id": "s297",
    "day_number": 297,
    "week_number": 43,
    "reading_from": "Hosea 1",
    "reading_to": "Hosea 3",
    "section": "Hosea",
    "release_date": "2027-07-14T00:00:00.000Z"
  },
  {
    "id": "s298",
    "day_number": 298,
    "week_number": 43,
    "reading_from": "Hosea 4",
    "reading_to": "Hosea 6",
    "section": "Hosea",
    "release_date": "2027-07-15T00:00:00.000Z"
  },
  {
    "id": "s299",
    "day_number": 299,
    "week_number": 43,
    "reading_from": "Hosea 7",
    "reading_to": "Hosea 9",
    "section": "Hosea",
    "release_date": "2027-07-16T00:00:00.000Z"
  },
  {
    "id": "s300",
    "day_number": 300,
    "week_number": 43,
    "reading_from": "Hosea 10",
    "reading_to": "Hosea 12",
    "section": "Hosea",
    "release_date": "2027-07-17T00:00:00.000Z"
  },
  {
    "id": "s301",
    "day_number": 301,
    "week_number": 43,
    "reading_from": "Hosea 13",
    "reading_to": "Hosea 14",
    "section": "Hosea",
    "release_date": "2027-07-18T00:00:00.000Z"
  },
  {
    "id": "s302",
    "day_number": 302,
    "week_number": 44,
    "reading_from": "Joel 1",
    "reading_to": "Joel 3",
    "section": "Joel",
    "release_date": "2027-07-19T00:00:00.000Z"
  },
  {
    "id": "s303",
    "day_number": 303,
    "week_number": 44,
    "reading_from": "Amos 1",
    "reading_to": "Amos 3",
    "section": "Amos",
    "release_date": "2027-07-20T00:00:00.000Z"
  },
  {
    "id": "s304",
    "day_number": 304,
    "week_number": 44,
    "reading_from": "Amos 4",
    "reading_to": "Amos 6",
    "section": "Amos",
    "release_date": "2027-07-21T00:00:00.000Z"
  },
  {
    "id": "s305",
    "day_number": 305,
    "week_number": 44,
    "reading_from": "Amos 7",
    "reading_to": "Amos 9",
    "section": "Amos",
    "release_date": "2027-07-22T00:00:00.000Z"
  },
  {
    "id": "s306",
    "day_number": 306,
    "week_number": 44,
    "reading_from": "Obadiah 1",
    "reading_to": "Obadiah 1",
    "section": "Obadiah",
    "release_date": "2027-07-23T00:00:00.000Z"
  },
  {
    "id": "s307",
    "day_number": 307,
    "week_number": 44,
    "reading_from": "Jonah 1",
    "reading_to": "Jonah 3",
    "section": "Jonah",
    "release_date": "2027-07-24T00:00:00.000Z"
  },
  {
    "id": "s308",
    "day_number": 308,
    "week_number": 44,
    "reading_from": "Jonah 4",
    "reading_to": "Jonah 4",
    "section": "Jonah",
    "release_date": "2027-07-25T00:00:00.000Z"
  },
  {
    "id": "s309",
    "day_number": 309,
    "week_number": 45,
    "reading_from": "Micah 1",
    "reading_to": "Micah 3",
    "section": "Micah",
    "release_date": "2027-07-26T00:00:00.000Z"
  },
  {
    "id": "s310",
    "day_number": 310,
    "week_number": 45,
    "reading_from": "Micah 4",
    "reading_to": "Micah 6",
    "section": "Micah",
    "release_date": "2027-07-27T00:00:00.000Z"
  },
  {
    "id": "s311",
    "day_number": 311,
    "week_number": 45,
    "reading_from": "Micah 7",
    "reading_to": "Micah 7",
    "section": "Micah",
    "release_date": "2027-07-28T00:00:00.000Z"
  },
  {
    "id": "s312",
    "day_number": 312,
    "week_number": 45,
    "reading_from": "Nahum 1",
    "reading_to": "Nahum 3",
    "section": "Nahum",
    "release_date": "2027-07-29T00:00:00.000Z"
  },
  {
    "id": "s313",
    "day_number": 313,
    "week_number": 45,
    "reading_from": "Habakkuk 1",
    "reading_to": "Habakkuk 3",
    "section": "Habakkuk",
    "release_date": "2027-07-30T00:00:00.000Z"
  },
  {
    "id": "s314",
    "day_number": 314,
    "week_number": 45,
    "reading_from": "Zephaniah 1",
    "reading_to": "Zephaniah 3",
    "section": "Zephaniah",
    "release_date": "2027-07-31T00:00:00.000Z"
  },
  {
    "id": "s315",
    "day_number": 315,
    "week_number": 45,
    "reading_from": "Haggai 1",
    "reading_to": "Haggai 2",
    "section": "Haggai",
    "release_date": "2027-08-01T00:00:00.000Z"
  },
  {
    "id": "s316",
    "day_number": 316,
    "week_number": 46,
    "reading_from": "Zechariah 1",
    "reading_to": "Zechariah 3",
    "section": "Zechariah",
    "release_date": "2027-08-02T00:00:00.000Z"
  },
  {
    "id": "s317",
    "day_number": 317,
    "week_number": 46,
    "reading_from": "Zechariah 4",
    "reading_to": "Zechariah 6",
    "section": "Zechariah",
    "release_date": "2027-08-03T00:00:00.000Z"
  },
  {
    "id": "s318",
    "day_number": 318,
    "week_number": 46,
    "reading_from": "Zechariah 7",
    "reading_to": "Zechariah 9",
    "section": "Zechariah",
    "release_date": "2027-08-04T00:00:00.000Z"
  },
  {
    "id": "s319",
    "day_number": 319,
    "week_number": 46,
    "reading_from": "Zechariah 10",
    "reading_to": "Zechariah 12",
    "section": "Zechariah",
    "release_date": "2027-08-05T00:00:00.000Z"
  },
  {
    "id": "s320",
    "day_number": 320,
    "week_number": 46,
    "reading_from": "Zechariah 13",
    "reading_to": "Zechariah 14",
    "section": "Zechariah",
    "release_date": "2027-08-06T00:00:00.000Z"
  },
  {
    "id": "s321",
    "day_number": 321,
    "week_number": 46,
    "reading_from": "Malachi 1",
    "reading_to": "Malachi 3",
    "section": "Malachi",
    "release_date": "2027-08-07T00:00:00.000Z"
  },
  {
    "id": "s322",
    "day_number": 322,
    "week_number": 46,
    "reading_from": "Malachi 4",
    "reading_to": "Malachi 4",
    "section": "Malachi",
    "release_date": "2027-08-08T00:00:00.000Z"
  },
  {
    "id": "s323",
    "day_number": 323,
    "week_number": 47,
    "reading_from": "Matthew 1",
    "reading_to": "Matthew 3",
    "section": "Matthew",
    "release_date": "2027-08-09T00:00:00.000Z"
  },
  {
    "id": "s324",
    "day_number": 324,
    "week_number": 47,
    "reading_from": "Matthew 4",
    "reading_to": "Matthew 6",
    "section": "Matthew",
    "release_date": "2027-08-10T00:00:00.000Z"
  },
  {
    "id": "s325",
    "day_number": 325,
    "week_number": 47,
    "reading_from": "Matthew 7",
    "reading_to": "Matthew 9",
    "section": "Matthew",
    "release_date": "2027-08-11T00:00:00.000Z"
  },
  {
    "id": "s326",
    "day_number": 326,
    "week_number": 47,
    "reading_from": "Matthew 10",
    "reading_to": "Matthew 12",
    "section": "Matthew",
    "release_date": "2027-08-12T00:00:00.000Z"
  },
  {
    "id": "s327",
    "day_number": 327,
    "week_number": 47,
    "reading_from": "Matthew 13",
    "reading_to": "Matthew 15",
    "section": "Matthew",
    "release_date": "2027-08-13T00:00:00.000Z"
  },
  {
    "id": "s328",
    "day_number": 328,
    "week_number": 47,
    "reading_from": "Matthew 16",
    "reading_to": "Matthew 18",
    "section": "Matthew",
    "release_date": "2027-08-14T00:00:00.000Z"
  },
  {
    "id": "s329",
    "day_number": 329,
    "week_number": 47,
    "reading_from": "Matthew 19",
    "reading_to": "Matthew 21",
    "section": "Matthew",
    "release_date": "2027-08-15T00:00:00.000Z"
  },
  {
    "id": "s330",
    "day_number": 330,
    "week_number": 48,
    "reading_from": "Matthew 22",
    "reading_to": "Matthew 24",
    "section": "Matthew",
    "release_date": "2027-08-16T00:00:00.000Z"
  },
  {
    "id": "s331",
    "day_number": 331,
    "week_number": 48,
    "reading_from": "Matthew 25",
    "reading_to": "Matthew 27",
    "section": "Matthew",
    "release_date": "2027-08-17T00:00:00.000Z"
  },
  {
    "id": "s332",
    "day_number": 332,
    "week_number": 48,
    "reading_from": "Matthew 28",
    "reading_to": "Matthew 28",
    "section": "Matthew",
    "release_date": "2027-08-18T00:00:00.000Z"
  },
  {
    "id": "s333",
    "day_number": 333,
    "week_number": 48,
    "reading_from": "Mark 1",
    "reading_to": "Mark 3",
    "section": "Mark",
    "release_date": "2027-08-19T00:00:00.000Z"
  },
  {
    "id": "s334",
    "day_number": 334,
    "week_number": 48,
    "reading_from": "Mark 4",
    "reading_to": "Mark 6",
    "section": "Mark",
    "release_date": "2027-08-20T00:00:00.000Z"
  },
  {
    "id": "s335",
    "day_number": 335,
    "week_number": 48,
    "reading_from": "Mark 7",
    "reading_to": "Mark 9",
    "section": "Mark",
    "release_date": "2027-08-21T00:00:00.000Z"
  },
  {
    "id": "s336",
    "day_number": 336,
    "week_number": 48,
    "reading_from": "Mark 10",
    "reading_to": "Mark 12",
    "section": "Mark",
    "release_date": "2027-08-22T00:00:00.000Z"
  },
  {
    "id": "s337",
    "day_number": 337,
    "week_number": 49,
    "reading_from": "Mark 13",
    "reading_to": "Mark 15",
    "section": "Mark",
    "release_date": "2027-08-23T00:00:00.000Z"
  },
  {
    "id": "s338",
    "day_number": 338,
    "week_number": 49,
    "reading_from": "Mark 16",
    "reading_to": "Mark 16",
    "section": "Mark",
    "release_date": "2027-08-24T00:00:00.000Z"
  },
  {
    "id": "s339",
    "day_number": 339,
    "week_number": 49,
    "reading_from": "Luke 1",
    "reading_to": "Luke 3",
    "section": "Luke",
    "release_date": "2027-08-25T00:00:00.000Z"
  },
  {
    "id": "s340",
    "day_number": 340,
    "week_number": 49,
    "reading_from": "Luke 4",
    "reading_to": "Luke 6",
    "section": "Luke",
    "release_date": "2027-08-26T00:00:00.000Z"
  },
  {
    "id": "s341",
    "day_number": 341,
    "week_number": 49,
    "reading_from": "Luke 7",
    "reading_to": "Luke 9",
    "section": "Luke",
    "release_date": "2027-08-27T00:00:00.000Z"
  },
  {
    "id": "s342",
    "day_number": 342,
    "week_number": 49,
    "reading_from": "Luke 10",
    "reading_to": "Luke 12",
    "section": "Luke",
    "release_date": "2027-08-28T00:00:00.000Z"
  },
  {
    "id": "s343",
    "day_number": 343,
    "week_number": 49,
    "reading_from": "Luke 13",
    "reading_to": "Luke 15",
    "section": "Luke",
    "release_date": "2027-08-29T00:00:00.000Z"
  },
  {
    "id": "s344",
    "day_number": 344,
    "week_number": 50,
    "reading_from": "Luke 16",
    "reading_to": "Luke 18",
    "section": "Luke",
    "release_date": "2027-08-30T00:00:00.000Z"
  },
  {
    "id": "s345",
    "day_number": 345,
    "week_number": 50,
    "reading_from": "Luke 19",
    "reading_to": "Luke 21",
    "section": "Luke",
    "release_date": "2027-08-31T00:00:00.000Z"
  },
  {
    "id": "s346",
    "day_number": 346,
    "week_number": 50,
    "reading_from": "Luke 22",
    "reading_to": "Luke 24",
    "section": "Luke",
    "release_date": "2027-09-01T00:00:00.000Z"
  },
  {
    "id": "s347",
    "day_number": 347,
    "week_number": 50,
    "reading_from": "John 1",
    "reading_to": "John 3",
    "section": "John",
    "release_date": "2027-09-02T00:00:00.000Z"
  },
  {
    "id": "s348",
    "day_number": 348,
    "week_number": 50,
    "reading_from": "John 4",
    "reading_to": "John 6",
    "section": "John",
    "release_date": "2027-09-03T00:00:00.000Z"
  },
  {
    "id": "s349",
    "day_number": 349,
    "week_number": 50,
    "reading_from": "John 7",
    "reading_to": "John 9",
    "section": "John",
    "release_date": "2027-09-04T00:00:00.000Z"
  },
  {
    "id": "s350",
    "day_number": 350,
    "week_number": 50,
    "reading_from": "John 10",
    "reading_to": "John 12",
    "section": "John",
    "release_date": "2027-09-05T00:00:00.000Z"
  },
  {
    "id": "s351",
    "day_number": 351,
    "week_number": 51,
    "reading_from": "John 13",
    "reading_to": "John 15",
    "section": "John",
    "release_date": "2027-09-06T00:00:00.000Z"
  },
  {
    "id": "s352",
    "day_number": 352,
    "week_number": 51,
    "reading_from": "John 16",
    "reading_to": "John 18",
    "section": "John",
    "release_date": "2027-09-07T00:00:00.000Z"
  },
  {
    "id": "s353",
    "day_number": 353,
    "week_number": 51,
    "reading_from": "John 19",
    "reading_to": "John 21",
    "section": "John",
    "release_date": "2027-09-08T00:00:00.000Z"
  },
  {
    "id": "s354",
    "day_number": 354,
    "week_number": 51,
    "reading_from": "Acts 1",
    "reading_to": "Acts 3",
    "section": "Acts",
    "release_date": "2027-09-09T00:00:00.000Z"
  },
  {
    "id": "s355",
    "day_number": 355,
    "week_number": 51,
    "reading_from": "Acts 4",
    "reading_to": "Acts 6",
    "section": "Acts",
    "release_date": "2027-09-10T00:00:00.000Z"
  },
  {
    "id": "s356",
    "day_number": 356,
    "week_number": 51,
    "reading_from": "Acts 7",
    "reading_to": "Acts 9",
    "section": "Acts",
    "release_date": "2027-09-11T00:00:00.000Z"
  },
  {
    "id": "s357",
    "day_number": 357,
    "week_number": 51,
    "reading_from": "Acts 10",
    "reading_to": "Acts 12",
    "section": "Acts",
    "release_date": "2027-09-12T00:00:00.000Z"
  },
  {
    "id": "s358",
    "day_number": 358,
    "week_number": 52,
    "reading_from": "Acts 13",
    "reading_to": "Acts 15",
    "section": "Acts",
    "release_date": "2027-09-13T00:00:00.000Z"
  },
  {
    "id": "s359",
    "day_number": 359,
    "week_number": 52,
    "reading_from": "Acts 16",
    "reading_to": "Acts 18",
    "section": "Acts",
    "release_date": "2027-09-14T00:00:00.000Z"
  },
  {
    "id": "s360",
    "day_number": 360,
    "week_number": 52,
    "reading_from": "Acts 19",
    "reading_to": "Acts 21",
    "section": "Acts",
    "release_date": "2027-09-15T00:00:00.000Z"
  },
  {
    "id": "s361",
    "day_number": 361,
    "week_number": 52,
    "reading_from": "Acts 22",
    "reading_to": "Acts 24",
    "section": "Acts",
    "release_date": "2027-09-16T00:00:00.000Z"
  },
  {
    "id": "s362",
    "day_number": 362,
    "week_number": 52,
    "reading_from": "Acts 25",
    "reading_to": "Acts 27",
    "section": "Acts",
    "release_date": "2027-09-17T00:00:00.000Z"
  },
  {
    "id": "s363",
    "day_number": 363,
    "week_number": 52,
    "reading_from": "Acts 28",
    "reading_to": "Acts 28",
    "section": "Acts",
    "release_date": "2027-09-18T00:00:00.000Z"
  },
  {
    "id": "s364",
    "day_number": 364,
    "week_number": 52,
    "reading_from": "Romans 1",
    "reading_to": "Romans 3",
    "section": "Romans",
    "release_date": "2027-09-19T00:00:00.000Z"
  },
  {
    "id": "s365",
    "day_number": 365,
    "week_number": 53,
    "reading_from": "Romans 4",
    "reading_to": "Romans 6",
    "section": "Romans",
    "release_date": "2027-09-20T00:00:00.000Z"
  },
  {
    "id": "s366",
    "day_number": 366,
    "week_number": 53,
    "reading_from": "Romans 7",
    "reading_to": "Romans 9",
    "section": "Romans",
    "release_date": "2027-09-21T00:00:00.000Z"
  },
  {
    "id": "s367",
    "day_number": 367,
    "week_number": 53,
    "reading_from": "Romans 10",
    "reading_to": "Romans 12",
    "section": "Romans",
    "release_date": "2027-09-22T00:00:00.000Z"
  },
  {
    "id": "s368",
    "day_number": 368,
    "week_number": 53,
    "reading_from": "Romans 13",
    "reading_to": "Romans 15",
    "section": "Romans",
    "release_date": "2027-09-23T00:00:00.000Z"
  },
  {
    "id": "s369",
    "day_number": 369,
    "week_number": 53,
    "reading_from": "Romans 16",
    "reading_to": "Romans 16",
    "section": "Romans",
    "release_date": "2027-09-24T00:00:00.000Z"
  },
  {
    "id": "s370",
    "day_number": 370,
    "week_number": 53,
    "reading_from": "1 Corinthians 1",
    "reading_to": "1 Corinthians 3",
    "section": "1 Corinthians",
    "release_date": "2027-09-25T00:00:00.000Z"
  },
  {
    "id": "s371",
    "day_number": 371,
    "week_number": 53,
    "reading_from": "1 Corinthians 4",
    "reading_to": "1 Corinthians 6",
    "section": "1 Corinthians",
    "release_date": "2027-09-26T00:00:00.000Z"
  },
  {
    "id": "s372",
    "day_number": 372,
    "week_number": 54,
    "reading_from": "1 Corinthians 7",
    "reading_to": "1 Corinthians 9",
    "section": "1 Corinthians",
    "release_date": "2027-09-27T00:00:00.000Z"
  },
  {
    "id": "s373",
    "day_number": 373,
    "week_number": 54,
    "reading_from": "1 Corinthians 10",
    "reading_to": "1 Corinthians 12",
    "section": "1 Corinthians",
    "release_date": "2027-09-28T00:00:00.000Z"
  },
  {
    "id": "s374",
    "day_number": 374,
    "week_number": 54,
    "reading_from": "1 Corinthians 13",
    "reading_to": "1 Corinthians 15",
    "section": "1 Corinthians",
    "release_date": "2027-09-29T00:00:00.000Z"
  },
  {
    "id": "s375",
    "day_number": 375,
    "week_number": 54,
    "reading_from": "1 Corinthians 16",
    "reading_to": "1 Corinthians 16",
    "section": "1 Corinthians",
    "release_date": "2027-09-30T00:00:00.000Z"
  },
  {
    "id": "s376",
    "day_number": 376,
    "week_number": 54,
    "reading_from": "2 Corinthians 1",
    "reading_to": "2 Corinthians 3",
    "section": "2 Corinthians",
    "release_date": "2027-10-01T00:00:00.000Z"
  },
  {
    "id": "s377",
    "day_number": 377,
    "week_number": 54,
    "reading_from": "2 Corinthians 4",
    "reading_to": "2 Corinthians 6",
    "section": "2 Corinthians",
    "release_date": "2027-10-02T00:00:00.000Z"
  },
  {
    "id": "s378",
    "day_number": 378,
    "week_number": 54,
    "reading_from": "2 Corinthians 7",
    "reading_to": "2 Corinthians 9",
    "section": "2 Corinthians",
    "release_date": "2027-10-03T00:00:00.000Z"
  },
  {
    "id": "s379",
    "day_number": 379,
    "week_number": 55,
    "reading_from": "2 Corinthians 10",
    "reading_to": "2 Corinthians 12",
    "section": "2 Corinthians",
    "release_date": "2027-10-04T00:00:00.000Z"
  },
  {
    "id": "s380",
    "day_number": 380,
    "week_number": 55,
    "reading_from": "2 Corinthians 13",
    "reading_to": "2 Corinthians 13",
    "section": "2 Corinthians",
    "release_date": "2027-10-05T00:00:00.000Z"
  },
  {
    "id": "s381",
    "day_number": 381,
    "week_number": 55,
    "reading_from": "Galatians 1",
    "reading_to": "Galatians 3",
    "section": "Galatians",
    "release_date": "2027-10-06T00:00:00.000Z"
  },
  {
    "id": "s382",
    "day_number": 382,
    "week_number": 55,
    "reading_from": "Galatians 4",
    "reading_to": "Galatians 6",
    "section": "Galatians",
    "release_date": "2027-10-07T00:00:00.000Z"
  },
  {
    "id": "s383",
    "day_number": 383,
    "week_number": 55,
    "reading_from": "Ephesians 1",
    "reading_to": "Ephesians 3",
    "section": "Ephesians",
    "release_date": "2027-10-08T00:00:00.000Z"
  },
  {
    "id": "s384",
    "day_number": 384,
    "week_number": 55,
    "reading_from": "Ephesians 4",
    "reading_to": "Ephesians 6",
    "section": "Ephesians",
    "release_date": "2027-10-09T00:00:00.000Z"
  },
  {
    "id": "s385",
    "day_number": 385,
    "week_number": 55,
    "reading_from": "Philippians 1",
    "reading_to": "Philippians 3",
    "section": "Philippians",
    "release_date": "2027-10-10T00:00:00.000Z"
  },
  {
    "id": "s386",
    "day_number": 386,
    "week_number": 56,
    "reading_from": "Philippians 4",
    "reading_to": "Philippians 4",
    "section": "Philippians",
    "release_date": "2027-10-11T00:00:00.000Z"
  },
  {
    "id": "s387",
    "day_number": 387,
    "week_number": 56,
    "reading_from": "Colossians 1",
    "reading_to": "Colossians 3",
    "section": "Colossians",
    "release_date": "2027-10-12T00:00:00.000Z"
  },
  {
    "id": "s388",
    "day_number": 388,
    "week_number": 56,
    "reading_from": "Colossians 4",
    "reading_to": "Colossians 4",
    "section": "Colossians",
    "release_date": "2027-10-13T00:00:00.000Z"
  },
  {
    "id": "s389",
    "day_number": 389,
    "week_number": 56,
    "reading_from": "1 Thessalonians 1",
    "reading_to": "1 Thessalonians 3",
    "section": "1 Thessalonians",
    "release_date": "2027-10-14T00:00:00.000Z"
  },
  {
    "id": "s390",
    "day_number": 390,
    "week_number": 56,
    "reading_from": "1 Thessalonians 4",
    "reading_to": "1 Thessalonians 5",
    "section": "1 Thessalonians",
    "release_date": "2027-10-15T00:00:00.000Z"
  },
  {
    "id": "s391",
    "day_number": 391,
    "week_number": 56,
    "reading_from": "2 Thessalonians 1",
    "reading_to": "2 Thessalonians 3",
    "section": "2 Thessalonians",
    "release_date": "2027-10-16T00:00:00.000Z"
  },
  {
    "id": "s392",
    "day_number": 392,
    "week_number": 56,
    "reading_from": "1 Timothy 1",
    "reading_to": "1 Timothy 3",
    "section": "1 Timothy",
    "release_date": "2027-10-17T00:00:00.000Z"
  },
  {
    "id": "s393",
    "day_number": 393,
    "week_number": 57,
    "reading_from": "1 Timothy 4",
    "reading_to": "1 Timothy 6",
    "section": "1 Timothy",
    "release_date": "2027-10-18T00:00:00.000Z"
  },
  {
    "id": "s394",
    "day_number": 394,
    "week_number": 57,
    "reading_from": "2 Timothy 1",
    "reading_to": "2 Timothy 3",
    "section": "2 Timothy",
    "release_date": "2027-10-19T00:00:00.000Z"
  },
  {
    "id": "s395",
    "day_number": 395,
    "week_number": 57,
    "reading_from": "2 Timothy 4",
    "reading_to": "2 Timothy 4",
    "section": "2 Timothy",
    "release_date": "2027-10-20T00:00:00.000Z"
  },
  {
    "id": "s396",
    "day_number": 396,
    "week_number": 57,
    "reading_from": "Titus 1",
    "reading_to": "Titus 3",
    "section": "Titus",
    "release_date": "2027-10-21T00:00:00.000Z"
  },
  {
    "id": "s397",
    "day_number": 397,
    "week_number": 57,
    "reading_from": "Philemon 1",
    "reading_to": "Philemon 1",
    "section": "Philemon",
    "release_date": "2027-10-22T00:00:00.000Z"
  },
  {
    "id": "s398",
    "day_number": 398,
    "week_number": 57,
    "reading_from": "Hebrews 1",
    "reading_to": "Hebrews 3",
    "section": "Hebrews",
    "release_date": "2027-10-23T00:00:00.000Z"
  },
  {
    "id": "s399",
    "day_number": 399,
    "week_number": 57,
    "reading_from": "Hebrews 4",
    "reading_to": "Hebrews 6",
    "section": "Hebrews",
    "release_date": "2027-10-24T00:00:00.000Z"
  },
  {
    "id": "s400",
    "day_number": 400,
    "week_number": 58,
    "reading_from": "Hebrews 7",
    "reading_to": "Hebrews 9",
    "section": "Hebrews",
    "release_date": "2027-10-25T00:00:00.000Z"
  },
  {
    "id": "s401",
    "day_number": 401,
    "week_number": 58,
    "reading_from": "Hebrews 10",
    "reading_to": "Hebrews 12",
    "section": "Hebrews",
    "release_date": "2027-10-26T00:00:00.000Z"
  },
  {
    "id": "s402",
    "day_number": 402,
    "week_number": 58,
    "reading_from": "Hebrews 13",
    "reading_to": "Hebrews 13",
    "section": "Hebrews",
    "release_date": "2027-10-27T00:00:00.000Z"
  },
  {
    "id": "s403",
    "day_number": 403,
    "week_number": 58,
    "reading_from": "James 1",
    "reading_to": "James 3",
    "section": "James",
    "release_date": "2027-10-28T00:00:00.000Z"
  },
  {
    "id": "s404",
    "day_number": 404,
    "week_number": 58,
    "reading_from": "James 4",
    "reading_to": "James 5",
    "section": "James",
    "release_date": "2027-10-29T00:00:00.000Z"
  },
  {
    "id": "s405",
    "day_number": 405,
    "week_number": 58,
    "reading_from": "1 Peter 1",
    "reading_to": "1 Peter 3",
    "section": "1 Peter",
    "release_date": "2027-10-30T00:00:00.000Z"
  },
  {
    "id": "s406",
    "day_number": 406,
    "week_number": 58,
    "reading_from": "1 Peter 4",
    "reading_to": "1 Peter 5",
    "section": "1 Peter",
    "release_date": "2027-10-31T00:00:00.000Z"
  },
  {
    "id": "s407",
    "day_number": 407,
    "week_number": 59,
    "reading_from": "2 Peter 1",
    "reading_to": "2 Peter 3",
    "section": "2 Peter",
    "release_date": "2027-11-01T00:00:00.000Z"
  },
  {
    "id": "s408",
    "day_number": 408,
    "week_number": 59,
    "reading_from": "1 John 1",
    "reading_to": "1 John 3",
    "section": "1 John",
    "release_date": "2027-11-02T00:00:00.000Z"
  },
  {
    "id": "s409",
    "day_number": 409,
    "week_number": 59,
    "reading_from": "1 John 4",
    "reading_to": "1 John 5",
    "section": "1 John",
    "release_date": "2027-11-03T00:00:00.000Z"
  },
  {
    "id": "s410",
    "day_number": 410,
    "week_number": 59,
    "reading_from": "2 John 1",
    "reading_to": "2 John 1",
    "section": "2 John",
    "release_date": "2027-11-04T00:00:00.000Z"
  },
  {
    "id": "s411",
    "day_number": 411,
    "week_number": 59,
    "reading_from": "3 John 1",
    "reading_to": "3 John 1",
    "section": "3 John",
    "release_date": "2027-11-05T00:00:00.000Z"
  },
  {
    "id": "s412",
    "day_number": 412,
    "week_number": 59,
    "reading_from": "Jude 1",
    "reading_to": "Jude 1",
    "section": "Jude",
    "release_date": "2027-11-06T00:00:00.000Z"
  },
  {
    "id": "s413",
    "day_number": 413,
    "week_number": 59,
    "reading_from": "Revelation 1",
    "reading_to": "Revelation 3",
    "section": "Revelation",
    "release_date": "2027-11-07T00:00:00.000Z"
  },
  {
    "id": "s414",
    "day_number": 414,
    "week_number": 60,
    "reading_from": "Revelation 4",
    "reading_to": "Revelation 6",
    "section": "Revelation",
    "release_date": "2027-11-08T00:00:00.000Z"
  },
  {
    "id": "s415",
    "day_number": 415,
    "week_number": 60,
    "reading_from": "Revelation 7",
    "reading_to": "Revelation 9",
    "section": "Revelation",
    "release_date": "2027-11-09T00:00:00.000Z"
  },
  {
    "id": "s416",
    "day_number": 416,
    "week_number": 60,
    "reading_from": "Revelation 10",
    "reading_to": "Revelation 12",
    "section": "Revelation",
    "release_date": "2027-11-10T00:00:00.000Z"
  },
  {
    "id": "s417",
    "day_number": 417,
    "week_number": 60,
    "reading_from": "Revelation 13",
    "reading_to": "Revelation 15",
    "section": "Revelation",
    "release_date": "2027-11-11T00:00:00.000Z"
  },
  {
    "id": "s418",
    "day_number": 418,
    "week_number": 60,
    "reading_from": "Revelation 16",
    "reading_to": "Revelation 18",
    "section": "Revelation",
    "release_date": "2027-11-12T00:00:00.000Z"
  },
  {
    "id": "s419",
    "day_number": 419,
    "week_number": 60,
    "reading_from": "Revelation 19",
    "reading_to": "Revelation 21",
    "section": "Revelation",
    "release_date": "2027-11-13T00:00:00.000Z"
  },
  {
    "id": "s420",
    "day_number": 420,
    "week_number": 60,
    "reading_from": "Revelation 22",
    "reading_to": "Revelation 22",
    "section": "Revelation",
    "release_date": "2027-11-14T00:00:00.000Z"
  }
];
export const dummyProgress: ReadingProgress[] = [
  {
    "id": "p-r2-1",
    "reader_id": "r2",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-2",
    "reader_id": "r2",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-3",
    "reader_id": "r2",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-4",
    "reader_id": "r2",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-5",
    "reader_id": "r2",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-6",
    "reader_id": "r2",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-7",
    "reader_id": "r2",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-8",
    "reader_id": "r2",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-9",
    "reader_id": "r2",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-10",
    "reader_id": "r2",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r2-11",
    "reader_id": "r2",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r3-1",
    "reader_id": "r3",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r3-2",
    "reader_id": "r3",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r3-3",
    "reader_id": "r3",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r3-4",
    "reader_id": "r3",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r3-5",
    "reader_id": "r3",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-1",
    "reader_id": "r4",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-2",
    "reader_id": "r4",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-3",
    "reader_id": "r4",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-4",
    "reader_id": "r4",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-5",
    "reader_id": "r4",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-6",
    "reader_id": "r4",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-7",
    "reader_id": "r4",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-8",
    "reader_id": "r4",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-9",
    "reader_id": "r4",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r4-10",
    "reader_id": "r4",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-1",
    "reader_id": "r5",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-2",
    "reader_id": "r5",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-3",
    "reader_id": "r5",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-4",
    "reader_id": "r5",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-5",
    "reader_id": "r5",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-6",
    "reader_id": "r5",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-7",
    "reader_id": "r5",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-8",
    "reader_id": "r5",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-9",
    "reader_id": "r5",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-10",
    "reader_id": "r5",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-11",
    "reader_id": "r5",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-12",
    "reader_id": "r5",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-13",
    "reader_id": "r5",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-14",
    "reader_id": "r5",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-15",
    "reader_id": "r5",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-16",
    "reader_id": "r5",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-17",
    "reader_id": "r5",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-18",
    "reader_id": "r5",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-19",
    "reader_id": "r5",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-20",
    "reader_id": "r5",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-21",
    "reader_id": "r5",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-22",
    "reader_id": "r5",
    "schedule_id": "s22",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-23",
    "reader_id": "r5",
    "schedule_id": "s23",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r5-24",
    "reader_id": "r5",
    "schedule_id": "s24",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-1",
    "reader_id": "r6",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-2",
    "reader_id": "r6",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-3",
    "reader_id": "r6",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-4",
    "reader_id": "r6",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-5",
    "reader_id": "r6",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-6",
    "reader_id": "r6",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r6-7",
    "reader_id": "r6",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-1",
    "reader_id": "r7",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-2",
    "reader_id": "r7",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-3",
    "reader_id": "r7",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-4",
    "reader_id": "r7",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-5",
    "reader_id": "r7",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-6",
    "reader_id": "r7",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-7",
    "reader_id": "r7",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-8",
    "reader_id": "r7",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-9",
    "reader_id": "r7",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r7-10",
    "reader_id": "r7",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-1",
    "reader_id": "r8",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-2",
    "reader_id": "r8",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-3",
    "reader_id": "r8",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-4",
    "reader_id": "r8",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-5",
    "reader_id": "r8",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-6",
    "reader_id": "r8",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-7",
    "reader_id": "r8",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-8",
    "reader_id": "r8",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-9",
    "reader_id": "r8",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-10",
    "reader_id": "r8",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-11",
    "reader_id": "r8",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-12",
    "reader_id": "r8",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-13",
    "reader_id": "r8",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-14",
    "reader_id": "r8",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-15",
    "reader_id": "r8",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-16",
    "reader_id": "r8",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-17",
    "reader_id": "r8",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-18",
    "reader_id": "r8",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-19",
    "reader_id": "r8",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r8-20",
    "reader_id": "r8",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-1",
    "reader_id": "r9",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-2",
    "reader_id": "r9",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-3",
    "reader_id": "r9",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-4",
    "reader_id": "r9",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-5",
    "reader_id": "r9",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-6",
    "reader_id": "r9",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-7",
    "reader_id": "r9",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-8",
    "reader_id": "r9",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-9",
    "reader_id": "r9",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-10",
    "reader_id": "r9",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-11",
    "reader_id": "r9",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-12",
    "reader_id": "r9",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-13",
    "reader_id": "r9",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-14",
    "reader_id": "r9",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-15",
    "reader_id": "r9",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-16",
    "reader_id": "r9",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-17",
    "reader_id": "r9",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-18",
    "reader_id": "r9",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-19",
    "reader_id": "r9",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r9-20",
    "reader_id": "r9",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-1",
    "reader_id": "r10",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-2",
    "reader_id": "r10",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-3",
    "reader_id": "r10",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-4",
    "reader_id": "r10",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-5",
    "reader_id": "r10",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-6",
    "reader_id": "r10",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-7",
    "reader_id": "r10",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-8",
    "reader_id": "r10",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-9",
    "reader_id": "r10",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-10",
    "reader_id": "r10",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-11",
    "reader_id": "r10",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-12",
    "reader_id": "r10",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-13",
    "reader_id": "r10",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-14",
    "reader_id": "r10",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-15",
    "reader_id": "r10",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-16",
    "reader_id": "r10",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-17",
    "reader_id": "r10",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-18",
    "reader_id": "r10",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-19",
    "reader_id": "r10",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-20",
    "reader_id": "r10",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-21",
    "reader_id": "r10",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-22",
    "reader_id": "r10",
    "schedule_id": "s22",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-23",
    "reader_id": "r10",
    "schedule_id": "s23",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r10-24",
    "reader_id": "r10",
    "schedule_id": "s24",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-1",
    "reader_id": "r11",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-2",
    "reader_id": "r11",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-3",
    "reader_id": "r11",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-4",
    "reader_id": "r11",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-5",
    "reader_id": "r11",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-6",
    "reader_id": "r11",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-7",
    "reader_id": "r11",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-8",
    "reader_id": "r11",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-9",
    "reader_id": "r11",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-10",
    "reader_id": "r11",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-11",
    "reader_id": "r11",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-12",
    "reader_id": "r11",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-13",
    "reader_id": "r11",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-14",
    "reader_id": "r11",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-15",
    "reader_id": "r11",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-16",
    "reader_id": "r11",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-17",
    "reader_id": "r11",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-18",
    "reader_id": "r11",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-19",
    "reader_id": "r11",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-20",
    "reader_id": "r11",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-21",
    "reader_id": "r11",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-22",
    "reader_id": "r11",
    "schedule_id": "s22",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r11-23",
    "reader_id": "r11",
    "schedule_id": "s23",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r13-1",
    "reader_id": "r13",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r13-2",
    "reader_id": "r13",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r13-3",
    "reader_id": "r13",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r13-4",
    "reader_id": "r13",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-1",
    "reader_id": "r14",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-2",
    "reader_id": "r14",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-3",
    "reader_id": "r14",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-4",
    "reader_id": "r14",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-5",
    "reader_id": "r14",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-6",
    "reader_id": "r14",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-7",
    "reader_id": "r14",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-8",
    "reader_id": "r14",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-9",
    "reader_id": "r14",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-10",
    "reader_id": "r14",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-11",
    "reader_id": "r14",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-12",
    "reader_id": "r14",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-13",
    "reader_id": "r14",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r14-14",
    "reader_id": "r14",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-1",
    "reader_id": "r15",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-2",
    "reader_id": "r15",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-3",
    "reader_id": "r15",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-4",
    "reader_id": "r15",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-5",
    "reader_id": "r15",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-6",
    "reader_id": "r15",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-7",
    "reader_id": "r15",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-8",
    "reader_id": "r15",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-9",
    "reader_id": "r15",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-10",
    "reader_id": "r15",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-11",
    "reader_id": "r15",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-12",
    "reader_id": "r15",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-13",
    "reader_id": "r15",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-14",
    "reader_id": "r15",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-15",
    "reader_id": "r15",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-16",
    "reader_id": "r15",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-17",
    "reader_id": "r15",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-18",
    "reader_id": "r15",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-19",
    "reader_id": "r15",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-20",
    "reader_id": "r15",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r15-21",
    "reader_id": "r15",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-1",
    "reader_id": "r16",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-2",
    "reader_id": "r16",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-3",
    "reader_id": "r16",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-4",
    "reader_id": "r16",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-5",
    "reader_id": "r16",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-6",
    "reader_id": "r16",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-7",
    "reader_id": "r16",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-8",
    "reader_id": "r16",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-9",
    "reader_id": "r16",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-10",
    "reader_id": "r16",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-11",
    "reader_id": "r16",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r16-12",
    "reader_id": "r16",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-1",
    "reader_id": "r17",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-2",
    "reader_id": "r17",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-3",
    "reader_id": "r17",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-4",
    "reader_id": "r17",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-5",
    "reader_id": "r17",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-6",
    "reader_id": "r17",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-7",
    "reader_id": "r17",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-8",
    "reader_id": "r17",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-9",
    "reader_id": "r17",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-10",
    "reader_id": "r17",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-11",
    "reader_id": "r17",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-12",
    "reader_id": "r17",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-13",
    "reader_id": "r17",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-14",
    "reader_id": "r17",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-15",
    "reader_id": "r17",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-16",
    "reader_id": "r17",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r17-17",
    "reader_id": "r17",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-1",
    "reader_id": "r18",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-2",
    "reader_id": "r18",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-3",
    "reader_id": "r18",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-4",
    "reader_id": "r18",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-5",
    "reader_id": "r18",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-6",
    "reader_id": "r18",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-7",
    "reader_id": "r18",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-8",
    "reader_id": "r18",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-9",
    "reader_id": "r18",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-10",
    "reader_id": "r18",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-11",
    "reader_id": "r18",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-12",
    "reader_id": "r18",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r18-13",
    "reader_id": "r18",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-1",
    "reader_id": "r19",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-2",
    "reader_id": "r19",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-3",
    "reader_id": "r19",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-4",
    "reader_id": "r19",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-5",
    "reader_id": "r19",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-6",
    "reader_id": "r19",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-7",
    "reader_id": "r19",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-8",
    "reader_id": "r19",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-9",
    "reader_id": "r19",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-10",
    "reader_id": "r19",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-11",
    "reader_id": "r19",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-12",
    "reader_id": "r19",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-13",
    "reader_id": "r19",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-14",
    "reader_id": "r19",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-15",
    "reader_id": "r19",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-16",
    "reader_id": "r19",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-17",
    "reader_id": "r19",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-18",
    "reader_id": "r19",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-19",
    "reader_id": "r19",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-20",
    "reader_id": "r19",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-21",
    "reader_id": "r19",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-22",
    "reader_id": "r19",
    "schedule_id": "s22",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r19-23",
    "reader_id": "r19",
    "schedule_id": "s23",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-1",
    "reader_id": "r20",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-2",
    "reader_id": "r20",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-3",
    "reader_id": "r20",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-4",
    "reader_id": "r20",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-5",
    "reader_id": "r20",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-6",
    "reader_id": "r20",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-7",
    "reader_id": "r20",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-8",
    "reader_id": "r20",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-9",
    "reader_id": "r20",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-10",
    "reader_id": "r20",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-11",
    "reader_id": "r20",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-12",
    "reader_id": "r20",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-13",
    "reader_id": "r20",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-14",
    "reader_id": "r20",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-15",
    "reader_id": "r20",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-16",
    "reader_id": "r20",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r20-17",
    "reader_id": "r20",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-1",
    "reader_id": "r21",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-2",
    "reader_id": "r21",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-3",
    "reader_id": "r21",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-4",
    "reader_id": "r21",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-5",
    "reader_id": "r21",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-6",
    "reader_id": "r21",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-7",
    "reader_id": "r21",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-8",
    "reader_id": "r21",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r21-9",
    "reader_id": "r21",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-1",
    "reader_id": "r22",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-2",
    "reader_id": "r22",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-3",
    "reader_id": "r22",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-4",
    "reader_id": "r22",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-5",
    "reader_id": "r22",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-6",
    "reader_id": "r22",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-7",
    "reader_id": "r22",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-8",
    "reader_id": "r22",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-9",
    "reader_id": "r22",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-10",
    "reader_id": "r22",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-11",
    "reader_id": "r22",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-12",
    "reader_id": "r22",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-13",
    "reader_id": "r22",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-14",
    "reader_id": "r22",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-15",
    "reader_id": "r22",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-16",
    "reader_id": "r22",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-17",
    "reader_id": "r22",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-18",
    "reader_id": "r22",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-19",
    "reader_id": "r22",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-20",
    "reader_id": "r22",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-21",
    "reader_id": "r22",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-22",
    "reader_id": "r22",
    "schedule_id": "s22",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-23",
    "reader_id": "r22",
    "schedule_id": "s23",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r22-24",
    "reader_id": "r22",
    "schedule_id": "s24",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-1",
    "reader_id": "r23",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-2",
    "reader_id": "r23",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-3",
    "reader_id": "r23",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-4",
    "reader_id": "r23",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-5",
    "reader_id": "r23",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-6",
    "reader_id": "r23",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-7",
    "reader_id": "r23",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-8",
    "reader_id": "r23",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-9",
    "reader_id": "r23",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-10",
    "reader_id": "r23",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-11",
    "reader_id": "r23",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-12",
    "reader_id": "r23",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-13",
    "reader_id": "r23",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-14",
    "reader_id": "r23",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-15",
    "reader_id": "r23",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-16",
    "reader_id": "r23",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-17",
    "reader_id": "r23",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-18",
    "reader_id": "r23",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-19",
    "reader_id": "r23",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-20",
    "reader_id": "r23",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r23-21",
    "reader_id": "r23",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-1",
    "reader_id": "r24",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-2",
    "reader_id": "r24",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-3",
    "reader_id": "r24",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-4",
    "reader_id": "r24",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-5",
    "reader_id": "r24",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-6",
    "reader_id": "r24",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-7",
    "reader_id": "r24",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-8",
    "reader_id": "r24",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-9",
    "reader_id": "r24",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-10",
    "reader_id": "r24",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-11",
    "reader_id": "r24",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-12",
    "reader_id": "r24",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-13",
    "reader_id": "r24",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-14",
    "reader_id": "r24",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-15",
    "reader_id": "r24",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-16",
    "reader_id": "r24",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-17",
    "reader_id": "r24",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-18",
    "reader_id": "r24",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-19",
    "reader_id": "r24",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r24-20",
    "reader_id": "r24",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-1",
    "reader_id": "r25",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-2",
    "reader_id": "r25",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-3",
    "reader_id": "r25",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-4",
    "reader_id": "r25",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-5",
    "reader_id": "r25",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-6",
    "reader_id": "r25",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-7",
    "reader_id": "r25",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-8",
    "reader_id": "r25",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-9",
    "reader_id": "r25",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-10",
    "reader_id": "r25",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-11",
    "reader_id": "r25",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-12",
    "reader_id": "r25",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-13",
    "reader_id": "r25",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-14",
    "reader_id": "r25",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-15",
    "reader_id": "r25",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r25-16",
    "reader_id": "r25",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-1",
    "reader_id": "r26",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-2",
    "reader_id": "r26",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-3",
    "reader_id": "r26",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-4",
    "reader_id": "r26",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-5",
    "reader_id": "r26",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-6",
    "reader_id": "r26",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-7",
    "reader_id": "r26",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-8",
    "reader_id": "r26",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-9",
    "reader_id": "r26",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-10",
    "reader_id": "r26",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-11",
    "reader_id": "r26",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-12",
    "reader_id": "r26",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-13",
    "reader_id": "r26",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-14",
    "reader_id": "r26",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r26-15",
    "reader_id": "r26",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-1",
    "reader_id": "r27",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-2",
    "reader_id": "r27",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-3",
    "reader_id": "r27",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-4",
    "reader_id": "r27",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-5",
    "reader_id": "r27",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-6",
    "reader_id": "r27",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-7",
    "reader_id": "r27",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-8",
    "reader_id": "r27",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-9",
    "reader_id": "r27",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-10",
    "reader_id": "r27",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-11",
    "reader_id": "r27",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-12",
    "reader_id": "r27",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-13",
    "reader_id": "r27",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-14",
    "reader_id": "r27",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-15",
    "reader_id": "r27",
    "schedule_id": "s15",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-16",
    "reader_id": "r27",
    "schedule_id": "s16",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-17",
    "reader_id": "r27",
    "schedule_id": "s17",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-18",
    "reader_id": "r27",
    "schedule_id": "s18",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-19",
    "reader_id": "r27",
    "schedule_id": "s19",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-20",
    "reader_id": "r27",
    "schedule_id": "s20",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r27-21",
    "reader_id": "r27",
    "schedule_id": "s21",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-1",
    "reader_id": "r28",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-2",
    "reader_id": "r28",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-3",
    "reader_id": "r28",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-4",
    "reader_id": "r28",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-5",
    "reader_id": "r28",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-6",
    "reader_id": "r28",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-7",
    "reader_id": "r28",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-8",
    "reader_id": "r28",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-9",
    "reader_id": "r28",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-10",
    "reader_id": "r28",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-11",
    "reader_id": "r28",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r28-12",
    "reader_id": "r28",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-1",
    "reader_id": "r29",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-2",
    "reader_id": "r29",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-3",
    "reader_id": "r29",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-4",
    "reader_id": "r29",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-5",
    "reader_id": "r29",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-6",
    "reader_id": "r29",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-7",
    "reader_id": "r29",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-8",
    "reader_id": "r29",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-9",
    "reader_id": "r29",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-10",
    "reader_id": "r29",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-11",
    "reader_id": "r29",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-12",
    "reader_id": "r29",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-13",
    "reader_id": "r29",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r29-14",
    "reader_id": "r29",
    "schedule_id": "s14",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-1",
    "reader_id": "r30",
    "schedule_id": "s1",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-2",
    "reader_id": "r30",
    "schedule_id": "s2",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-3",
    "reader_id": "r30",
    "schedule_id": "s3",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-4",
    "reader_id": "r30",
    "schedule_id": "s4",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-5",
    "reader_id": "r30",
    "schedule_id": "s5",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-6",
    "reader_id": "r30",
    "schedule_id": "s6",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-7",
    "reader_id": "r30",
    "schedule_id": "s7",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-8",
    "reader_id": "r30",
    "schedule_id": "s8",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-9",
    "reader_id": "r30",
    "schedule_id": "s9",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-10",
    "reader_id": "r30",
    "schedule_id": "s10",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-11",
    "reader_id": "r30",
    "schedule_id": "s11",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-12",
    "reader_id": "r30",
    "schedule_id": "s12",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "p-r30-13",
    "reader_id": "r30",
    "schedule_id": "s13",
    "completed": true,
    "completed_at": "2026-09-19T19:14:08.604Z"
  }
];
export const dummyQuizResponses: QuizResponse[] = [
  {
    "id": "qr-r1-0",
    "reader_id": "r1",
    "question_id": "dummy-auto-34",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-1",
    "reader_id": "r1",
    "question_id": "dummy-auto-6",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-2",
    "reader_id": "r1",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-3",
    "reader_id": "r1",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-4",
    "reader_id": "r1",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-5",
    "reader_id": "r1",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-6",
    "reader_id": "r1",
    "question_id": "dummy-auto-24",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-7",
    "reader_id": "r1",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-8",
    "reader_id": "r1",
    "question_id": "dummy-auto-20",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-9",
    "reader_id": "r1",
    "question_id": "dummy-auto-40",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-10",
    "reader_id": "r1",
    "question_id": "dummy-auto-35",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-11",
    "reader_id": "r1",
    "question_id": "dummy-4",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-12",
    "reader_id": "r1",
    "question_id": "dummy-auto-31",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-13",
    "reader_id": "r1",
    "question_id": "dummy-auto-16",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-14",
    "reader_id": "r1",
    "question_id": "dummy-auto-60",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r1-15",
    "reader_id": "r1",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-0",
    "reader_id": "r2",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-1",
    "reader_id": "r2",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-2",
    "reader_id": "r2",
    "question_id": "dummy-auto-57",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-3",
    "reader_id": "r2",
    "question_id": "dummy-auto-54",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-4",
    "reader_id": "r2",
    "question_id": "dummy-5",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-5",
    "reader_id": "r2",
    "question_id": "dummy-auto-27",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-6",
    "reader_id": "r2",
    "question_id": "dummy-auto-56",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-7",
    "reader_id": "r2",
    "question_id": "dummy-auto-16",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-8",
    "reader_id": "r2",
    "question_id": "dummy-auto-57",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-9",
    "reader_id": "r2",
    "question_id": "dummy-auto-34",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-10",
    "reader_id": "r2",
    "question_id": "dummy-auto-48",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-11",
    "reader_id": "r2",
    "question_id": "dummy-auto-36",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r2-12",
    "reader_id": "r2",
    "question_id": "dummy-auto-42",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-0",
    "reader_id": "r3",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-1",
    "reader_id": "r3",
    "question_id": "dummy-auto-12",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-2",
    "reader_id": "r3",
    "question_id": "dummy-auto-10",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-3",
    "reader_id": "r3",
    "question_id": "dummy-auto-23",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-4",
    "reader_id": "r3",
    "question_id": "dummy-auto-43",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-5",
    "reader_id": "r3",
    "question_id": "dummy-auto-16",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-6",
    "reader_id": "r3",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-7",
    "reader_id": "r3",
    "question_id": "dummy-2",
    "selected_option": "b",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-8",
    "reader_id": "r3",
    "question_id": "dummy-auto-18",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-9",
    "reader_id": "r3",
    "question_id": "dummy-auto-36",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-10",
    "reader_id": "r3",
    "question_id": "dummy-auto-16",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-11",
    "reader_id": "r3",
    "question_id": "dummy-2",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r3-12",
    "reader_id": "r3",
    "question_id": "dummy-auto-27",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-0",
    "reader_id": "r4",
    "question_id": "dummy-auto-35",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-1",
    "reader_id": "r4",
    "question_id": "dummy-auto-57",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-2",
    "reader_id": "r4",
    "question_id": "dummy-auto-27",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-3",
    "reader_id": "r4",
    "question_id": "dummy-auto-20",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-4",
    "reader_id": "r4",
    "question_id": "dummy-auto-32",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-5",
    "reader_id": "r4",
    "question_id": "dummy-auto-12",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-6",
    "reader_id": "r4",
    "question_id": "dummy-auto-32",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-7",
    "reader_id": "r4",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r4-8",
    "reader_id": "r4",
    "question_id": "dummy-auto-7",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-0",
    "reader_id": "r5",
    "question_id": "dummy-auto-33",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-1",
    "reader_id": "r5",
    "question_id": "dummy-auto-26",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-2",
    "reader_id": "r5",
    "question_id": "dummy-auto-36",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-3",
    "reader_id": "r5",
    "question_id": "dummy-auto-50",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-4",
    "reader_id": "r5",
    "question_id": "dummy-auto-34",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-5",
    "reader_id": "r5",
    "question_id": "dummy-auto-52",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-6",
    "reader_id": "r5",
    "question_id": "dummy-auto-38",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-7",
    "reader_id": "r5",
    "question_id": "dummy-auto-31",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-8",
    "reader_id": "r5",
    "question_id": "dummy-auto-8",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r5-9",
    "reader_id": "r5",
    "question_id": "dummy-auto-22",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-0",
    "reader_id": "r6",
    "question_id": "dummy-auto-53",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-1",
    "reader_id": "r6",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-2",
    "reader_id": "r6",
    "question_id": "dummy-auto-26",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-3",
    "reader_id": "r6",
    "question_id": "dummy-auto-65",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-4",
    "reader_id": "r6",
    "question_id": "dummy-auto-26",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-5",
    "reader_id": "r6",
    "question_id": "dummy-auto-45",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-6",
    "reader_id": "r6",
    "question_id": "dummy-auto-19",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-7",
    "reader_id": "r6",
    "question_id": "dummy-auto-57",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-8",
    "reader_id": "r6",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-9",
    "reader_id": "r6",
    "question_id": "dummy-auto-35",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-10",
    "reader_id": "r6",
    "question_id": "dummy-auto-15",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-11",
    "reader_id": "r6",
    "question_id": "dummy-auto-13",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r6-12",
    "reader_id": "r6",
    "question_id": "dummy-auto-51",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-0",
    "reader_id": "r7",
    "question_id": "dummy-4",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-1",
    "reader_id": "r7",
    "question_id": "dummy-4",
    "selected_option": "c",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-2",
    "reader_id": "r7",
    "question_id": "dummy-auto-63",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-3",
    "reader_id": "r7",
    "question_id": "dummy-auto-22",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-4",
    "reader_id": "r7",
    "question_id": "dummy-auto-62",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-5",
    "reader_id": "r7",
    "question_id": "dummy-auto-17",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-6",
    "reader_id": "r7",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-7",
    "reader_id": "r7",
    "question_id": "dummy-auto-6",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-8",
    "reader_id": "r7",
    "question_id": "dummy-2",
    "selected_option": "b",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-9",
    "reader_id": "r7",
    "question_id": "dummy-auto-10",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-10",
    "reader_id": "r7",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-11",
    "reader_id": "r7",
    "question_id": "dummy-auto-30",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-12",
    "reader_id": "r7",
    "question_id": "dummy-auto-22",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-13",
    "reader_id": "r7",
    "question_id": "dummy-4",
    "selected_option": "c",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-14",
    "reader_id": "r7",
    "question_id": "dummy-auto-52",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r7-15",
    "reader_id": "r7",
    "question_id": "dummy-auto-65",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-0",
    "reader_id": "r8",
    "question_id": "dummy-auto-32",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-1",
    "reader_id": "r8",
    "question_id": "dummy-auto-58",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-2",
    "reader_id": "r8",
    "question_id": "dummy-auto-26",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-3",
    "reader_id": "r8",
    "question_id": "dummy-auto-46",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-4",
    "reader_id": "r8",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-5",
    "reader_id": "r8",
    "question_id": "dummy-auto-47",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-6",
    "reader_id": "r8",
    "question_id": "dummy-auto-7",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-7",
    "reader_id": "r8",
    "question_id": "dummy-auto-46",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-8",
    "reader_id": "r8",
    "question_id": "dummy-auto-29",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-9",
    "reader_id": "r8",
    "question_id": "dummy-auto-40",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-10",
    "reader_id": "r8",
    "question_id": "dummy-auto-36",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-11",
    "reader_id": "r8",
    "question_id": "dummy-auto-47",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-12",
    "reader_id": "r8",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-13",
    "reader_id": "r8",
    "question_id": "dummy-auto-35",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-14",
    "reader_id": "r8",
    "question_id": "dummy-auto-43",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-15",
    "reader_id": "r8",
    "question_id": "dummy-auto-57",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-16",
    "reader_id": "r8",
    "question_id": "dummy-auto-62",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r8-17",
    "reader_id": "r8",
    "question_id": "dummy-auto-59",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-0",
    "reader_id": "r9",
    "question_id": "dummy-auto-37",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-1",
    "reader_id": "r9",
    "question_id": "dummy-auto-42",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-2",
    "reader_id": "r9",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-3",
    "reader_id": "r9",
    "question_id": "dummy-auto-53",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-4",
    "reader_id": "r9",
    "question_id": "dummy-auto-53",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-5",
    "reader_id": "r9",
    "question_id": "dummy-auto-6",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-6",
    "reader_id": "r9",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-7",
    "reader_id": "r9",
    "question_id": "dummy-auto-41",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-8",
    "reader_id": "r9",
    "question_id": "dummy-auto-50",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r9-9",
    "reader_id": "r9",
    "question_id": "dummy-auto-12",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-0",
    "reader_id": "r10",
    "question_id": "dummy-auto-31",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-1",
    "reader_id": "r10",
    "question_id": "dummy-auto-53",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-2",
    "reader_id": "r10",
    "question_id": "dummy-auto-26",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-3",
    "reader_id": "r10",
    "question_id": "dummy-auto-18",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-4",
    "reader_id": "r10",
    "question_id": "dummy-auto-8",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-5",
    "reader_id": "r10",
    "question_id": "dummy-auto-6",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-6",
    "reader_id": "r10",
    "question_id": "dummy-auto-51",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-7",
    "reader_id": "r10",
    "question_id": "dummy-auto-20",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-8",
    "reader_id": "r10",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r10-9",
    "reader_id": "r10",
    "question_id": "dummy-auto-57",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-0",
    "reader_id": "r11",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-1",
    "reader_id": "r11",
    "question_id": "dummy-auto-24",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-2",
    "reader_id": "r11",
    "question_id": "dummy-auto-64",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-3",
    "reader_id": "r11",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-4",
    "reader_id": "r11",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-5",
    "reader_id": "r11",
    "question_id": "dummy-3",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-6",
    "reader_id": "r11",
    "question_id": "dummy-auto-58",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-7",
    "reader_id": "r11",
    "question_id": "dummy-auto-17",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-8",
    "reader_id": "r11",
    "question_id": "dummy-auto-54",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-9",
    "reader_id": "r11",
    "question_id": "dummy-auto-42",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r11-10",
    "reader_id": "r11",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-0",
    "reader_id": "r12",
    "question_id": "dummy-auto-8",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-1",
    "reader_id": "r12",
    "question_id": "dummy-auto-58",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-2",
    "reader_id": "r12",
    "question_id": "dummy-auto-40",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-3",
    "reader_id": "r12",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-4",
    "reader_id": "r12",
    "question_id": "dummy-auto-42",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-5",
    "reader_id": "r12",
    "question_id": "dummy-auto-18",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-6",
    "reader_id": "r12",
    "question_id": "dummy-auto-51",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-7",
    "reader_id": "r12",
    "question_id": "dummy-auto-57",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-8",
    "reader_id": "r12",
    "question_id": "dummy-auto-41",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-9",
    "reader_id": "r12",
    "question_id": "dummy-auto-33",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-10",
    "reader_id": "r12",
    "question_id": "dummy-auto-63",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-11",
    "reader_id": "r12",
    "question_id": "dummy-auto-13",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-12",
    "reader_id": "r12",
    "question_id": "dummy-auto-40",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-13",
    "reader_id": "r12",
    "question_id": "dummy-auto-50",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-14",
    "reader_id": "r12",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r12-15",
    "reader_id": "r12",
    "question_id": "dummy-auto-10",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-0",
    "reader_id": "r13",
    "question_id": "dummy-auto-38",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-1",
    "reader_id": "r13",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-2",
    "reader_id": "r13",
    "question_id": "dummy-auto-42",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-3",
    "reader_id": "r13",
    "question_id": "dummy-auto-40",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-4",
    "reader_id": "r13",
    "question_id": "dummy-auto-56",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-5",
    "reader_id": "r13",
    "question_id": "dummy-auto-23",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-6",
    "reader_id": "r13",
    "question_id": "dummy-auto-24",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-7",
    "reader_id": "r13",
    "question_id": "dummy-auto-7",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-8",
    "reader_id": "r13",
    "question_id": "dummy-auto-26",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-9",
    "reader_id": "r13",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-10",
    "reader_id": "r13",
    "question_id": "dummy-auto-60",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-11",
    "reader_id": "r13",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-12",
    "reader_id": "r13",
    "question_id": "dummy-auto-19",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r13-13",
    "reader_id": "r13",
    "question_id": "dummy-auto-39",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r14-0",
    "reader_id": "r14",
    "question_id": "dummy-auto-48",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r14-1",
    "reader_id": "r14",
    "question_id": "dummy-auto-8",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r15-0",
    "reader_id": "r15",
    "question_id": "dummy-auto-38",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r15-1",
    "reader_id": "r15",
    "question_id": "dummy-auto-24",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r15-2",
    "reader_id": "r15",
    "question_id": "dummy-auto-51",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r15-3",
    "reader_id": "r15",
    "question_id": "dummy-auto-62",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-0",
    "reader_id": "r16",
    "question_id": "dummy-2",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-1",
    "reader_id": "r16",
    "question_id": "dummy-auto-39",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-2",
    "reader_id": "r16",
    "question_id": "dummy-auto-43",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-3",
    "reader_id": "r16",
    "question_id": "dummy-auto-39",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-4",
    "reader_id": "r16",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-5",
    "reader_id": "r16",
    "question_id": "dummy-auto-48",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-6",
    "reader_id": "r16",
    "question_id": "dummy-auto-41",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-7",
    "reader_id": "r16",
    "question_id": "dummy-auto-45",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-8",
    "reader_id": "r16",
    "question_id": "dummy-auto-32",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-9",
    "reader_id": "r16",
    "question_id": "dummy-auto-52",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-10",
    "reader_id": "r16",
    "question_id": "dummy-auto-27",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-11",
    "reader_id": "r16",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r16-12",
    "reader_id": "r16",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r17-0",
    "reader_id": "r17",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-0",
    "reader_id": "r18",
    "question_id": "dummy-auto-45",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-1",
    "reader_id": "r18",
    "question_id": "dummy-auto-24",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-2",
    "reader_id": "r18",
    "question_id": "dummy-auto-26",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-3",
    "reader_id": "r18",
    "question_id": "dummy-auto-50",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-4",
    "reader_id": "r18",
    "question_id": "dummy-2",
    "selected_option": "b",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-5",
    "reader_id": "r18",
    "question_id": "dummy-auto-20",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-6",
    "reader_id": "r18",
    "question_id": "dummy-4",
    "selected_option": "c",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-7",
    "reader_id": "r18",
    "question_id": "dummy-auto-53",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-8",
    "reader_id": "r18",
    "question_id": "dummy-auto-49",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-9",
    "reader_id": "r18",
    "question_id": "dummy-auto-31",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-10",
    "reader_id": "r18",
    "question_id": "dummy-auto-63",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-11",
    "reader_id": "r18",
    "question_id": "dummy-auto-40",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-12",
    "reader_id": "r18",
    "question_id": "dummy-auto-25",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-13",
    "reader_id": "r18",
    "question_id": "dummy-auto-65",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-14",
    "reader_id": "r18",
    "question_id": "dummy-auto-8",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r18-15",
    "reader_id": "r18",
    "question_id": "dummy-auto-24",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-0",
    "reader_id": "r19",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-1",
    "reader_id": "r19",
    "question_id": "dummy-auto-53",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-2",
    "reader_id": "r19",
    "question_id": "dummy-auto-50",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-3",
    "reader_id": "r19",
    "question_id": "dummy-auto-24",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-4",
    "reader_id": "r19",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-5",
    "reader_id": "r19",
    "question_id": "dummy-auto-14",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-6",
    "reader_id": "r19",
    "question_id": "dummy-auto-56",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-7",
    "reader_id": "r19",
    "question_id": "dummy-auto-36",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-8",
    "reader_id": "r19",
    "question_id": "dummy-auto-51",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-9",
    "reader_id": "r19",
    "question_id": "dummy-auto-50",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-10",
    "reader_id": "r19",
    "question_id": "dummy-auto-33",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-11",
    "reader_id": "r19",
    "question_id": "dummy-auto-31",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-12",
    "reader_id": "r19",
    "question_id": "dummy-auto-23",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-13",
    "reader_id": "r19",
    "question_id": "dummy-auto-58",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-14",
    "reader_id": "r19",
    "question_id": "dummy-auto-35",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r19-15",
    "reader_id": "r19",
    "question_id": "dummy-auto-65",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-0",
    "reader_id": "r20",
    "question_id": "dummy-2",
    "selected_option": "a",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-1",
    "reader_id": "r20",
    "question_id": "dummy-auto-44",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-2",
    "reader_id": "r20",
    "question_id": "dummy-auto-35",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-3",
    "reader_id": "r20",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-4",
    "reader_id": "r20",
    "question_id": "dummy-auto-18",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-5",
    "reader_id": "r20",
    "question_id": "dummy-auto-19",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-6",
    "reader_id": "r20",
    "question_id": "dummy-auto-30",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-7",
    "reader_id": "r20",
    "question_id": "dummy-auto-43",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r20-8",
    "reader_id": "r20",
    "question_id": "dummy-auto-41",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-0",
    "reader_id": "r21",
    "question_id": "dummy-auto-30",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-1",
    "reader_id": "r21",
    "question_id": "dummy-auto-28",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-2",
    "reader_id": "r21",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-3",
    "reader_id": "r21",
    "question_id": "dummy-auto-40",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-4",
    "reader_id": "r21",
    "question_id": "dummy-auto-12",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-5",
    "reader_id": "r21",
    "question_id": "dummy-auto-64",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-6",
    "reader_id": "r21",
    "question_id": "dummy-auto-14",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-7",
    "reader_id": "r21",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-8",
    "reader_id": "r21",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-9",
    "reader_id": "r21",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-10",
    "reader_id": "r21",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-11",
    "reader_id": "r21",
    "question_id": "dummy-auto-19",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-12",
    "reader_id": "r21",
    "question_id": "dummy-auto-50",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-13",
    "reader_id": "r21",
    "question_id": "dummy-auto-45",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-14",
    "reader_id": "r21",
    "question_id": "dummy-auto-27",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-15",
    "reader_id": "r21",
    "question_id": "dummy-auto-7",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-16",
    "reader_id": "r21",
    "question_id": "dummy-auto-40",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r21-17",
    "reader_id": "r21",
    "question_id": "dummy-auto-44",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-0",
    "reader_id": "r23",
    "question_id": "dummy-auto-12",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-1",
    "reader_id": "r23",
    "question_id": "dummy-auto-20",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-2",
    "reader_id": "r23",
    "question_id": "dummy-auto-24",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-3",
    "reader_id": "r23",
    "question_id": "dummy-auto-27",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-4",
    "reader_id": "r23",
    "question_id": "dummy-auto-18",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r23-5",
    "reader_id": "r23",
    "question_id": "dummy-auto-62",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r24-0",
    "reader_id": "r24",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r24-1",
    "reader_id": "r24",
    "question_id": "dummy-auto-28",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r24-2",
    "reader_id": "r24",
    "question_id": "dummy-auto-40",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r24-3",
    "reader_id": "r24",
    "question_id": "dummy-auto-17",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-0",
    "reader_id": "r25",
    "question_id": "dummy-auto-46",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-1",
    "reader_id": "r25",
    "question_id": "dummy-auto-35",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-2",
    "reader_id": "r25",
    "question_id": "dummy-auto-42",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-3",
    "reader_id": "r25",
    "question_id": "dummy-auto-64",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-4",
    "reader_id": "r25",
    "question_id": "dummy-auto-7",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-5",
    "reader_id": "r25",
    "question_id": "dummy-auto-58",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-6",
    "reader_id": "r25",
    "question_id": "dummy-auto-13",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-7",
    "reader_id": "r25",
    "question_id": "dummy-1",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-8",
    "reader_id": "r25",
    "question_id": "dummy-auto-32",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-9",
    "reader_id": "r25",
    "question_id": "dummy-auto-7",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r25-10",
    "reader_id": "r25",
    "question_id": "dummy-2",
    "selected_option": "b",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-0",
    "reader_id": "r26",
    "question_id": "dummy-4",
    "selected_option": "c",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-1",
    "reader_id": "r26",
    "question_id": "dummy-auto-17",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-2",
    "reader_id": "r26",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-3",
    "reader_id": "r26",
    "question_id": "dummy-auto-45",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-4",
    "reader_id": "r26",
    "question_id": "dummy-auto-8",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-5",
    "reader_id": "r26",
    "question_id": "dummy-auto-64",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-6",
    "reader_id": "r26",
    "question_id": "dummy-auto-20",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-7",
    "reader_id": "r26",
    "question_id": "dummy-auto-33",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-8",
    "reader_id": "r26",
    "question_id": "dummy-auto-22",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-9",
    "reader_id": "r26",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-10",
    "reader_id": "r26",
    "question_id": "dummy-5",
    "selected_option": "d",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-11",
    "reader_id": "r26",
    "question_id": "dummy-auto-30",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-12",
    "reader_id": "r26",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-13",
    "reader_id": "r26",
    "question_id": "dummy-auto-54",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-14",
    "reader_id": "r26",
    "question_id": "dummy-auto-31",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-15",
    "reader_id": "r26",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r26-16",
    "reader_id": "r26",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-0",
    "reader_id": "r27",
    "question_id": "dummy-auto-17",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-1",
    "reader_id": "r27",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-2",
    "reader_id": "r27",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-3",
    "reader_id": "r27",
    "question_id": "dummy-auto-17",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-4",
    "reader_id": "r27",
    "question_id": "dummy-auto-15",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-5",
    "reader_id": "r27",
    "question_id": "dummy-auto-41",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r27-6",
    "reader_id": "r27",
    "question_id": "dummy-auto-63",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-0",
    "reader_id": "r28",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-1",
    "reader_id": "r28",
    "question_id": "dummy-auto-13",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-2",
    "reader_id": "r28",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-3",
    "reader_id": "r28",
    "question_id": "dummy-auto-37",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-4",
    "reader_id": "r28",
    "question_id": "dummy-auto-28",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-5",
    "reader_id": "r28",
    "question_id": "dummy-auto-19",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-6",
    "reader_id": "r28",
    "question_id": "dummy-auto-33",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-7",
    "reader_id": "r28",
    "question_id": "dummy-auto-58",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-8",
    "reader_id": "r28",
    "question_id": "dummy-auto-20",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-9",
    "reader_id": "r28",
    "question_id": "dummy-auto-34",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-10",
    "reader_id": "r28",
    "question_id": "dummy-auto-56",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-11",
    "reader_id": "r28",
    "question_id": "dummy-auto-9",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-12",
    "reader_id": "r28",
    "question_id": "dummy-3",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-13",
    "reader_id": "r28",
    "question_id": "dummy-auto-52",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r28-14",
    "reader_id": "r28",
    "question_id": "dummy-auto-52",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-0",
    "reader_id": "r29",
    "question_id": "dummy-auto-10",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-1",
    "reader_id": "r29",
    "question_id": "dummy-auto-55",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-2",
    "reader_id": "r29",
    "question_id": "dummy-auto-59",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-3",
    "reader_id": "r29",
    "question_id": "dummy-auto-19",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-4",
    "reader_id": "r29",
    "question_id": "dummy-auto-34",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-5",
    "reader_id": "r29",
    "question_id": "dummy-auto-32",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r29-6",
    "reader_id": "r29",
    "question_id": "dummy-auto-36",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r30-0",
    "reader_id": "r30",
    "question_id": "dummy-auto-29",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r30-1",
    "reader_id": "r30",
    "question_id": "dummy-auto-34",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r30-2",
    "reader_id": "r30",
    "question_id": "dummy-auto-62",
    "selected_option": "a",
    "is_correct": true,
    "answered_at": "2026-09-19T19:14:08.604Z"
  },
  {
    "id": "qr-r30-3",
    "reader_id": "r30",
    "question_id": "dummy-auto-62",
    "selected_option": "b",
    "is_correct": false,
    "answered_at": "2026-09-19T19:14:08.604Z"
  }
];

const dummyQuestionsStatic: QuizQuestion[] = [
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
];

export function getDummyQuestions(): QuizQuestion[] {
  try {
    const local = JSON.parse(localStorage.getItem('dummy_quizzes') || '[]');
    return [...dummyQuestionsStatic, ...local];
  } catch {
    return dummyQuestionsStatic;
  }
}
