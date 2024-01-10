import { DeleteOutlined, PlusOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';
import { setRecoil } from 'recoil-nexus';

import { activatedNodeState, getActivatedNodeParent } from '@/state/detectedNode';

type CommonOperationBaseProps = {
  onClick?: () => void;
  tooltipProps?: TooltipProps;
};

export const OperationSelectParentBase = ({ onClick }: { onClick?: () => void }) => (
  <Tooltip title="选择上层节点">
    <VerticalAlignTopOutlined onClick={onClick} />
  </Tooltip>
);

export const OperaionDeleteBase = ({ onClick, tooltipProps }: CommonOperationBaseProps) => (
  <Tooltip title="删除此项" {...tooltipProps}>
    <DeleteOutlined onClick={onClick} />
  </Tooltip>
);

export const OperationNewBase = ({ onClick, tooltipProps }: CommonOperationBaseProps) => (
  <Tooltip title="新增" {...tooltipProps}>
    <PlusOutlined onClick={onClick} />
  </Tooltip>
);

const selectParentNode = () => {
  const parent = getActivatedNodeParent();
  if (parent) {
    setRecoil(activatedNodeState, parent.id);
  }
};

export const OperationSelectParent = () => {
  return <OperationSelectParentBase />;
};

OperationSelectParent.selectParentNode = selectParentNode;
