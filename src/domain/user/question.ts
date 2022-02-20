import { today } from "../../util/date";
import { User, QuestionAnsweringType, QuestionSchedule } from "./model";
import { getQuestionSchedulesByDay } from "./schedule";
import { getWeeklyQuestionsByDay } from "./weekly";

//TODO: not allowed if answering!
export function removeQuestionFromUserById(questionId: string, user: User): User {
	const idFilter = (id) => id !== questionId;
	return {
		...user,
		sortedScheduledQuestions: user.sortedScheduledQuestions.filter((q) => q.questionId !== questionId),
		dailyQuestions: user.dailyQuestions.filter(idFilter),
		weeklyQuestions: user.weeklyQuestions.map((arr) => arr.filter(idFilter)),
	};
}

//TODO: removeQuestionfromUserByText -> return some kind of RemovalResponse

export function getQuestionsByDay(
	user: User,
	day: Date = today()
): {
	[QuestionAnsweringType.DAILY]: string[];
	[QuestionAnsweringType.WEEKLY]: string[];
	[QuestionAnsweringType.SCHEDULE]: QuestionSchedule[];
} {
	return {
		[QuestionAnsweringType.DAILY]: user.dailyQuestions.slice(),
		[QuestionAnsweringType.WEEKLY]: getWeeklyQuestionsByDay(user, day).slice(),
		[QuestionAnsweringType.SCHEDULE]: getQuestionSchedulesByDay(user, day),
	};
}

export function tryGetCurrentQuestionId(user: User, position: number): string | null {
	//TODO: return error when no questions available / wrong position?
	const questions = getQuestionsByDay(user);
	const questionOrder = user.config.order
		.map((type) =>
			type === QuestionAnsweringType.SCHEDULE ? questions[type].map((s) => s.questionId) : questions[type]
		)
		.flat();

	if (questionOrder.length <= position) {
		return null;
	}

	return questionOrder[position];
}
