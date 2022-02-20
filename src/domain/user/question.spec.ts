import { expect, test } from "vitest";
import { inAWeek, today, tomorrow } from "../../util/date";
import { addDailyQuestion } from "./daily";
import { getQuestionsByDay } from "./question";
import {
	addQuestionSchedule,
	createQuestionSchedule,
	createQuestionScheduleForTomorrow,
	createQuestionScheduleForInAWeek,
} from "./schedule";
import { createUser } from "./user";
import { addWeeklyQuestion } from "./weekly";

//TODO: make user creation function more configurable

test("all of todays questions should be returned", () => {
	// GIVEN
	let user = createUser();
	user = addDailyQuestion(user, "id1");
	user = addDailyQuestion(user, "id2");
	const t = today();
	const tom = tomorrow();
	user = addWeeklyQuestion(user, "id3", t);
	user = addWeeklyQuestion(user, "id4", tom);
	user = addQuestionSchedule(user, createQuestionSchedule("id5", t));
	user = addQuestionSchedule(user, createQuestionScheduleForTomorrow("id6"));
	user = addQuestionSchedule(user, createQuestionScheduleForInAWeek("id7"));

	// WHEN
	const result = getQuestionsByDay(user, t);

	// THEN
	expect(result).toEqual({ daily: ["id1", "id2"], weekly: ["id3"], scheduled: [createQuestionSchedule("id5", t)] });
});

test("all of tomorrows questions should be returned", () => {
	// GIVEN
	let user = createUser();
	user = addDailyQuestion(user, "id1");
	user = addDailyQuestion(user, "id2");
	const tom = tomorrow();
	const nextWeek = inAWeek();
	user = addWeeklyQuestion(user, "id3", tom);
	user = addWeeklyQuestion(user, "id4", nextWeek);
	user = addQuestionSchedule(user, createQuestionSchedule("id5", tom));
	user = addQuestionSchedule(user, createQuestionSchedule("id6", nextWeek));
	user = addQuestionSchedule(user, createQuestionScheduleForInAWeek("id7"));

	// WHEN
	const result = getQuestionsByDay(user, tom);

	// THEN
	expect(result).toEqual({ daily: ["id1", "id2"], weekly: ["id3"], scheduled: [createQuestionSchedule("id5", tom)] });
});
