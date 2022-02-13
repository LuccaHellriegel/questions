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
export enum QuestionType {
	TEXT,
	BINARY,
}
export interface Question {
	id: string;
	type: QuestionType;
	text: string;
}
export enum Interaction {
	ANSWERING_QUESTIONS,
}

export interface InteractionState {
	type: Interaction;
	currentPosition: number;
	currentQuestionId: string;
}

export interface User {
	id: string;
	interactionState?: InteractionState;
	answers: Answer[];
	sortedScheduledQuestions: ScheduledQuestion[];
	dailyQuestions: string[];
	weeklyQuestions: string[][];
}

export function addAnswer(userState: User, answer: Answer): User {
	if (!userState.interactionState) {
		console.log("Tried to answer question without running interaction.");
		return userState;
	}
	return {
		...userState,
		answers: [...userState.answers, answer],
		interactionState: {
			...userState.interactionState,
			currentPosition: userState.interactionState.currentPosition + 1,
		},
	};
}
export function addAnswerToCurrentQuestion(userState: User, answerStr: string): User {
	if (!userState.interactionState) {
		console.log("Tried to answer current question without running interaction");
		return userState;
	}

	return addAnswer(userState, {
		questionId: userState.interactionState.currentQuestionId,
		answer: answerStr,
		date: new Date().toISOString(),
	});
}
export function questionId() {
	return nanoid();
}
export function sortScheduledQuestions(questions: ScheduledQuestion[]) {
	return questions.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
export function scheduledQuestion(questionId: string, date: string): ScheduledQuestion {
	return { questionId, date };
}
export function addScheduledQuestion(userState: User, question: ScheduledQuestion): User {
	return {
		...userState,
		sortedScheduledQuestions: sortScheduledQuestions([...userState.sortedScheduledQuestions, question]),
	};
}
export function addDailyQuestion(userState: User, questionId: string): User {
	return { ...userState, dailyQuestions: [...userState.dailyQuestions.filter((q) => q !== questionId), questionId] };
}
export function addWeeklyQuestion(userState: User, questionId: string, day: number): User {
	const clampedDay = Math.min(Math.max(0, day), 6);
	const weeklyQuestions = [...userState.weeklyQuestions];
	weeklyQuestions[clampedDay] = [...weeklyQuestions[clampedDay].filter((q) => q !== questionId), questionId];
	return { ...userState, weeklyQuestions };
}
export function getDueQuestions(userState: User) {
	const today = Date.now();
	const dueQs: ScheduledQuestion[] = [];
	for (const scheduledQuestion of userState.sortedScheduledQuestions) {
		if (Date.parse(scheduledQuestion.date) <= today) {
			dueQs.push(scheduledQuestion);
		} else {
			break;
		}
	}
	return dueQs;
}
export function defaultState(): User {
	return {
		interactionState: null,
		answers: [],
		sortedScheduledQuestions: [scheduledQuestion("IDEAS", new Date().toISOString())],
		dailyQuestions: [],
		weeklyQuestions: [[], [], [], [], [], [], []],
	};
}

export function getTodaysWeeklyQuestions(userState: User) {
	const todaysDay = new Date().getDay();
	return userState.weeklyQuestions[todaysDay];
}
export function getNextQuestion(userState: User) {
	const pos = userState.interactionState.currentPosition + 1;

	if (pos < userState.dailyQuestions.length) {
		return userState.dailyQuestions[pos];
	} else if (pos - userState.dailyQuestions.length < userState.weeklyQuestions.length) {
		return getTodaysWeeklyQuestions(userState)[pos - userState.dailyQuestions.length];
	} else {
		return getDueQuestions(userState)[pos - userState.dailyQuestions.length - userState.weeklyQuestions.length]
			?.questionId;
	}
}

export function interact(userState: User): User {
	const pos = userState.interactionState?.currentPosition ?? -1;
	const nextQuestion = getNextQuestion({
		...userState,
		interactionState: {
			currentPosition: pos,
			currentQuestionId: "",
			type: Interaction.ANSWERING_QUESTIONS,
		},
	});
	if (!nextQuestion) {
		console.log("Tried to start interaction without any questions");
		return userState;
	}
	return {
		...userState,
		interactionState: {
			currentPosition: pos + 1,
			currentQuestionId: nextQuestion,
			type: Interaction.ANSWERING_QUESTIONS,
		},
	};
}
export function removeInteraction(userState: User): User {
	return { ...userState, interactionState: undefined };
}
