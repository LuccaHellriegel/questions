import { nanoid } from "nanoid";

export enum QuestionType {
	BINARY,
	NUMBER,
	TEXT,
}

export interface Question {
	id: string;
	type: QuestionType;
	questionText: string;
}

export interface ScheduledQuestion {
	id: string;
	//from toISOString
	date: string;
}

export interface Answer {
	questionId: string;
	answer: string;
	//from toISOString
	date: string;
}

export interface User {
	id: string;
	// interactionState?: InteractionState;
	answers: Answer[];
	sortedScheduledQuestions: ScheduledQuestion[];
	dailyQuestions: string[];
	weeklyQuestions: string[][];
}

export function createQuestion(questionText: string, type: QuestionType = QuestionType.TEXT): Question {
	return { id: nanoid(), questionText, type };
}

export function createUser(): User {
	return {
		id: nanoid(),
		answers: [],
		sortedScheduledQuestions: [],
		dailyQuestions: [],
		weeklyQuestions: [[], [], [], [], [], [], []],
	};
}
