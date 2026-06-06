export const logger = {
  info: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args),
  warn: (...args: any[]) => console.warn(...args),
  debug: (...args: any[]) => console.debug(...args),
  trace: (...args: any[]) => console.trace(...args),
  fatal: (...args: any[]) => console.error(...args),
};

