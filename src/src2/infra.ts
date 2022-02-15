import Database, { Client } from "@replit/database";
import { nanoid } from "nanoid";
import { Question, User } from "./domain/domain";

export function userKey(userId: string) {
	return "USER-" + userId;
}
export const questionKeyPrefix = "QUESTION-";
export function questionKey(questionId: string) {
	return questionKeyPrefix + questionId;
}

export function createInfra(dbInstance: Client) {
	function getUser(userId: string) {
		return dbInstance.get(userKey(userId)) as Promise<User | null>;
	}
	async function saveUser(user: User): Promise<User> {
		await dbInstance.set(userKey(user.id), user);
		return user;
	}
	function getQuestion(questionId: string) {
		return dbInstance.get(questionKey(questionId)) as Promise<Question | null>;
	}
	async function saveQuestion(question: Question) {
		await dbInstance.set(questionKey(question.id), question);
		return question;
	}
	async function deleteQuestion(questionId: string) {
		return dbInstance.delete(questionKey(questionId));
	}
	function getAllQuestions(): Promise<Question[]> {
		return dbInstance
			.list(questionKeyPrefix)
			.then((questionKeys) => Promise.all(questionKeys.map((key) => dbInstance.get(key) as Promise<Question>)));
	}

	return {
		dbInstance,
		getUser,
		saveUser,
		getQuestion,
		saveQuestion,
		deleteQuestion,
		getAllQuestions,
		generateId: () => nanoid(),
	};
}

export type Infra = ReturnType<typeof createInfra>;

export function createReplitInfra() {
	return createInfra(
		//@ts-ignore
		new Database()
	);
}
