import { expect, test } from "vitest";
import { expectUnchangedExcept } from "../../util/test";
import { User, QuestionSchedule } from "./model";
import {
	addQuestionSchedule,
	createQuestionScheduleForToday,
	createQuestionScheduleForInAWeek,
	createQuestionScheduleForTomorrow,
} from "./schedule";
import { createUser } from "./user";

export function expectUserUnchangedExceptScheduledQuestions(oldUser: User, newUser: User) {
	expectUnchangedExcept(oldUser, newUser, ["sortedScheduledQuestions"]);
}

export function expectChangedScheduledQuestions({
	initial,
	toBeAdded,
	expected,
}: {
	initial: QuestionSchedule[];
	toBeAdded: QuestionSchedule[];
	expected: QuestionSchedule[];
}) {
	// GIVEN
	const user = createUser();
	user.sortedScheduledQuestions = initial;

	// WHEN
	let result: User = { ...user };
	toBeAdded.forEach((q) => {
		result = addQuestionSchedule(result, q);
	});

	// THEN
	expectUserUnchangedExceptScheduledQuestions(user, result);
	expect(result.sortedScheduledQuestions).toEqual(expected);
}

test("adding scheduled questions should add them to the scheduled question list in a sorted position", () => {
	const today = createQuestionScheduleForToday("id1");
	const inAWeek = createQuestionScheduleForInAWeek("id2");
	const tomorrow = createQuestionScheduleForTomorrow("id3");

	expectChangedScheduledQuestions({
		initial: [today, inAWeek],
		toBeAdded: [tomorrow],
		expected: [today, tomorrow, inAWeek],
	});
});
