import config from "../../config.js";
import { DoneChore, choreDb, chores } from "../chores.js";
import { bot } from "../lib/bot.js";
import { log } from "../lib/log.js";

// assing a random datetime from 9 to 17 to variable nextTime
const nextTime = new Date();
nextTime.setHours(9 + Math.floor(Math.random() * 8));
nextTime.setMinutes(Math.floor(Math.random() * 60));

log("Next check time:", nextTime);

const choreDoneMessages = [
  "Hienoa! Teit askareen %s!",
  "Hyvä! Askare %s on nyt tehty!",
  "Jes! Askare %s on nyt tehty!",
  "Hienoa! Askare %s on nyt tehty!",
  "Mahtia! Askare %s on nyt tehty!",
  "Lörslärä! Askare %s on nyt tehty!",
  "Dah-na-na-na-naa! Askare %s on nyt tehty!",
  "666 pistettä! Askare %s on nyt tehty!",
  "Vitun hienoa! Askare %s on nyt tehty!",
  "Ei saatana miten hyvä juttu! Askare %s on nyt tehty!",
  "Kuulemani mukaan askare %s on nyt tehty! Hienoa!",
  "Hyvä sinä! Askare %s on nyt tehty!",
  "Mitäpä sitä tekis muutakaan kuin askareen %s! Hienoa!",
  "Askare %s on nyt tehty! Nyt voi relata!",
  "Superia hommaa! Askare %s on nyt tehty!",
  "Huhhuh! Oot sinä kova! Askare %s on nyt tehty!",
  "Kunnollista! Askare %s on nyt tehty!",
  "A really good job! Askare %s on nyt tehty!",
  "Ota palkinto sä oot ansainnu sen! Askare %s on nyt tehty!",
];

