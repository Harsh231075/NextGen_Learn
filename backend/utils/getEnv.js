import dotenv from "dotenv";

dotenv.config();

export class EnvError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnvError";
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
}

export const getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new EnvError(`Environment variable ${key} is not set.`);
    }
    return defaultValue;
  }
  return value;
}

export const getEnvAsNumber = (key, defaultValue) => {
  const value = getEnv(key, defaultValue);
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    throw new EnvError(`Environment variable ${key} is not a valid number.`);
  }
  return numberValue;
}
