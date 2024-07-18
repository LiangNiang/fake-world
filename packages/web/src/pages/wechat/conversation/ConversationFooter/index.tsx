import Add2OutlinedSVG from "@/assets/add2-outlined.svg?react";
import KeyboardOutlinedSVG from "@/assets/keyboard-outlined.svg?react";
import StickerOutlinedSVG from "@/assets/sticker-outlined.svg?react";
import VoiceSVG from "@/assets/voice-outlined.svg?react";
import {
	EMetaDataType,
	activatedNodeAtom,
	getNodeInjectMetaDataValueSnapshot,
} from "@/stateV2/detectedNode";
import { getNodesAtomsValueSnapshot } from "@/stateV2/detectedNode/nodeAtom";
import { modeAtom } from "@/stateV2/mode";
import { useSetAtom } from "jotai";
import { isArray, keys } from "lodash-es";
import { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import BottomPopup from "./BottomPopup";
import EmojiPanel from "./EmojiPanel";
import Input from "./Input";

const ConversationFooter = () => {
	const [showEmojiPanel, setShowEmojiPanel] = useState(false);
	const setMode = useSetAtom(modeAtom);
	const setActivatedNode = useSetAtom(activatedNodeAtom);

	const inputComponentProps = isMobileOnly
		? {
				showEmojiPanel,
				setShowEmojiPanel,
			}
		: {};

	return (
		<div className="flex flex-col">
			<div className="flex flex-col border-t bg-[#F6F6F6] p-2">
				<div className="flex w-full items-end space-x-2">
					<VoiceSVG fill="#000" className="h-8 w-8" />
					<Input {...inputComponentProps} />
					{showEmojiPanel ? (
						<KeyboardOutlinedSVG
							fill="#000"
							className="h-8 w-8 cursor-pointer"
							onClick={() => setShowEmojiPanel((v) => !v)}
						/>
					) : (
						<StickerOutlinedSVG
							fill="#000"
							className="h-8 w-8 cursor-pointer"
							onClick={() => setShowEmojiPanel((v) => !v)}
						/>
					)}
					<Add2OutlinedSVG
						fill="#000"
						className="h-8 w-8 cursor-pointer"
						onClick={() => {
							setMode("edit");
							const nodesAtoms = getNodesAtomsValueSnapshot();
							for (const key of keys(nodesAtoms)) {
								const metaData = getNodeInjectMetaDataValueSnapshot(key);
								if (!isArray(metaData) && metaData?.type === EMetaDataType.ConversationList) {
									setActivatedNode(key);
									break;
								}
							}
						}}
					/>
				</div>
			</div>
			<BottomPopup show={showEmojiPanel}>
				<EmojiPanel />
			</BottomPopup>
		</div>
	);
};

export default ConversationFooter;
