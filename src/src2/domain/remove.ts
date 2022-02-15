import { Question, User } from "./model";

export function removeQuestionFromUserById(questionId: string, user: User): User {
	const idFilter = (id) => id !== questionId;
	return {
		...user,
		sortedScheduledQuestions: user.sortedScheduledQuestions.filter((q) => q.id !== questionId),
		dailyQuestions: user.dailyQuestions.filter(idFilter),
		weeklyQuestions: user.weeklyQuestions.map((arr) => arr.filter(idFilter)),
	};
}

//TODO: removeQuestionfromUserByText

function splitQuestionsByText(text: string, questions: Question[]) {
	const found: Question[] = [];
	const remaining: Question[] = [];
	for (const question of questions) {
		if (question.questionText.includes(text)) {
			found.push(question);
		} else {
			remaining.push(question);
		}
	}

	return { found, remaining };
}

export type RemovalResponse = { success: boolean; found: Question[]; users: User[]; remaining: Question[] };

export function removeQuestionByText(text: string, questions: Question[], users: User[]): RemovalResponse {
	const { found, remaining } = splitQuestionsByText(text, questions);
	if (found.length === 1) {
		return {
			success: true,
			found,
			remaining,
			users: users.map((user) => removeQuestionFromUserById(found[0].id, user)),
		};
	} else {
		return { success: false, found, remaining, users };
	}
}

function splitQuestionsById(questionId: string, questions: Question[]) {
	const found: Question[] = [];
	const remaining: Question[] = [];
	for (const question of questions) {
		if (question.id === questionId) {
			found.push(question);
		} else {
			remaining.push(question);
		}
	}

	return { found, remaining };
}

export function removeQuestionById(questionId: string, questions: Question[], users: User[]): RemovalResponse {
	const { found, remaining } = splitQuestionsById(questionId, questions);
	if (found.length === 1) {
		return {
			success: true,
			found,
			remaining,
			users: users.map((user) => removeQuestionFromUserById(questionId, user)),
		};
	} else {
		return { success: false, found, remaining, users };
	}
}
