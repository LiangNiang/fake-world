import { useMount, useScroll } from 'ahooks';
import { RefObject, useCallback, useEffect, useRef } from 'react';

export function useMemoScrollPos(id: string, ref?: RefObject<HTMLDivElement>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll(scrollRef);

  const getScrollDataAndSave = useCallback((scroll: ReturnType<typeof useScroll>) => {
    if (scroll) {
      const { top } = scroll;
      localStorage.setItem(id, JSON.stringify({ top }));
    }
  }, []);

  const scrollToPos = useCallback(() => {
    const { top } = JSON.parse(localStorage.getItem(id) || '{}');
    if (top) {
      if (ref) {
        ref.current?.scrollTo({ top });
      } else {
        scrollRef.current?.scrollTo({ top });
      }
    }
  }, []);

  useMount(() => {
    scrollToPos();
  });

  useEffect(() => {
    getScrollDataAndSave(scroll);
  }, [scroll]);

  return { scrollRef, getScrollDataAndSave };
}
