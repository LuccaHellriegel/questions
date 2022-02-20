import { expect, test } from "vitest";
import { expectUnchangedExcept } from "../../util/test";
import { addDailyQuestion } from "./daily";
import { User } from "./model";
import { createUser } from "./user";

export function expectUserUnchangedExceptDailyQuestions(oldUser: User, newUser: User) {
	expectUnchangedExcept(oldUser, newUser, ["dailyQuestions"]);
}

export function expectChangedDailyQuestions({
	initialIds,
	toBeAdded,
	expectedIds,
}: {
	initialIds: string[];
	toBeAdded: string[];
	expectedIds: string[];
}) {
	// GIVEN
	const user = createUser();
	user.dailyQuestions = initialIds;

	// WHEN
	let result: User = { ...user };
	toBeAdded.forEach((id) => {
		result = addDailyQuestion(result, id);
	});

	// THEN
	expectUserUnchangedExceptDailyQuestions(user, result);
	expect(result.dailyQuestions).toEqual(expectedIds);
}

test("adding daily questions should add them to the end of the daily question list", () => {
	expectChangedDailyQuestions({
		initialIds: ["id1", "id2", "id3"],
		toBeAdded: ["id4"],
		expectedIds: ["id1", "id2", "id3", "id4"],
	});
});

test("adding duplicate daily questions should add them to the end of daily question list and remove it from its original position", () => {
	expectChangedDailyQuestions({
		initialIds: ["id1", "id2", "id3"],
		toBeAdded: ["id2"],
		expectedIds: ["id1", "id3", "id2"],
	});
});
