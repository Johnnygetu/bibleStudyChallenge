const today = new Date();
const challengeStartDate = new Date("2024-01-01T00:00:00Z");
const daysSinceStart = Math.floor((today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
const currentDay = Math.max(1, Math.min(182, daysSinceStart));
console.log(currentDay);
