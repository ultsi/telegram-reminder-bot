import { Telegraf } from "telegraf";
import config from "../../config.js";
import { log } from "./log.js";

export const bot = new Telegraf(config.telegraf_token); // Let's instantiate a bot using our token.

// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then((bot_informations) => {
  config.botName = bot_informations.username;
  log(
    "Server has initialized bot nickname. Nick: " + bot_informations.username
  );
});

// Helpful command for parsing the chatID that is required for broadcasting messages
bot.command("info", (ctx) => {
  const from = ctx.update.message.from;

  ctx.reply(
    "Sinun userId on " +
      from.id +
      "\nTämän chatin id on " +
      ctx.chat.id.toString()
  );
});

export const launchBot = () => {
  // Start bot polling in order to not terminate Node.js application.
  bot.launch();
  log("Bot has been launched.");
};

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
