import { modeAtom } from "@/stateV2/mode";
import { useAtom } from "jotai";

export default function useMode() {
	const [mode, setMode] = useAtom(modeAtom);

	return {
		mode,
		isEdit: mode === "edit",
		isPreview: mode === "preview",
		setMode,
	};
}
