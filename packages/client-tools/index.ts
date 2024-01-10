import { exit } from 'node:process';

import captureScreenshot, { ICaptureScreenshotOptions, logTime } from '@fake-world/capture';
import { confirm, input } from '@inquirer/prompts';
import { env } from 'bun';
import chalk from 'chalk';
import dayjs from 'dayjs';
import open from 'open';

import { loadDB, saveFile } from './utils';

let data: ICaptureScreenshotOptions['data'];
let db: Buffer;

try {
  const dataStr = await input({ message: '请输入导出的数据' });
  data = JSON.parse(dataStr);
} catch {
  console.log(chalk.red.bold('数据格式错误'));
  exit(-1);
}

const outputDir = await input({ message: '请输入导出的图片存放的目录，默认程序目录下的 output 文件夹', default: './output' });
const dbPath = await input({ message: '请输入导出的数据库路径，为空则使用默认的', default: './web.db' });
try {
  db = await loadDB(dbPath);
} catch {
  console.log(chalk.red.bold('数据库路径错误'));
  exit(-1);
}
const useNativeBrowser: ICaptureScreenshotOptions['useNativeBrowser'] = await confirm({ message: '是否使用本地的 Chrome 浏览器实例', default: true });

const buffer = await captureScreenshot({
  data,
  db,
  useNativeBrowser,
  defaultHref: env.DEFAULT_HREF,
});

if (buffer !== undefined) {
  console.log(chalk.blue('开始保存截图到本地', logTime()));
  let exitCode = 0;
  try {
    const fileName = `${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.jpeg`;
    const totalPath = await saveFile(outputDir, fileName, buffer);
    console.log(chalk.green.bold('保存截图成功', logTime()));
    const needOpen = await confirm({ message: '是否打开文件', default: true });
    if (needOpen) {
      await open(totalPath);
    }
    exitCode = 0;
  } catch {
    console.log(chalk.red.bold('保存截图到本地失败', logTime()));
    console.log(chalk.black.bold('程序退出'));
    exitCode = -1;
  } finally {
    console.log(chalk.black.bold('程序退出'));
    exit(exitCode);
  }
}
