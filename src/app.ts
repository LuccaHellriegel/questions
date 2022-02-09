import {
	UserState,
	questionId,
	addScheduledQuestion,
	scheduledQuestion,
	Question,
	addAnswerToCurrentQuestion,
	addInteraction,
	addDailyQuestion,
} from "./domain";
import Client from "@replit/database";

export function userKey(userId: string) {
	return "USER-" + userId;
}
export const questionKeyPrefix = "QUESTION-";
export function questionKey(questionId: string) {
	return "QUESTION-" + questionId;
}

//@ts-ignore
export const db = new Client();

export async function getUser(userId) {
	const userState = (await db.get(userKey(userId))) as Promise<UserState>;
	if (!userState) {
		throw "Missing User with id " + userId;
	}
	return userState;
}
export async function saveUser(userId: string, userState: UserState) {
	await db.set(userKey(userId), userState);
	return userState;
}

export async function getQuestion(questionId: string) {
	const question = (await db.get(questionKey(questionId))) as Promise<string>;
	if (!question) {
		throw "Missing Question with id " + questionId;
	}
	return question;
}
export async function saveQuestion(question: Question, id?: string) {
	await db.set(questionKey(id ?? questionId()), question);
	return id;
}
export function getAllQuestions(): Promise<Question[]> {
	return db
		.list(questionKeyPrefix)
		.then((questionKeys) => Promise.all(questionKeys.map((key) => db.get(key) as Promise<string>)));
}

export function getUserQuestion(userId: string) {
	return getUser(userId).then((userState) => {
		if (!userState.interactionState) {
			return "Please start an interaction before requesting a question.";
		}
		return getQuestion((userState as UserState).interactionState.currentQuestionId);
	});
}
export function modifyUser(userId: string, modify: (userState: UserState) => UserState) {
	return getUser(userId)
		.then((userState) => modify(userState))
		.then((userState) => saveUser(userId, userState));
}
export function answerQuestion(userId: string, answerStr: string) {
	return modifyUser(userId, (userState) => addAnswerToCurrentQuestion(userState, answerStr));
}
export async function scheduleQuestion(userId: string, questionId: string, isoDate: string) {
	return modifyUser(userId, (userState) => addScheduledQuestion(userState, scheduledQuestion(questionId, isoDate)));
}
export async function startInteraction(userId: string) {
	return modifyUser(userId, addInteraction);
}
export async function dailyQuestion(userId: string, questionId: string) {
	return modifyUser(userId, (userState) => addDailyQuestion(userState, questionId));
}
