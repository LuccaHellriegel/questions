import { Answer, QuestionSchedule, User } from "./user/model";

export interface DBAnswer extends Omit<Answer, "date"> {
	//ISO
	date: string;
}

export interface DBSchedule extends Omit<QuestionSchedule, "date"> {
	//ISO
	date: string;
}

export interface DBUser extends Omit<User, "answers" | "sortedScheduledQuestions"> {
	answers: DBAnswer[];
	sortedScheduledQuestions: DBSchedule[];
}

//TODO: test

export function mapFromDB(dbUser: DBUser): User {
	return {
		...dbUser,
		answers: dbUser.answers.map((a) => ({ ...a, date: new Date(a.date) })),
		sortedScheduledQuestions: dbUser.sortedScheduledQuestions.map((q) => ({ ...q, date: new Date(q.date) })),
	};
}

export function mapToDB(user: User): DBUser {
	return {
		...user,
		answers: user.answers.map((a) => ({ ...a, date: a.date.toISOString() })),
		sortedScheduledQuestions: user.sortedScheduledQuestions.map((q) => ({ ...q, date: q.date.toISOString() })),
	};
}
