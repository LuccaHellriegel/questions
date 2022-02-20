import { today } from "../../util/date";
import { User, InteractionType, Answer } from "./model";
import { tryGetCurrentQuestionId } from "./question";

export function createAnswer(questionId: string, answer: string): Answer {
	return { questionId, answer, date: today() };
}

//TODO: should not be able to start answering if already answering!

//TODO: test
export function startAnswering(user: User): User {
	//TODO; check for null return from getCurrentQuestionId

	return {
		...user,
		interaction: {
			type: InteractionType.ANSWERING,
			state: { currentPosition: 0, currentQuestionId: tryGetCurrentQuestionId(user, 0) },
		},
	};
}

//TODO: interupt answering! Need to be able to jump back in...

//TODO: test
export function answerCurrentQuestion(user: User, answer: string): User {
	//TODO: validate that the answer is for the current question? / that we are in answering state
	const answers = [...user.answers, createAnswer(user.interaction.state.currentQuestionId, answer)];
	const nextPosition = user.interaction.state.currentPosition++;
	const currentQuestionId = tryGetCurrentQuestionId(user, nextPosition);
	const interaction =
		currentQuestionId === null
			? { type: InteractionType.DEFAULT }
			: {
					type: InteractionType.ANSWERING,
					state: { currentPosition: nextPosition, currentQuestionId },
			  };

	return {
		...user,
		answers,
		interaction,
	};
}
