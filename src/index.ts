import { createApp } from "./app";
import { bot } from "./bot";
import { createReplitDB } from "./db";

const db = createReplitDB();
bot(db, createApp(db));
