import Database, { Client } from "@replit/database";
import { UserState, Question, questionId } from "./domain";

export function userKey(userId: string) {
	return "USER-" + userId;
}
export const questionKeyPrefix = "QUESTION-";
export function questionKey(questionId: string) {
	return questionKeyPrefix + questionId;
}

export function createDB(dbInstance: Client) {
	async function getUser(userId) {
		const userState = (await dbInstance.get(userKey(userId))) as Promise<UserState>;
		if (!userState) {
			throw "Missing User with id " + userId;
		}
		return userState;
	}
	async function saveUser(userId: string, userState: UserState) {
		await dbInstance.set(userKey(userId), userState);
		return userState;
	}

	async function getQuestion(questionId: string) {
		const question = (await dbInstance.get(questionKey(questionId))) as Promise<Question>;
		if (!question) {
			throw "Missing Question with id " + questionId;
		}
		return question;
	}
	async function saveQuestion(question: Question, id?: string) {
		await dbInstance.set(questionKey(id ?? questionId()), question);
		return id;
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
		getAllQuestions,
	};
}

export type DB = ReturnType<typeof createDB>;

export function createReplitDB() {
	return createDB(
		//@ts-ignore
		new Database()
	);
}
