import { expect, test } from "vitest";
import { createQuestion, findDuplicates } from "./question";

test("duplicated questions should be found", () => {
	// GIVEN
	const questions = [createQuestion("text1"), createQuestion("text2")];

	// WHEN
	const result = findDuplicates("text1", questions);

	// THEN
	expect(result).toEqual([questions[0]]);
});

test("questions with >75% overlap with other questions should be found", () => {
	// GIVEN
	const questions = [createQuestion("1 2 3"), createQuestion("1 5 3 1 2 6 7 8"), createQuestion("1 2 1")];

	// WHEN
	const result = findDuplicates("1 2 3 4", questions);

	// THEN
	expect(result).toEqual(questions.slice(0, 2));
});