const choreDoneStickers = [
  "CAACAgQAAxkBAAIIxWSn0v6Q3GowcjpHAf5tdCzHo57NAAKXAgACDzYrCfwzdkMYQGtnLwQ",
  "CAACAgQAAxkBAAIIx2Sn0wvPM1BPMqbasbsYxQsI0dy_AAKVAgACDzYrCaZ0Bg7EhwQ-LwQ",
  "CAACAgQAAxkBAAIIyWSn0xTQB8KDwBwfNsScOMpmED0hAAKkAgACDzYrCQkT815P9hzfLwQ",
  "CAACAgQAAxkBAAIIy2Sn0ximBVN0yhzMT1bInHAiTSJUAAKaAgACDzYrCdulIHSbqHFlLwQ",
  "CAACAgQAAxkBAAIIzWSn0x7KcDKrmECWRpRUBfOsx02aAAKrAgACDzYrCctNwtxPP2mjLwQ",
  "CAACAgQAAxkBAAIIz2Sn0yT5f4ap--y437YmAe4u100FAAKtAgACDzYrCc4BGSrj9WHzLwQ",
  "CAACAgQAAxkBAAII0WSn0yynkeo1UYw68HCWjg_ImL0DAAKzAgACDzYrCafgaUyz9UeQLwQ",
  "CAACAgQAAxkBAAII02Sn0zSzjJyKZNpX5fVmBwYE0LyjAALMAgACDzYrCcaIkKCiw_pgLwQ",
  "CAACAgQAAxkBAAII1WSn0zxhbObaSe4tWCTNu7pJnb-lAALSAgACDzYrCQkwZrydsM6dLwQ",
  "CAACAgQAAxkBAAII12Sn00RKtgIpE4XgoLb-6adKh21_AALeAgACDzYrCW2z5NgbhNTFLwQ",
  "CAACAgQAAxkBAAII2WSn0058-tylQpOvw7vwH_tR6nzfAAL_AgACDzYrCQjzqFTaaOq0LwQ",
  "CAACAgQAAxkBAAII22Sn01JrsDxoPsCUmOWmniXPNumwAAIBAwACDzYrCXnLI9zoJgWKLwQ",
  "CAACAgQAAxkBAAII3WSn015dAf69d3A57nzEwkOo1fufAAIPAwACDzYrCa7mK81RIAffLwQ",
  "CAACAgIAAxkBAAII32Sn02hEy6Opt1WoGQkqJ-ngGiHGAALtAgACXAJlA0BrMJC-nc5JLwQ",
  "CAACAgIAAxkBAAII4WSn02qJiXrHHt_zuKkqeVjypr_bAAL1AgACXAJlA4ffplqsV7CHLwQ",
  "CAACAgIAAxkBAAII42Sn024xOckSvkIBoXm5CC1iDlfIAAIKAwACXAJlA9W1JoAhcJL5LwQ",
  "CAACAgIAAxkBAAII5WSn03fa6txT2Q45u-Yq0Ny2i2KqAAI1BwACXAJlAzBQdF5D-kWjLwQ",
  "CAACAgQAAxkBAAII52Sn06c3AjAHXRpQHokmcQjebRJXAAIXAAPOwNIcpHr6cA_3SL8vBA",
  "CAACAgQAAxkBAAII6WSn07vkTriJbLLMqB21gqzzvEvuAAIhAAPOwNIc2oFrQwPFUb0vBA",
  "CAACAgQAAxkBAAII62Sn08qhJVM2bdidHk_n69RsdO7NAALKAQACsYMLDm_gnOz1ti4dLwQ",
  "CAACAgQAAxkBAAII7WSn0883ahk86cBZQR225qDUMilVAALUAQACsYMLDpaM2FVgj3ioLwQ",
  "CAACAgQAAxkBAAII72Sn09VvV2sd8Q9IEESAHsry3-ZmAAIGAgACsYMLDm_RO2PFMXldLwQ",
  "CAACAgQAAxkBAAII8WSn094XIUiYbeBNjtaMvYBOayKNAALvAQACsYMLDrpugpb7prViLwQ",
  "CAACAgQAAxkBAAII82Sn0_b1VyAFSEg9fYigBTuY7_qwAAKqAAN2A_0Jv5z0PkZTkUcvBA",
  "CAACAgQAAxkBAAII9WSn0_6jvMmJd9ax_J0ZMRSLzndMAAKvAAN2A_0J3yGqjskOuWYvBA",
  "CAACAgQAAxkBAAII92Sn1Ae3bq-Ydrwi_KE9LZfkPLSTAAImAAPOKX0OD_9ZxR72nKovBA",
  "CAACAgQAAxkBAAII-WSn1Anh8ZsJG8zMIdEEZvzMekyqAAIoAAPOKX0OpiDvOdY-hhwvBA",
  "CAACAgQAAxkBAAII-2Sn1A49-szVrDkaE3Lo9oCJEy8bAAIdAgACsYMLDu_1tmqDgxAyLwQ",
  "CAACAgQAAxkBAAII_WSn1BARTYmGhx-sTyUafNJqRTMnAAIeAgACsYMLDsfMsf5Ah17fLwQ",
  "CAACAgQAAxkBAAII_2Sn1FBkc_b8vBo6QsGGzgt991CWAAISAAPBHkwgx_-5vZ-78kQvBA",
  "CAACAgQAAxkBAAIJAWSn1GDYjJ4LtYZuZbFGm6QS4NOVAAIcAAMsKx0ZZyp79a5-0j4vBA",
  "CAACAgQAAxkBAAIJA2Sn1GxwMfxwcpbmRELqOesdYG9fAAJYAAMsKx0Zh50_XmlmJdovBA",
  "CAACAgQAAxkBAAIJBWSn1IZSmGJtmHhGmbu3mMVuBz45AAJlAQACo4NFC_bH5xQwByc4LwQ",
  "CAACAgQAAxkBAAIJB2Sn1JdjNrF0t8FBEYAtchXcAeUvAAKjCAAC15HQAR4zKWGqmH9oLwQ",
  "CAACAgQAAxkBAAIJCWSn1NNhSrHWGFaCQYQYAmJDTV8YAAIlAAM9f8Ya5JNFmBMxg1svBA",
  "CAACAgIAAxkBAAIJC2Sn1OnfHX5MIzG_-6A0w1onql92AAI0AAOcu2UMXaQLB38JOHAvBA",
  "CAACAgIAAxkBAAIJDWSn1Oy_jdBvRlAt3TzQQCCKEdo8AAI7AAOcu2UMDJa55kAo3FYvBA",
  "CAACAgIAAxkBAAIJD2Sn1PAyo_UAAVOsGEjneZLLMv2VCgACQAADnLtlDLFvQhDHYn2mLwQ",
  "CAACAgIAAxkBAAIJEWSn1PPtFbSGB6vVaMnM4n8WZxWFAAI-AAOcu2UMNR44ikjH1MIvBA",
  "CAACAgIAAxkBAAIJE2Sn1PkwRiLZk4bFxqeTViWSyusBAAJOAAOcu2UMQtkP5PvgAAGSLwQ",
  "CAACAgIAAxkBAAIJFWSn1QLPTzgHy4BqpyV39PLdO6DsAAJfAAOcu2UMKH1HPte1kewvBA",
  "CAACAgIAAxkBAAIJF2Sn1QY_k5mRgWJjzyW9BvhjpM51AAJ9AAOcu2UMOCDVunhC8FYvBA",
  "CAACAgIAAxkBAAIJGWSn1RCAy52WKN-hKJhyRM1hYeqiAAJ-AAOcu2UMJdqtrZF9IsAvBA",
  "CAACAgQAAxkBAAIJG2Sn1TJHxdI3FpPefzIoDShBM7jQAAIZAAPscjIYG2cI_ZXAd7IvBA",
  "CAACAgQAAxkBAAIJHWSn1Z52pjOcjEXQogsM4reu7zIrAAKUAAMVkjIOG5Q0RKY6QCMvBA",
  "CAACAgIAAxkBAAIJH2Sn1b2_crUrEm-jhezwX6atXTFgAALoAgACQrFCA83l56gSXYxuLwQ",
  "CAACAgIAAxkBAAIJIWSn1b_Yhi10N42bfJWBq01lKmCgAALWAgACQrFCAyz48xuIowcAAS8E",
  "CAACAgEAAxkBAAIJI2Sn1efA8NAU-i7ihVNzqpMN2gFeAAK3AQACPgYeBcB83kiYA5ZoLwQ",
  "CAACAgQAAxkBAAIJJWSn1fLTZZJlQR50L67LcHyqE2T8AAIYAAPcBtsO6y-kETdv_MQvBA",
  "CAACAgQAAxkBAAIJJ2Sn1fwuU9CAM7p1IREVGvoWWP0FAAIlAAPcBtsOJztPnQY6jFwvBA",
  "CAACAgQAAxkBAAIJKWSn1gvduRxYbPdOxT97JNSykMtwAAKIAAPgtZUGg3Dffufk5ZAvBA",
  "CAACAgQAAxkBAAIJK2Sn1hJFFQ68UvHoNQpBSlB4pGkuAAIoAAMmzeQJOCkQQe00X_4vBA",
];

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

    await bot.telegram.sendMessage(user, "Aika tehdä päivän askare!", {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

    log(`Chores sent to user ${user}.`);
  });

  log("Chore check completed.");
  log("Updating nextTime...");

  log("Next check time:", nextTime);
  // update nextTime to be tomorrow at random time between 9 and 17
  nextTime.setDate(nextTime.getDate() + 1);
  nextTime.setHours(9 + Math.floor(Math.random() * 8));
  nextTime.setMinutes(Math.floor(Math.random() * 60));
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

  const messageId = ctx.callbackQuery?.message?.message_id;
  if (!messageId) {
    log(`No message ID found in chore callback query.`);
    log(`Callback query:`, ctx.callbackQuery);
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
    doneByUser: ctx.from.id,
  };

  log(`Updating chore in database:`, doneChore);
  choreDb.data.chores.push(doneChore);
  await choreDb.write();

  // edit the old message to remove the chore
  log(`Editing old message...`);
  const randomMessage =
    choreDoneMessages[Math.floor(Math.random() * choreDoneMessages.length)];
  await bot.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    undefined,
    randomMessage.replace("%s", chore.name) + " 👍 Tässä sinulle stickeri!",
    {
      reply_markup: {
        inline_keyboard: [],
      },
    }
  );
  await bot.telegram.sendSticker(
    ctx.chat!.id,
    choreDoneStickers[Math.floor(Math.random() * choreDoneStickers.length)]
  );
  log(`Old message edited.`);
});

export const startChecks = () => {
  setInterval(check, 1000 * 60);
  check();
};
