import { MYSELF_ID } from "@/faker/wechat/user";
import {
	EConversationType,
	type IConversationTypeRedPacket,
	type IConversationTypeTransfer,
	type TConversationItem,
	fromLastGenerateUpperText,
	getInputterConfigValueSnapshot,
	getInputterValueSnapshot,
	recentUsedEmojiAtom,
	setConversationListValue,
} from "@/stateV2/conversation";
import {
	type IStateProfile,
	getMyProfileValueSnapshot,
	getProfileValueSnapshot,
} from "@/stateV2/profile";
import { animateElement } from "@/utils";
import type { CustomElementEmoji } from "@/vite-env";
import { SLATE_INITIAL_VALUE, withInlines } from "@/wechatComponents/SlateText/utils";
import { useCreation, usePrevious } from "ahooks";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { isEqual, throttle } from "lodash-es";
import { nanoid } from "nanoid";
import {
	type Dispatch,
	type HTMLAttributes,
	type PropsWithChildren,
	type RefObject,
	type SetStateAction,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { useParams } from "react-router-dom";
import { type BaseEditor, Editor, Node, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { type ReactEditor, withReact } from "slate-react";

type InputMode = HTMLAttributes<HTMLDivElement>["inputMode"];

interface IConversationAPIContext {
	conversationId: IStateProfile["id"];
	listRef: RefObject<HTMLDivElement>;
	scrollConversationListToBtm: () => void;
	inputEditor: BaseEditor & ReactEditor;
	insertEmojiNode: (emojiSymbol: string) => void;
	sendTextMessage: () => void;
	sendTickleText: (friendId: IStateProfile["id"]) => void;
	sendTransfer: (
		data: Omit<IConversationTypeTransfer, "id" | "sendTimestamp" | "upperText" | "type">,
	) => void;
	sendRedPacketAcceptedReply: (redPacketId: IConversationTypeRedPacket["id"]) => void;
	removeLastNode: () => void;
	focusInput: () => void;
	mobileInputMode: InputMode;
	setMobileInputMode: Dispatch<SetStateAction<InputMode>>;
	previousMobileInputMode: InputMode;
}

const ConversationAPIContext = createContext<IConversationAPIContext | null>(null);

export const ConversationAPIProvider = ({ children }: PropsWithChildren) => {
	const listRef = useRef<HTMLDivElement>(null);
	const inputEditor = useCreation(() => withInlines(withHistory(withReact(createEditor()))), []);
	const { id: conversationId = "" } = useParams();
	const setRecentUsedEmoji = useSetAtom(recentUsedEmojiAtom);
	const [mobileInputMode, setMobileInputMode] = useState<InputMode>("text");
	const previousMobileInputMode = usePrevious(mobileInputMode);

	const scrollConversationListToBtm = useCallback(() => {
		setTimeout(() => {
			if (listRef.current) {
				listRef.current.scrollTop = 9999999;
			}
		});
	}, []);

	const insertEmojiNode = useCallback((emojiSymbol: string) => {
		const emoji: CustomElementEmoji = { type: "emoji", emojiSymbol, children: [{ text: "" }] };
		Transforms.insertNodes(inputEditor, emoji);
		Transforms.move(inputEditor, { distance: 1 });
	}, []);

	const sendTextMessage = useCallback(() => {
		const { sendRole } = getInputterConfigValueSnapshot();
		const value = getInputterValueSnapshot();
		if (isEqual(value, SLATE_INITIAL_VALUE)) return;
		setConversationListValue(conversationId, (prev) => {
			return [
				...prev,
				{
					type: EConversationType.text,
					role: sendRole,
					textContent: value,
					id: nanoid(8),
					sendTimestamp: dayjs().valueOf(),
					upperText: fromLastGenerateUpperText(prev),
				},
			] as TConversationItem[];
		});
		const pickedEmoji: string[] = [];
		for (const nodeEntry of Node.descendants(inputEditor)) {
			const [node] = nodeEntry;
			if ((node as CustomElementEmoji).type === "emoji") {
				const { emojiSymbol } = node as CustomElementEmoji;
				pickedEmoji.push(emojiSymbol);
			}
		}
		setRecentUsedEmoji((prev) => Array.from(new Set([...pickedEmoji, ...prev])).slice(0, 8));
		Transforms.delete(inputEditor, {
			at: {
				anchor: Editor.start(inputEditor, []),
				focus: Editor.end(inputEditor, []),
			},
		});
		scrollConversationListToBtm();
	}, [conversationId]);

	const sendTickleText = useCallback(
		throttle(
			(friendId: IStateProfile["id"]) => {
				const friendProfile = getProfileValueSnapshot(friendId)!;
				const myProfile = getMyProfileValueSnapshot()!;
				let finalTickleText = "";
				if (friendId === MYSELF_ID) {
					finalTickleText = `我拍了拍自己${myProfile.tickleText ?? ""}`;
				} else {
					finalTickleText = `我拍了拍 "${friendProfile.nickname}" ${
						friendProfile.tickleText ?? ""
					}`;
				}
				setConversationListValue(conversationId, (prev) => {
					return [
						...prev,
						{
							type: EConversationType.centerText,
							id: nanoid(8),
							sendTimestamp: dayjs().valueOf(),
							role: "mine",
							simpleContent: finalTickleText,
							upperText: fromLastGenerateUpperText(prev),
							extraClassName: friendId === MYSELF_ID ? "text-black/70 font-bold" : "",
						},
					] as TConversationItem[];
				});
				animateElement("#screen", "headShake");
				scrollConversationListToBtm();
			},
			1000,
			{ trailing: false },
		),
		[conversationId],
	);

	const sendTransfer = useCallback(
		(data: Parameters<IConversationAPIContext["sendTransfer"]>[0]) => {
			setConversationListValue(conversationId, (prev) => {
				return [
					...prev,
					{
						type: EConversationType.transfer,
						id: nanoid(8),
						sendTimestamp: dayjs().valueOf(),
						upperText: fromLastGenerateUpperText(prev),
						...data,
					},
				] as TConversationItem[];
			});
		},
		[conversationId],
	);

	const sendRedPacketAcceptedReply = useCallback(
		(redPacketId: Parameters<IConversationAPIContext["sendRedPacketAcceptedReply"]>[0]) => {
			setConversationListValue(conversationId, (prev) => {
				return [
					...prev,
					{
						type: EConversationType.redPacketAcceptedReply,
						id: nanoid(8),
						sendTimestamp: dayjs().valueOf(),
						upperText: fromLastGenerateUpperText(prev),
						redPacketId,
					},
				] as TConversationItem[];
			});
		},
		[conversationId],
	);

	const removeLastNode = useCallback(async () => {
		Editor.deleteBackward(inputEditor, { unit: "character" });
	}, []);

	const focusInput = useCallback(() => {
		setMobileInputMode("text");
	}, []);

	const value: IConversationAPIContext = useMemo(() => {
		return {
			conversationId,
			listRef,
			scrollConversationListToBtm,
			inputEditor,
			insertEmojiNode,
			sendTextMessage,
			removeLastNode,
			sendTickleText,
			sendTransfer,
			sendRedPacketAcceptedReply,
			focusInput,
			mobileInputMode,
			setMobileInputMode,
			previousMobileInputMode,
		};
	}, [mobileInputMode]);

	return (
		<ConversationAPIContext.Provider value={value}>{children}</ConversationAPIContext.Provider>
	);
};

export const useConversationAPI = () => useContext(ConversationAPIContext)!;
