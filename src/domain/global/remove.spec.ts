import { expect, test } from "vitest";
import { RemovalResponse, removeQuestionById, removeQuestionByText } from "./remove";
import { today } from "../../util/date";
import { createQuestion, Question } from "./question";
import { createUser } from "../user/user";

test("removing questions should remove them from the question list", () => {
	// GIVEN
	const text = "question1";
	const question1 = createQuestion("question1");
	const question2 = createQuestion("question2");
	const questions: Question[] = [question1, question2];

	const expected: RemovalResponse = { success: true, found: [question1], remaining: [question2], users: [] };

	// WHEN
	const result1 = removeQuestionByText(text, questions, []);

	// THEN
	expect(result1).toEqual(expected);
});

test("removing questions should lead to them being removed from every users daily questions", () => {
	// GIVEN
	const text = "question1";
	const question1 = createQuestion("question1");
	const question2 = createQuestion("question2");
	const user = createUser();
	const expectedUser = { ...createUser(), id: user.id };
	user.dailyQuestions.push(question1.id);
	user.dailyQuestions.push(question2.id);
	expectedUser.dailyQuestions.push(question2.id);

	const expected: RemovalResponse = {
		success: true,
		found: [question1],
		remaining: [question2],
		users: [expectedUser],
	};

	// WHEN
	const result1 = removeQuestionByText(text, [question1, question2], [user]);
	const result2 = removeQuestionById(question1.id, [question1, question2], [user]);

	// THEN
	expect(result1).toEqual(expected);
	expect(result2).toEqual(expected);
});

test("removing questions should lead to them being removed from every users weekly questions", () => {
	// GIVEN
	const text = "question1";
	const question1 = createQuestion("question1");
	const question2 = createQuestion("question2");
	const user = createUser();
	const expectedUser = { ...createUser(), id: user.id };
	user.weeklyQuestions[1].push(question1.id);
	user.weeklyQuestions[2].push(question1.id);
	user.weeklyQuestions[2].push(question2.id);
	expectedUser.weeklyQuestions[2].push(question2.id);

	const expected: RemovalResponse = {
		success: true,
		found: [question1],
		remaining: [question2],
		users: [expectedUser],
	};

	// WHEN
	const result1 = removeQuestionByText(text, [question1, question2], [user]);
	const result2 = removeQuestionById(question1.id, [question1, question2], [user]);

	// THEN
	expect(result1).toEqual(expected);
	expect(result2).toEqual(expected);
});

test("removing questions should lead to them being removed from every users scheduled questions", () => {
	// GIVEN
	const text = "question1";
	const question1 = createQuestion("question1");
	const question2 = createQuestion("question2");
	const user = createUser();
	const expectedUser = { ...createUser(), id: user.id };
	user.sortedScheduledQuestions.push({ questionId: question1.id, date: today() });
	user.sortedScheduledQuestions.push({ questionId: question2.id, date: today() });
	expectedUser.sortedScheduledQuestions.push({ questionId: question2.id, date: today() });

	const expected: RemovalResponse = {
		success: true,
		found: [question1],
		remaining: [question2],
		users: [expectedUser],
	};

	// WHEN
	const result1 = removeQuestionByText(text, [question1, question2], [user]);
	const result2 = removeQuestionById(question1.id, [question1, question2], [user]);

	// THEN
	expect(result1).toEqual(expected);
	expect(result2).toEqual(expected);
});

//TODO:
test("removing a question that is being answered should not be possible");
//TODO: what to do with answered questions? probably for now also not removable
