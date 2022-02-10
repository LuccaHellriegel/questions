import { DB } from "./db";
import {
	UserState,
	addScheduledQuestion,
	scheduledQuestion,
	addAnswerToCurrentQuestion,
	addInteraction,
	addDailyQuestion,
	removeInteraction,
} from "./domain";

export function createApp(db: DB) {
	function getUserQuestion(userId: string) {
		return db.getUser(userId).then(async (userState) => {
			if (!userState.interactionState) {
				return "Please start an interaction before requesting a question.";
			}
			return (await db.getQuestion((userState as UserState).interactionState.currentQuestionId)).text;
		});
	}
	function modifyUser(userId: string, modify: (userState: UserState) => UserState) {
		return db
			.getUser(userId)
			.then((userState) => modify(userState))
			.then((userState) => db.saveUser(userId, userState));
	}
	function answerQuestion(userId: string, answerStr: string) {
		return modifyUser(userId, (userState) => addAnswerToCurrentQuestion(userState, answerStr));
	}
	async function scheduleQuestion(userId: string, questionId: string, isoDate: string) {
		return modifyUser(userId, (userState) => addScheduledQuestion(userState, scheduledQuestion(questionId, isoDate)));
	}
	async function startInteraction(userId: string) {
		return modifyUser(userId, addInteraction);
	}
	async function endInteraction(userId: string) {
		return modifyUser(userId, removeInteraction);
	}

	async function dailyQuestion(userId: string, questionId: string) {
		return modifyUser(userId, (userState) => addDailyQuestion(userState, questionId));
	}

	return { getUserQuestion, answerQuestion, scheduleQuestion, startInteraction, endInteraction, dailyQuestion };
}

export type App = ReturnType<typeof createApp>;
