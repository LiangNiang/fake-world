import { setConversationListValue } from "@/stateV2/conversation";
import {
	EMetaDataType,
	type StaticMetaData,
	getNodeFreshDataValueSnapshot,
} from "@/stateV2/detectedNode";
import { setDialogueListValue } from "@/stateV2/dialogueList";
import { type IStateFeed, setFeedListValue } from "@/stateV2/moments";

interface Data {
	id: string;
	[key: string]: any;
}

function moveData<T extends Data>(array: T[], fromId: string, toId: string | null): T[] {
	const fromIndex = array.findIndex((data) => data.id === fromId);

	if (fromIndex === -1) {
		throw new Error("Invalid fromId");
	}

	const newArray = [...array];
	const [removed] = newArray.splice(fromIndex, 1);
	if (toId === null) {
		newArray.unshift(removed);
	} else {
		const toIndex = array.findIndex((data) => data.id === toId);
		if (toIndex === -1) {
			throw new Error("Invalid toId");
		}
		newArray.splice(fromIndex < toIndex ? toIndex : toIndex + 1, 0, removed);
	}
	return newArray;
}

export function doChangeOrder(
	fromNodeId: string,
	to: { toNodeId: string; toFirst: boolean },
	metaData: StaticMetaData.InjectMetaData | undefined,
	rebuildTree: () => void,
) {
	const { toNodeId, toFirst } = to;
	const fromDataId = (getNodeFreshDataValueSnapshot(fromNodeId) as [IStateFeed])[0].id;
	let toDataId: string | null = null;
	if (!toFirst) {
		toDataId = (getNodeFreshDataValueSnapshot(toNodeId) as [IStateFeed])[0].id;
	}
	const { type } = metaData ?? {};
	switch (type) {
		case EMetaDataType.MomentsFeed: {
			setFeedListValue((prev) => moveData(prev, fromDataId, toDataId));
			break;
		}
		case EMetaDataType.DialogueItem: {
			setDialogueListValue((prev) => moveData(prev, fromDataId, toDataId));
			break;
		}
		case EMetaDataType.ConversationItem: {
			const [conversationId] = metaData?.index ?? [];
			setConversationListValue(conversationId, (prev) => moveData(prev, fromDataId, toDataId));
			break;
		}
		default:
			return;
	}
	rebuildTree();
}
