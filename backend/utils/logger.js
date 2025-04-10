import chalk from 'chalk';

export function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const levels = {
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
    success: chalk.green,
  };

  const color = levels[level] || chalk.white;
  console.log(`${chalk.gray(`[${timestamp}]`)} ${color(`[${level.toUpperCase()}]`)}: ${message}`);
}

