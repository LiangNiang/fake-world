import { exportDB } from 'dexie-export-import';

import { db } from '@/db';

interface IScrolledElements {
  element: Element;
  id: string;
  scrollTop: number;
}

function getScrolledElements(): IScrolledElements[] {
  const scrolledElements: IScrolledElements[] = [];
  const allElements = document.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    if (el.scrollTop > 0 && el.hasAttribute('data-wheel-id')) {
      scrolledElements.push({
        element: el,
        id: el.getAttribute('data-wheel-id')!,
        scrollTop: el.scrollTop,
      });
    }
  }
  return scrolledElements;
}

export function serializeScrolledData() {
  const scrolledElements = getScrolledElements();
  return scrolledElements.reduce((pv: Record<string, number>, cv) => {
    pv[cv.id] = cv.scrollTop;
    return pv;
  }, {});
}

export async function exportIndexedDB() {
  const imagesCount = await db.images.count();
  const isEmptyDB = imagesCount === 0;
  if (!isEmptyDB) {
    return await exportDB(db);
  }
  return null;
}
