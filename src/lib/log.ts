// log(...args: any[])
// just a wrapper around console.log
// but adds a timestamp

export const log = (...args: any[]) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};
