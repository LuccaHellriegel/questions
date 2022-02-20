import { Question } from "./question";
import { User } from "../user/model";
import { removeQuestionFromUserById } from "../user/question";

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

export interface RemovalResponse {
	success: boolean;
	found: Question[];
	users: User[];
	remaining: Question[];
}

//TODO: optimize the questions arg by using an async iterator?
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

//TODO: if this goes multi user, probably need some notification stuff for removed questions and the option to re-add them
