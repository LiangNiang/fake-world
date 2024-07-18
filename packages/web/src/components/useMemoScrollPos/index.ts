import { getScrollPositionValueSnapshot, scrollPositionAtomFamily } from "@/stateV2/scrollPosition";
import { useMount, useScroll } from "ahooks";
import { useSetAtom } from "jotai";
import { type RefObject, useCallback, useEffect, useRef } from "react";

export function useMemoScrollPos(id: string, ref?: RefObject<HTMLDivElement>) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const scroll = useScroll(scrollRef);
	const setScrollPosition = useSetAtom(scrollPositionAtomFamily(id));

	const getScrollDataAndSave = useCallback((scroll: ReturnType<typeof useScroll>) => {
		if (scroll) {
			const { top } = scroll;
			setScrollPosition({
				top,
			});
		}
	}, []);

	const scrollToPos = useCallback(() => {
		const { top } = getScrollPositionValueSnapshot(id) ?? {};
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
