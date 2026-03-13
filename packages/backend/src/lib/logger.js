import * as fbLogger from 'firebase-functions/logger';

// Custom logger utility
export const logger = {
  log: (...args) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      console.log(...args);
    } else {
      fbLogger.log(...args);
    }
  },
  info: (...args) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      console.info(...args);
    } else {
      fbLogger.info(...args);
    }
  },
  warn: (...args) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      console.warn(...args);
    } else {
      fbLogger.warn(...args);
    }
  },
  error: (...args) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      console.error(...args);
    } else {
      fbLogger.error(...args);
    }
  },
};
