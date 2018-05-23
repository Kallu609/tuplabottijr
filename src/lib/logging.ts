import chalk from 'chalk';

const info = chalk.yellow;
const error = chalk.red;

function log(text: string) {
  const time = new Date;
  const timeStr = ('0' + time.getHours()).slice(-2) + ':' +
                  ('0' + time.getMinutes()).slice(-2) + ':' +
                  ('0' + time.getSeconds()).slice(-2) + '    ';
  const lines = text.split('\n');

  const output = lines.map((line, i) => {
    if (i === 0) return line;
    return ' '.repeat(timeStr.length) + line;
  }).join('\n');

  console.log(timeStr + output);
}

const logger = {
  info:  (text: string) => log(info(text)),
  error: (text: string) => log(error(text))
};

export default logger;