enum QuestionType {
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

enum RemovalResponseType {
	SUCCESS,
	NOT_FOUND,
	MULTIPLE_CANDIDATES,
}

interface RemovalResponse {
	type: RemovalResponseType;
	candidates?: Question[];
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

export function removeQuestionFromUser(questionId: string, user: User): User {
	const idFilter = (id) => id !== questionId;
	return {
		...user,
		sortedScheduledQuestions: user.sortedScheduledQuestions.filter((q) => q.id !== questionId),
		dailyQuestions: user.dailyQuestions.filter(idFilter),
		weeklyQuestions: user.weeklyQuestions.map((arr) => arr.filter(idFilter)),
	};
}

export function splitQuestionsByText(text: string, questions: Question[]) {
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

export function removeQuestionByText(
	text: string,
	questions: Question[],
	users: User[]
): { success: boolean; found: Question[]; users: User[]; remaining: Question[] } {
	const { found, remaining } = splitQuestionsByText(text, questions);
	if (found.length === 1) {
		return {
			success: true,
			found,
			remaining,
			users: users.map((user) => removeQuestionFromUser(found[0].id, user)),
		};
	} else {
		return { success: false, found, remaining, users };
	}
}

export function findDuplicates(questionText: string, questions: Question[]) {
	//TODO
}

export function addDailyQuestion(user: User, questionId: string): User {
	return { ...user, dailyQuestions: [...user.dailyQuestions.filter((q) => q !== questionId), questionId] };
}
export function addWeeklyQuestion(userState: User, questionId: string, day: number): User {
	const clampedDay = Math.min(Math.max(0, day), 6);
	const weeklyQuestions = [...userState.weeklyQuestions];
	weeklyQuestions[clampedDay] = [...weeklyQuestions[clampedDay].filter((q) => q !== questionId), questionId];
	return { ...userState, weeklyQuestions };
}

export function sortScheduledQuestions(questions: ScheduledQuestion[]) {
	return questions.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
export function addScheduledQuestion(userState: User, question: ScheduledQuestion): User {
	return {
		...userState,
		sortedScheduledQuestions: sortScheduledQuestions([...userState.sortedScheduledQuestions, question]),
	};
}
