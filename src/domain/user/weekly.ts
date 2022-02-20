import { User } from "./model";

export function createWeeklyQuestions() {
	return [[], [], [], [], [], [], []];
}

export function weekdayToArrayIndex(date: Date) {
	let index = date.getDay() - 1;
	//sunday is 0-1=-1
	index = index === -1 ? 6 : index;
	return index;
}

export function getWeeklyQuestionsByDay(user: User, date: Date) {
	return user.weeklyQuestions[weekdayToArrayIndex(date)];
}

export function addWeeklyQuestion(user: User, questionId: string, day: Date): User {
	const index = weekdayToArrayIndex(day);
	const weeklyQuestions = [...user.weeklyQuestions];
	weeklyQuestions[index] = [...weeklyQuestions[index].filter((q) => q !== questionId), questionId];
	return { ...user, weeklyQuestions };
}
