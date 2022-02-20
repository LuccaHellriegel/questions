export interface QuestionSchedule {
	questionId: string;
	date: Date;
}

export interface Answer {
	questionId: string;
	answer: string;
	date: Date;
}

export enum InteractionType {
	DEFAULT,
	ANSWERING,
}

export enum QuestionAnsweringType {
	DAILY,
	WEEKLY,
	SCHEDULE,
}

export type AnsweringOrder = QuestionAnsweringType[];

//TODO: make answering question-order configurable
export interface AnsweringState {
	currentPosition: number;
	currentQuestionId: string;
}

export interface Interaction {
	type: InteractionType;
	state?: AnsweringState;
}

export interface UserConfiguration {
	order: AnsweringOrder;
}

export interface User {
	id: string;
	config: UserConfiguration;
	interaction: Interaction;
	answers: Answer[];
	// sorted from closest to farthest
	sortedScheduledQuestions: QuestionSchedule[];
	dailyQuestions: string[];
	weeklyQuestions: string[][];
}
