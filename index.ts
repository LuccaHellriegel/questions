import TelegramBot from "node-telegram-bot-api/src/telegram";
import Client from "@replit/database";
import { nanoid } from "nanoid";

////////
//DOMAIN
////////
interface Answer {
	questionId: string;
	answer: string;
	//from toISOString
	date: string;
}
interface ScheduledQuestion {
	questionId: string;
	//from toISOString
	date: string;
}

interface UserState {
	currentQuestionId: string;
	answers: Answer[];
	sortedScheduledQuestions: ScheduledQuestion[];
}

function addAnswer(userState: UserState, answer: Answer) {
	return { ...userState, answers: [...userState.answers, answer] };
}
function replaceQuestion(userState: UserState, newQuestionId: string): UserState {
	return { ...userState, currentQuestionId: newQuestionId };
}
function questionList(questions: string[]) {
	return "* " + questions.join("\n* ");
}
function questionId() {
	return nanoid();
}
function sortScheduledQuestions(questions: ScheduledQuestion[]) {
	return questions.slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
function addScheduledQuestion(userState: UserState, question: ScheduledQuestion): UserState {
	return {
		...userState,
		sortedScheduledQuestions: sortScheduledQuestions([...userState.sortedScheduledQuestions, question]),
	};
}
function dueQuestions(userState: UserState) {
	const today = Date.now();
	const dueQs = [];
	for (const scheduledQuestion of userState.sortedScheduledQuestions) {
		if (Date.parse(scheduledQuestion.date) <= today) {
			dueQs.push(scheduledQuestion);
		} else {
			break;
		}
	}
	return dueQs;
}

/////////////
//APPLICATION
/////////////
//@ts-ignore
const db = new Client();
function getUser(userId) {
	return db.get("USER-" + userId) as Promise<UserState>;
}
function getQuestion(questionId: string) {
	return db.get("QUESTION-" + questionId) as Promise<string>;
}
function getAllQuestions() {
	return db
		.list("QUESTION-")
		.then((questionKeys) => Promise.all(questionKeys.map((key) => db.get(key) as Promise<string>)));
}
function getUserQuestion(userId: string) {
	return getUser(userId).then((userState) => getQuestion((userState as UserState).currentQuestionId));
}
async function saveUser(userId: string, userState: UserState) {
	await db.set("USER-" + userId, userState);
	return userState;
}
function answerQuestionNow(userId: string, questionId: string, answer: string) {
	return getUser(userId)
		.then((userState) => addAnswer(userState, { answer, questionId, date: new Date().toISOString() }))
		.then((userState) => saveUser(userId, userState));
}
async function changeUserQuestion(userId: string, newQuestionId: string) {
	return getUser(userId)
		.then((userState) => replaceQuestion(userState, newQuestionId))
		.then((userState) => saveUser(userId, userState));
}
async function addQuestion(question: string, id: string = questionId()) {
	await db.set("QUESTION-" + id, question);
	return id;
}
async function scheduleQuestion(userId: string, questionId: string, isoDate: string) {
	return getUser(userId)
		.then((userState) => addScheduledQuestion(userState, { questionId, date: isoDate }))
		.then((userState) => saveUser(userId, userState));
}

async function bot() {
	const token = process.env["botToken"];
	const allowedChat = process.env["chatID"];

	if (!(await getQuestion("IDEAS"))) {
		await db.empty();
		await addQuestion("What are your ideas for using this?", "QUESTION-IDEAS");
	}

	if (!(await getUser(allowedChat))) {
		await saveUser(allowedChat, { currentQuestionId: "IDEAS", answers: [], sortedScheduledQuestions: [] });
	}

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

bot();
