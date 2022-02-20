import { nanoid } from "nanoid";

export enum QuestionType {
	BINARY,
	NUMBER,
	TEXT,
}

//TODO: make questions scope to certain users with the permission?

export interface Question {
	id: string;
	type: QuestionType;
	questionText: string;
}

export function createQuestion(questionText: string, type: QuestionType = QuestionType.TEXT): Question {
	return { id: nanoid(), questionText, type };
}

function compareTokens(primaryTokens: string[], secondaryTokens: string[]) {
	return primaryTokens.filter((t) => secondaryTokens.includes(t)).length / primaryTokens.length;
}

function toTokens(text: string) {
	return text.split(" ");
}

export function findDuplicates(questionText: string, questions: Question[]) {
	const tokens = toTokens(questionText);
	return questions.filter((q) => compareTokens(tokens, toTokens(q.questionText)) >= 0.75);
}
