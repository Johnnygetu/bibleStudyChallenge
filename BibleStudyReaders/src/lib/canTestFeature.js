// Gating of in-development ("can test") features. Each entry is the chat id
// of a tester; a reader whose chat id is not listed keeps the feature hidden.
export const CAN_TEST_FEATURES = [
  "5549839020",
  "5378115428",
  "6597819023",
  "1609933941",
  "388908454",
  "871441790"
];

// Loose string compare so the id matches whether it came from Telegram
// (string), the stored profile, or was cast to a number along the way.
export function canTestFeature(chatId) {
  return chatId != null && CAN_TEST_FEATURES.map(String).includes(String(chatId));
}
