import {
	EMetaDataType,
	activatedNodeAtom,
	getNodeInjectMetaDataValueSnapshot,
} from "@/stateV2/detectedNode";
import { getNodesAtomsValueSnapshot } from "@/stateV2/detectedNode/nodeAtom";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useSetAtom } from "jotai";
import { isArray, keys } from "lodash-es";

type Props = {
	onSetActivatedNodeEnd?: () => void;
};

const TopOperationNew = ({ onSetActivatedNodeEnd }: Props) => {
	const setActivatedNode = useSetAtom(activatedNodeAtom);

	const selectInput = () => {
		const nodesAtoms = getNodesAtomsValueSnapshot();
		const inputEleId = keys(nodesAtoms).find((id) => {
			const metaData = getNodeInjectMetaDataValueSnapshot(id);
			return !isArray(metaData) && metaData?.type === EMetaDataType.ConversationInput;
		});
		if (inputEleId) {
			setActivatedNode(inputEleId);
			onSetActivatedNodeEnd?.();
		}
	};
	return (
		<Tooltip title="创建（发送）新消息">
			<PlusOutlined className="cursor-pointer px-1 text-white" onClick={selectInput} />
		</Tooltip>
	);
};

export default TopOperationNew;
