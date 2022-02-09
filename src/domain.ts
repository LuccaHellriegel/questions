import { nanoid } from "nanoid";

export interface Answer {
	questionId: string;
	answer: string;
	//from toISOString
	date: string;
}
export enum RepetitionType {
	NONE,
	DAILY,
	WEEKLY,
}
export interface ScheduledQuestion {
	questionId: string;
	//from toISOString
	date: string;
	type: RepetitionType;
}
export interface UserState {
	currentQuestion: ScheduledQuestion | null;
	answers: Answer[];
	sortedScheduledQuestions: ScheduledQuestion[];
}

export function addAnswer(userState: UserState, answer: Answer) {
	return { ...userState, answers: [...userState.answers, answer] };
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
export function scheduledQuestion(
	questionId: string,
	date: string,
	type: RepetitionType = RepetitionType.NONE
): ScheduledQuestion {
	return { questionId, date, type };
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
