import chalk from 'chalk';

const info = chalk.yellow;
const error = chalk.red;

function log(text: string) {
  const time = new Date;
  const timeStr = ('0' + time.getHours()).slice(-2) + ':' +
                  ('0' + time.getMinutes()).slice(-2) + ':' +
                  ('0' + time.getSeconds()).slice(-2);

  console.log(`${timeStr} | ${text}`);
}

const logger = {
  info: (text: string) => log(info(text)),
  error: (text: string) => log(error(text))
};

export default logger;