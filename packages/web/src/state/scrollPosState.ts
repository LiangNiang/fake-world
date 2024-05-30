import { atomFamily } from "recoil";

import { persistAtom } from "./effects";

export const scrollPosState = atomFamily<ScrollToOptions | null, string>({
	key: "scrollPosState",
	default: null,
	effects_UNSTABLE: [persistAtom],
});
