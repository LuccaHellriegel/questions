import { defaultState, QuestionType } from "./domain";
import TelegramBot from "node-telegram-bot-api/src/telegram";
import { DB } from "./db";
import { App } from "./app";

export function questionList(questions: string[]) {
	return "* " + questions.join("\n* ");
}

export async function init(userId: string, db: DB, app: App) {
	await db.dbInstance.empty();

	try {
		await db.getUser(userId);
	} catch (error) {
		await db.saveUser(userId, defaultState());
	}

	await db.saveQuestion({ type: QuestionType.TEXT, text: "What are your ideas for using this?" }, "IDEAS");
	await db.saveQuestion({ type: QuestionType.TEXT, text: "How long did you sleep?" }, "SLEEP");

	await app.dailyQuestion(userId, "SLEEP");
}

interface Reject {
	(msg, ...args): void;
}

export function rejection(allowedUserId: string): Reject {
	return (callback) =>
		(msg, ...args) => {
			if (msg.chat.id.toString() === allowedUserId) {
				callback(msg, ...args);
			} else {
				console.log("Illegal access denied from: " + msg.chat.id);
			}
		};
}

interface SendMessage {
	(msg: string): void;
}

export function sending(bot, allowedUserId: string): SendMessage {
	return (msg) => bot.sendMessage(allowedUserId, msg);
}

export function setTextReactions(
	bot,
	db: DB,
	app: App,
	reject: Reject,
	sendMessage: SendMessage,
	allowedUserId: string
) {
	const onTextReactions = new Map<RegExp, Function>();

	onTextReactions.set(/\/debug */, async () => {
		sendMessage(JSON.stringify(await db.dbInstance.getAll(), undefined, 2));
	});
	onTextReactions.set(/\/allQuestions */, async () =>
		db.getAllQuestions().then((questions) => sendMessage(questionList(questions.map((q) => q.text))))
	);
	onTextReactions.set(/\/startInteraction */, async () => app.startInteraction(allowedUserId));
	onTextReactions.set(/\/endInteraction */, async () => app.endInteraction(allowedUserId));
	onTextReactions.set(/\/currentQuestion */, async () => sendMessage(await app.getUserQuestion(allowedUserId)));
	onTextReactions.set(/\/answer */, async () => {
		Array.from(onTextReactions.keys()).forEach((regEx) => bot.removeTextListener(regEx));
		bot.onText(
			/.+/,
			reject(async (_, ...args) => {
				await app.answerQuestion(allowedUserId, args[0][0]);
				bot.removeTextListener(/.+/);
				onTextReactions.forEach((reaction, answer) => {
					bot.onText(
						answer,
						reject((msg, ...args) => reaction(msg, ...args))
					);
				});
			})
		);
	});

	onTextReactions.forEach((reaction, answer) => {
		bot.onText(
			answer,
			reject((msg, ...args) => reaction(msg, ...args))
		);
	});

	return onTextReactions;
}

export async function bot(db: DB, app: App) {
	const token = process.env["botToken"];
	const allowedChat = process.env["chatID"];

	await init(allowedChat, db, app);

	let bot = new TelegramBot(token, { polling: true });

	const reject = rejection(allowedChat);
	const sendMessage = sending(bot, allowedChat);

	const onTextReactions = setTextReactions(bot, db, app, reject, sendMessage, allowedChat);

	sendMessage("Online!\n* " + Array.from(onTextReactions.keys()).join("\n* "));
}
