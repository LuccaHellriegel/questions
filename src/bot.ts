import { saveQuestion, getUser, saveUser, db, getAllQuestions, getUserQuestion, dailyQuestion } from "./app";
import { defaultState, questionList, QuestionType } from "./domain";
import TelegramBot from "node-telegram-bot-api/src/telegram";

export async function bot() {
	const token = process.env["botToken"];
	const allowedChat = process.env["chatID"];

	//@ts-ignore
	if (!(await getUser(allowedChat)) || (await getUser(allowedChat)).currentQuestionId) {
		await db.empty();
		await saveUser(allowedChat, defaultState());
	}

	await saveQuestion({ type: QuestionType.TEXT, text: "What are your ideas for using this?" }, "IDEAS");
	await saveQuestion({ type: QuestionType.TEXT, text: "How long did you sleep?" }, "SLEEP");

	await dailyQuestion(allowedChat, "SLEEP");

	const bot = new TelegramBot(token, { polling: true });

	function reject(callback) {
		return (msg, ...args) => {
			if (msg.chat.id.toString() === allowedChat) {
				callback(msg, ...args);
			} else {
				console.log("Illegal access denied from: " + msg.chat.id);
			}
		};
	}

	function sendMessage(msg) {
		return bot.sendMessage(allowedChat, msg);
	}

	const onTextReactions = new Map<RegExp, Function>();

	onTextReactions.set(/\/debug */, async () => {
		sendMessage(JSON.stringify(await db.getAll(), undefined, 2));
	});
	onTextReactions.set(/\/allQuestions */, async () =>
		getAllQuestions().then((questions) => sendMessage(questionList(questions)))
	);
	onTextReactions.set(/\/currentQuestion */, async () => sendMessage(await getUserQuestion(allowedChat)));

	bot.on("polling_error", (err) => console.log(err));

	onTextReactions.forEach((reaction, answer) => {
		bot.onText(
			answer,
			reject((msg, ...args) => reaction(msg, ...args))
		);
	});

	sendMessage("Online!\n* " + Array.from(onTextReactions.keys()).join("\n* "));
}
