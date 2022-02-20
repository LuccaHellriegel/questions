import { expect, test } from "vitest";

//should app layer is responses to bot commands

//TODO: test

//adding a question should save it

//adding a question to a user should save the updated user

//adding a non existing question to a user should send a warning to the user

test("adding duplicate questions should send a warning to the user");
//Need to call findDuplicates and then if approval -> call infra function

test("adding overlapping questions should send a warning to the user");

test("approving a duplicate question should add it to the database");

//TODO: convert scheduled questions/answer from/to DB values

test("added questions should always be trimmed!");

test("questions older than today should be filtered out before returning todays questions");
