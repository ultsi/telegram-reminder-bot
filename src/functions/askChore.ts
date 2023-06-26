import config from "../../config.js";
import { DoneChore, choreDb, chores } from "../chores.js";
import { bot } from "../lib/bot.js";
import { log } from "../lib/log.js";

// assing a random datetime from 9 to 17 to variable nextTime
const nextTime = new Date();
nextTime.setHours(9 + Math.floor(Math.random() * 8));
nextTime.setMinutes(Math.floor(Math.random() * 60));

const sortChoresByUrgency = (chores: DoneChore[]) => {
  return chores.sort((a, b) => {
    const aNextTime = new Date(a.doneLast);
    const bNextTime = new Date(b.doneLast);

    if (a.intervalDays && b.intervalDays) {
      // Both chores have intervalDays defined
      const aIntervalTime = new Date(a.doneLast);
      aIntervalTime.setDate(aIntervalTime.getDate() + a.intervalDays);
      const bIntervalTime = new Date(b.doneLast);
      bIntervalTime.setDate(bIntervalTime.getDate() + b.intervalDays);

      if (aIntervalTime < aNextTime) {
        aNextTime.setTime(aIntervalTime.getTime());
      }
      if (bIntervalTime < bNextTime) {
        bNextTime.setTime(bIntervalTime.getTime());
      }
    } else if (a.intervalDays) {
      // Only chore a has intervalDays defined
      const aIntervalTime = new Date(a.doneLast);
      aIntervalTime.setDate(aIntervalTime.getDate() + a.intervalDays);
      if (aIntervalTime < aNextTime) {
        aNextTime.setTime(aIntervalTime.getTime());
      }
    } else if (b.intervalDays) {
      // Only chore b has intervalDays defined
      const bIntervalTime = new Date(b.doneLast);
      bIntervalTime.setDate(bIntervalTime.getDate() + b.intervalDays);
      if (bIntervalTime < bNextTime) {
        bNextTime.setTime(bIntervalTime.getTime());
      }
    }

    return aNextTime.getTime() - bNextTime.getTime();
  });
};

const getSortedChoresForUser = async (user: number) => {
  // for each chore in chores
  // get the last time it was done by user
  // or if it has never been done by user, get the time it was last done
  const choresInDb = choreDb.data.chores;

  log("choresInDb", choresInDb);

  const userChores = chores.map((defaultChore) => {
    const choresDone = choresInDb.filter(
      (chore) =>
        chore.name === defaultChore.name &&
        (chore.doneByUser === user || chore.doneByUser === undefined)
    );
    return choresDone[choresDone.length - 1];
  });

  // get rid of undefined chores
  const filteredChores = userChores.filter((chore) => chore !== undefined);

  // return 5 chores that are most urgent
  const sortedChores = sortChoresByUrgency(filteredChores).slice(0, 5);
  log(`Sorted chores for user ${user}:`, sortedChores);
  return sortedChores;
};

let previousMessages: Record<number, number> = {};

const check = async () => {
  if (new Date() < nextTime) {
    return;
  }

  log("Checking chores...");
  log("Reading chore database...");
  await choreDb.read();

  config.users.forEach(async (user) => {
    log(`Processing chores for user ${user}...`);

    const choresForUser = await getSortedChoresForUser(user);
    log(`Chores for user ${user}:`, choresForUser);

    if (choresForUser.length === 0) {
      log(`No chores found for user ${user}. Skipping.`);
      return;
    }

    log(`Sending chores to user ${user}...`);

    const keyboard = choresForUser.map((chore) => [
      {
        text: chore.name,
        callback_data: `chore_${chore.command}`,
      },
    ]);

    const message = await bot.telegram.sendMessage(
      user,
      "Aika tehdä päivän askare!",
      {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      }
    );

    previousMessages[user] = message.message_id;

    log(`Chores sent to user ${user}.`);

    log("Updating nextTime...");

    // update nextTime to be tomorrow at random time between 9 and 17
    nextTime.setDate(nextTime.getDate() + 1);
    nextTime.setHours(9 + Math.floor(Math.random() * 8));
    nextTime.setMinutes(Math.floor(Math.random() * 60));

    log("Next check time:", nextTime);

    log("Chore check completed.");
  });
};

// listen for callback queries
bot.action(/chore_.*/, async (ctx) => {
  // if callback query data matches chore.command
  // set chore.doneLast to now
  // set chore.doneByUser to ctx.from.id
  // send message to user that chore is done

  if (!ctx.from?.id) {
    log(`No user ID found in callback query.`);
    return;
  }

  const choreName = ctx.match[0].substring(6);

  const chore = chores.find((chore) => chore.command === choreName);
  if (!chore) {
    log(`Chore not found for command ${ctx.match[0]}.`);
    return;
  }

  log(`Chore found for command ${ctx.match[0]}:`, chore);
  const doneChore = {
    ...chore,
    doneLast: new Date(),
    doneByUser: ctx.from?.id,
  };

  log(`Updating chore in database:`, doneChore);
  choreDb.data.chores.push(doneChore);
  await choreDb.write();

  // edit the old message to remove the chore
  log(`Editing old message...`);
  await bot.telegram.editMessageReplyMarkup(
    ctx.chat!.id,
    previousMessages[ctx.from!.id],
    undefined,
    {
      inline_keyboard: [],
    }
  );
  await bot.telegram.editMessageText(
    ctx.chat!.id,
    previousMessages[ctx.from!.id],
    undefined,
    `Aika tehdä päivän askare!
    
Edit: Hienoa! Teit askareen ${chore.name}!`
  );
  log(`Old message edited.`);
});

export const startChecks = () => {
  setInterval(check, 1000 * 60);
  check();
};
