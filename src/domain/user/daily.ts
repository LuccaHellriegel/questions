import { User } from "./model";

export function addDailyQuestion(user: User, questionId: string): User {
	return { ...user, dailyQuestions: [...user.dailyQuestions.filter((q) => q !== questionId), questionId] };
}
