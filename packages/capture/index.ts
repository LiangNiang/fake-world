import chalk from 'chalk';
import { getChromePath } from 'chrome-launcher';
import { get, keys } from 'lodash-es';
import puppeteer from 'puppeteer';

export interface ICaptureScreenshotOptions {
  data: Record<string, string>;
  useNativeBrowser: boolean;
  db: Buffer | undefined;
  defaultHref: string;
}

export function logTime() {
  return `${performance.now()}ms`;
}

async function captureScreenshot({ useNativeBrowser, data, db, defaultHref }: ICaptureScreenshotOptions) {
  const href = data.href ?? defaultHref;
  console.log(chalk.green.bold('开始准备捕获截图', useNativeBrowser ? '使用本地浏览器实例' : '使用 puppeteer 浏览器实例', logTime()));
  console.log(chalk.bgMagenta(`Chrome 路径：${getChromePath()}`));
  console.log(chalk.bgMagenta(`Href 地址：${href}`));

  console.log(chalk.blue('开始启动浏览器', logTime()));
  const browser = await puppeteer.launch({
    defaultViewport: {
      isMobile: false,
      hasTouch: false,
      width: 1920,
      height: 1080,
      isLandscape: false,
      deviceScaleFactor: 5,
    },
    headless: 'new',
    executablePath: useNativeBrowser ? getChromePath() : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  console.log(chalk.magenta('浏览器启动成功', logTime()));

  let resBuffer: Buffer;

  try {
    const page = await browser.newPage();

    console.log(chalk.blue('开始往 window 注入 isOpenedByPuppeteer 标记', logTime()));
    await page.evaluateOnNewDocument(() => {
      window.isOpenedByPuppeteer = true;
    });
    console.log(chalk.magenta('window 注入 isOpenedByPuppeteer 标记成功', logTime()));

    console.log(chalk.blue('开始注入 localStorage', logTime()));
    await page.evaluateOnNewDocument((data) => {
      Object.keys(data).forEach(function (k) {
        localStorage.setItem(k, data[k as keyof typeof data]);
      });
    }, data);
    console.log(chalk.magenta('localStorage 注入成功', logTime()));

    console.log(chalk.blue('开始跳转页面并等待页面完全加载', logTime()));
    await page.goto(href, {
      timeout: 30 * 1000,
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
    });
    console.log(chalk.magenta('页面跳转成功', logTime()));
    if (db) {
      console.log(chalk.blue('开始注入 indexedDB', logTime()));
      await page.evaluate(async (db) => {
        await window.importDB(db);
      }, db);
      console.log(chalk.magenta('indexedDB 注入成功', logTime()));
    }

    console.log(chalk.blue('开始刷新页面并等待页面完全加载', logTime()));
    await page.reload({
      waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
    });
    console.log(chalk.magenta('页面刷新成功', logTime()));

    console.log(chalk.blue('开始滚动页面', logTime()));
    const scrolledData = JSON.parse(get(data, 'scrolledData', '{}'));
    const scrolledKeys = keys(scrolledData);
    for (const key of scrolledKeys) {
      await page.locator(`[data-wheel-id="${key}"]`).scroll({
        scrollTop: scrolledData[key],
      });
    }
    console.log(chalk.magenta('页面滚动成功', logTime()));

    console.log(chalk.blue('开始截图', logTime()));
    const element = await page.$('#screen');
    if (element) {
      resBuffer = (await element.screenshot({ quality: 100, type: 'jpeg', encoding: 'binary' })) as Buffer;
      console.log(chalk.green.bold('截图成功', logTime()));
      return resBuffer;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

export default captureScreenshot;
