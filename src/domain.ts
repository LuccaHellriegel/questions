import { nanoid } from "nanoid";

export interface Answer {
	questionId: string;
	answer: string;
	//from toISOString
	date: string;
}
export interface ScheduledQuestion {
	questionId: string;
	//from toISOString
	date: string;
}

export interface UserState {
	currentQuestionId: string;
	answers: Answer[];
	sortedScheduledQuestions: ScheduledQuestion[];
}

export function addAnswer(userState: UserState, answer: Answer) {
	return { ...userState, answers: [...userState.answers, answer] };
}
export function replaceQuestion(userState: UserState, newQuestionId: string): UserState {
	return { ...userState, currentQuestionId: newQuestionId };
}
export function questionList(questions: string[]) {
	return "* " + questions.join("\n* ");
}
export function questionId() {
	return nanoid();
}
export function sortScheduledQuestions(questions: ScheduledQuestion[]) {
	return questions.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
export function addScheduledQuestion(userState: UserState, question: ScheduledQuestion): UserState {
	return {
		...userState,
		sortedScheduledQuestions: sortScheduledQuestions([...userState.sortedScheduledQuestions, question]),
	};
}
export function dueQuestions(userState: UserState) {
	const today = Date.now();
	const dueQs = [];
	for (const scheduledQuestion of userState.sortedScheduledQuestions) {
		if (Date.parse(scheduledQuestion.date) <= today) {
			dueQs.push(scheduledQuestion);
		} else {
			break;
		}
	}
	return dueQs;
}
