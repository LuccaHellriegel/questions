import { today, tomorrow, inAWeek, inAMonth } from "../../util/date";
import { QuestionSchedule, User } from "./model";

export function createQuestionSchedule(questionId: string, date: Date): QuestionSchedule {
	return { questionId, date };
}
//TODO: test?
export function createQuestionScheduleForToday(questionId: string) {
	return createQuestionSchedule(questionId, today());
}

export function createQuestionScheduleForTomorrow(questionId: string) {
	return createQuestionSchedule(questionId, tomorrow());
}

export function createQuestionScheduleForInAWeek(questionId: string) {
	return createQuestionSchedule(questionId, inAWeek());
}

export function createQuestionScheduleForInMonth(questionId: string) {
	return createQuestionSchedule(questionId, inAMonth());
}

function sortQuestionSchedules(schedules: QuestionSchedule[]) {
	return schedules.sort((a, b) => a.date.getDate() - b.date.getDate());
}

export function addQuestionSchedule(user: User, questionSchedule: QuestionSchedule): User {
	return {
		...user,
		sortedScheduledQuestions: sortQuestionSchedules([...user.sortedScheduledQuestions, questionSchedule]),
	};
}

export function getQuestionSchedulesByDay(user: User, date: Date = today()) {
	const schedules: QuestionSchedule[] = [];
	for (const schedule of user.sortedScheduledQuestions) {
		if (schedule.date.getMonth() === date.getMonth() && schedule.date.getDay() === date.getDay()) {
			schedules.push(schedule);
		} else {
			//schedules are sorted, so if we are past todays questions, we stop
			break;
		}
	}
	return schedules;
}
