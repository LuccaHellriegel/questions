import { Infra } from "../infra";
import { mapFromDB, mapToDB } from "./mapper";
import { answerCurrentQuestion, startAnswering } from "./user/answer";
import { addDailyQuestion } from "./user/daily";
import { User, InteractionType } from "./user/model";
import { addQuestionSchedule, createQuestionSchedule } from "./user/schedule";

export function createApp(db: Infra) {
	function getUser(userId: string) {
		return db.getDBUser(userId).then(mapFromDB);
	}

	async function saveUser(user: User) {
		await db.saveDBUser(mapToDB(user));
		return user;
	}

	//TODO: return clearer answer if its an error
	function getUserQuestion(userId: string) {
		return getUser(userId).then(async (user) => {
			if (user.interaction.type !== InteractionType.ANSWERING) {
				return "Please start an interaction before requesting a question.";
			}
			return (await db.getQuestion((user as User).interaction.state.currentQuestionId)).questionText;
		});
	}

	function modifyUser(userId: string, modify: (user: User) => User) {
		return getUser(userId)
			.then((user) => modify(user))
			.then((user) => saveUser(user));
	}

	function answerQuestion(userId: string, answerStr: string) {
		return modifyUser(userId, (user) => answerCurrentQuestion(user, answerStr));
	}

	function scheduleQuestion(userId: string, questionId: string, date: Date) {
		return modifyUser(userId, (user) => addQuestionSchedule(user, createQuestionSchedule(questionId, date)));
	}

	async function beginAnswering(userId: string) {
		return modifyUser(userId, startAnswering);
	}

	async function dailyQuestion(userId: string, questionId: string) {
		return modifyUser(userId, (user) => addDailyQuestion(user, questionId));
	}

	//we dont have reactivity here, so thats why we return what we want the app to react to
	async function dispatch() {}

	return { dispatch };
}

export type App = ReturnType<typeof createApp>;
