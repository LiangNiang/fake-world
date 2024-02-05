import { notification } from 'antd';
import SparkMD5 from 'spark-md5';

import { ping } from './services';

export const getFileMD5 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hash = SparkMD5.ArrayBuffer.hash(arrayBuffer);
  return hash;
};

export const isMD5 = (str: string | undefined): boolean => {
  if (!str) {
    return false;
  }
  if (str.length !== 32) {
    return false;
  }

  const hexPattern = /^[a-f0-9]+$/i;

  return hexPattern.test(str);
};

export const animateElement = (elementSelector: string, animation: string) =>
  new Promise((resolve, reject) => {
    const animationName = `animate__${animation}`;
    const node = document.querySelector(elementSelector) as HTMLElement | null;

    function handleAnimationEnd(event: Event) {
      event.stopPropagation();

      node!.classList.remove(`animate__animated`, animationName);
      node!.removeEventListener('animationend', handleAnimationEnd);
      node!.dataset.animating = 'false';
      resolve('Animation ended');
    }

    if (node) {
      if (node.dataset.animating === 'true') {
        resolve('Element is currently animating');
      } else {
        node.classList.remove('animate__animated', animationName);
        node.classList.add('animate__animated', animationName);
        node.addEventListener('animationend', handleAnimationEnd, { once: true });
        node.dataset.animating = 'true';
      }
    } else {
      reject('Element not found');
    }
  });

export const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadedImages = new Set<string>();

export const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    if (loadedImages.has(url)) return;

    const img = new Image();
    img.onload = () => loadedImages.add(url);
    img.src = url;
  });
};

export async function backendHealthCheck() {
  try {
    await ping();
  } catch (e) {
    console.error(e);
    notification.warning({
      message: '离线模式',
    });
  }
}
