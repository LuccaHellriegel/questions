import { expect, test } from "vitest";
import { expectUnchangedExcept } from "../../util/test";
import { today, tomorrow } from "../../util/date";
import { User } from "./model";
import { createUser } from "./user";
import { weekdayToArrayIndex, addWeeklyQuestion } from "./weekly";

export function expectUserUnchangedExceptWeeklyQuestions(oldUser: User, newUser: User) {
	expectUnchangedExcept(oldUser, newUser, ["weeklyQuestions"]);
}

export function expectChangedWeeklyQuestions({
	initialIds,
	day,
	toBeAdded,
	expectedIds,
}: {
	initialIds: string[];
	day: Date;
	toBeAdded: string[];
	expectedIds: string[];
}) {
	// GIVEN
	const user = createUser();
	user.weeklyQuestions[weekdayToArrayIndex(day)] = initialIds;

	// WHEN
	let result: User = { ...user };
	toBeAdded.forEach((id) => {
		result = addWeeklyQuestion(result, id, day);
	});

	// THEN
	expectUserUnchangedExceptWeeklyQuestions(user, result);
	expect(result.weeklyQuestions[weekdayToArrayIndex(day)]).toEqual(expectedIds);
}

test("adding weekly questions should add them to the end of the respective weekly question list", () => {
	expectChangedWeeklyQuestions({
		initialIds: ["id1", "id2", "id3"],
		day: today(),
		toBeAdded: ["id4"],
		expectedIds: ["id1", "id2", "id3", "id4"],
	});
});

test("adding duplicate weekly questions should add them to the end of respective weekly question list and remove it from its original position", () => {
	expectChangedWeeklyQuestions({
		initialIds: ["id1", "id2", "id3"],
		day: tomorrow(),
		toBeAdded: ["id2"],
		expectedIds: ["id1", "id3", "id2"],
	});
});
