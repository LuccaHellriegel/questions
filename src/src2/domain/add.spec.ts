import { test } from "vitest";
import { addDailyQuestion, addScheduledQuestion } from "./add";

//should app layer is responses to bot commands

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
