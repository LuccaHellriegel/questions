import { ScheduledQuestion, User } from "./model";

export function addDailyQuestion(user: User, questionId: string): User {
	return { ...user, dailyQuestions: [...user.dailyQuestions.filter((q) => q !== questionId), questionId] };
}
export function addWeeklyQuestion(userState: User, questionId: string, day: number): User {
	const clampedDay = Math.min(Math.max(0, day), 6);
	const weeklyQuestions = [...userState.weeklyQuestions];
	weeklyQuestions[clampedDay] = [...weeklyQuestions[clampedDay].filter((q) => q !== questionId), questionId];
	return { ...userState, weeklyQuestions };
}

function sortScheduledQuestions(questions: ScheduledQuestion[]) {
	return questions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
export function addScheduledQuestion(userState: User, question: ScheduledQuestion): User {
	return {
		...userState,
		sortedScheduledQuestions: sortScheduledQuestions([...userState.sortedScheduledQuestions, question]),
	};
}
