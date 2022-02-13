import { expect, test } from "vitest";
import { addScheduledQuestion } from "../domain";
import { addDailyQuestion, findDuplicates, removeQuestionByText } from "./domain";

test("removing questions by text should remove them from the question list", () => {
	removeQuestionByText;
});

test("removing questions by text should lead to them being removed from every user", () => {
	removeQuestionByText;
});

test("duplicated questions should be found", () => {
	findDuplicates;
});

test("questions with >75% overlap with other questions should be found", () => {
	findDuplicates;
});

test("adding daily questions should add them to the end of the daily question list", () => {
	addDailyQuestion;
});

test("adding duplicate daily questions should add them to the end of daily question list and remove it from its original position", () => {
	addDailyQuestion;
});

test("adding weekly questions should add them to the end of the respective weekly question list", () => {
	addDailyQuestion;
});

test("adding duplicate weekly questions should add them to the end of respective weekly question list and remove it from its original position", () => {
	addDailyQuestion;
});

test("adding weekly questions to out of range days should add them to the last/first day", () => {
	addDailyQuestion;
});

test("adding scheduled questions should add them to the scheduled question list", () => {
	addScheduledQuestion;
});

test("adding scheduled questions should always result in a sorted list", () => {
	addScheduledQuestion;
});

test("all of todays questions (daily, weekly, scheduled) should be returned sorted by type");

test("");
