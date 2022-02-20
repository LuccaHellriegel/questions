import { nanoid } from "nanoid";
import { InteractionType, QuestionAnsweringType, User } from "./model";
import { createWeeklyQuestions } from "./weekly";

export function createUser(): User {
	return {
		id: nanoid(),
		config: { order: [QuestionAnsweringType.DAILY, QuestionAnsweringType.WEEKLY, QuestionAnsweringType.SCHEDULE] },
		interaction: { type: InteractionType.DEFAULT },
		answers: [],
		sortedScheduledQuestions: [],
		dailyQuestions: [],
		weeklyQuestions: createWeeklyQuestions(),
	};
}

//TODO: duplicate scheduled question? (same day, same hour?)

//TODO: separate todays question into areas of the day?
