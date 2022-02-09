import { UserState, addAnswer, replaceQuestion, questionId, addScheduledQuestion } from "./domain";
import Client from "@replit/database";

//@ts-ignore
export const db = new Client();
export function getUser(userId) {
	return db.get("USER-" + userId) as Promise<UserState>;
}
export function getQuestion(questionId: string) {
	return db.get("QUESTION-" + questionId) as Promise<string>;
}
export function getAllQuestions() {
	return db
		.list("QUESTION-")
		.then((questionKeys) => Promise.all(questionKeys.map((key) => db.get(key) as Promise<string>)));
}
export function getUserQuestion(userId: string) {
	return getUser(userId).then((userState) => getQuestion((userState as UserState).currentQuestionId));
}
export async function saveUser(userId: string, userState: UserState) {
	await db.set("USER-" + userId, userState);
	return userState;
}
export function answerQuestionNow(userId: string, questionId: string, answer: string) {
	return getUser(userId)
		.then((userState) => addAnswer(userState, { answer, questionId, date: new Date().toISOString() }))
		.then((userState) => saveUser(userId, userState));
}
export async function changeUserQuestion(userId: string, newQuestionId: string) {
	return getUser(userId)
		.then((userState) => replaceQuestion(userState, newQuestionId))
		.then((userState) => saveUser(userId, userState));
}
export async function addQuestion(question: string, id?: string) {
	await db.set("QUESTION-" + (id ?? questionId()), question);
	return id;
}
export async function scheduleQuestion(userId: string, questionId: string, isoDate: string) {
	return getUser(userId)
		.then((userState) => addScheduledQuestion(userState, { questionId, date: isoDate }))
		.then((userState) => saveUser(userId, userState));
}
