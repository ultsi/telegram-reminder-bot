import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

import config from "../config.js";

type Chore = {
  name: string;
  command: string;
  description: string;
  intervalDays?: number;
  user?: number;
};

export const chores: Chore[] = [
  {
    name: "Pullot",
    command: "pullot",
    description: "kauppaan",
    intervalDays: 21,
    user: config.users[0],
  },
  {
    name: "Pyykit 40c rummutettavat",
    command: "pyykit",
    description: "yks koneellinen, valkoset erikseen",
    intervalDays: 4,
    user: config.users[0],
  },
  {
    name: "Imuroi",
    command: "imuroi",
    description: "nurkista jne vaikeista paikoista",
    intervalDays: 14,
    user: config.users[0],
  },
  {
    name: "WC",
    command: "wc",
    description:
      "wc lavuaarin ja pytyn siivous (pölypuhdistus ylä- ja alatasot)",
    intervalDays: 21,
    user: config.users[0],
  },
  {
    name: "Pölyjen pyyhkiminen",
    command: "polyt",
    description: "pölyjen pyyhkiminen rätillä",
    intervalDays: 14,
    user: config.users[1],
  },
  {
    name: "Kukkien kastelu",
    command: "kukat",
    description: "kukkien kastelu",
    intervalDays: 7,
    user: config.users[1],
  },
  {
    name: "Lakanat",
    command: "lakanat",
    description: "lakanoiden vaihto - sängystä kaikki",
    intervalDays: 21,
    user: config.users[1],
  },
  {
    name: "Pyykit 30c tai 60c",
    command: "pyykit",
    description: "yks koneellinen",
    intervalDays: 4,
    user: config.users[1],
  },
  {
    name: "Astianpesukone",
    command: "apk",
    description: "puhtaiden tyhjäys & leijuvat likaiset sisään",
  },
  {
    name: "Roskat",
    command: "roskat",
    description: "vie roskat",
  },
  {
    name: "Neato",
    command: "neato",
    description: "laita Neato siivoo sun puolesta",
  },
  {
    name: "Keittiö",
    command: "keittio",
    description: "hellan ja lavuaarin putsaaminen",
  },
];

export type DoneChore = Chore & {
  doneLast: Date;
  doneByUser?: number;
};

const defaults: { chores: DoneChore[] } = {
  chores: chores.map((chore) => ({
    ...chore,
    doneLast: new Date(),
    doneByUser: chore.user,
  })),
};

// init db
const adapter = new JSONFile<{ chores: DoneChore[] }>(
  process.env.DOCKER ? "/db/db.json" : config.dbPath
);

export const choreDb = new Low<{ chores: DoneChore[] }>(adapter, defaults);
