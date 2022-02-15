import { test } from "vitest";
import { findDuplicates } from "./domain";

test("duplicated questions should be found", () => {
	findDuplicates;
});

test("questions with >75% overlap with other questions should be found", () => {
	findDuplicates;
});

test("all of todays questions (daily, weekly, scheduled) should be returned sorted by type");

test("questions older than today should be filtered out before returning todays questions");
