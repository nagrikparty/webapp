globalThis.process ??= {}; globalThis.process.env ??= {};
const logger = {
  info: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  debug: (...args) => console.debug(...args),
  trace: (...args) => console.trace(...args),
  fatal: (...args) => console.error(...args)
};

export { logger as l };
