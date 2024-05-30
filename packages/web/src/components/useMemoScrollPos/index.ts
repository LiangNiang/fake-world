import { useMount, useScroll } from "ahooks";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { getRecoil } from "recoil-nexus";

import { scrollPosState } from "@/state/scrollPosState";

export function useMemoScrollPos(id: string, ref?: RefObject<HTMLDivElement>) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const scroll = useScroll(scrollRef);
	const setScrollPos = useSetRecoilState(scrollPosState(id));

	const getScrollDataAndSave = useCallback((scroll: ReturnType<typeof useScroll>) => {
		if (scroll) {
			const { top } = scroll;
			setScrollPos({
				top,
			});
		}
	}, []);

	const scrollToPos = useCallback(() => {
		const { top } = getRecoil(scrollPosState(id)) ?? {};
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
