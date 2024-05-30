import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { isArray, keys } from "lodash-es";
import { useSetRecoilState } from "recoil";
import { getRecoil } from "recoil-nexus";

import {
	MetaDataType,
	activatedNodeState,
	allNodesState,
	nodeInjectMetaState,
} from "@/state/detectedNode";

type Props = {
	onSetActivatedNodeEnd?: () => void;
};

const TopOperationNew = ({ onSetActivatedNodeEnd }: Props) => {
	const setActivatedNode = useSetRecoilState(activatedNodeState);

	const selectInput = () => {
		const allNodes = getRecoil(allNodesState);
		const inputEleId = keys(allNodes).find((id) => {
			const metaData = getRecoil(nodeInjectMetaState(id));
			return !isArray(metaData) && metaData?.type === MetaDataType.ConversationInput;
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
