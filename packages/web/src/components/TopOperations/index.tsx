import { useRecoilValue } from 'recoil';

import { nodeInjectMetaState } from '@/state/detectedNode';
import { StaticMetaData } from '@/state/detectedNode/typing';

import { OperaionDeleteBase, OperationNewBase, OperationSelectParent } from './BuiltIn';

type Props = {
  nodeId: string;
};

const TopOperations = ({ nodeId }: Props) => {
  const injectMetaData = useRecoilValue(nodeInjectMetaState(nodeId));

  if (!injectMetaData) return null;

  const operationsData: StaticMetaData.IBase['operations'] = [];
  if (Array.isArray(injectMetaData)) {
    injectMetaData.forEach((i) => {
      if (i.operations) {
        operationsData.push(...i.operations);
      }
    });
  } else if (injectMetaData.operations) {
    operationsData.push(...injectMetaData.operations);
  }
  if (operationsData.length === 0) return null;

  return (
    <div className="pointer-events-auto absolute -top-7 right-0 z-20 flex h-7 items-center bg-antDaybreakBlue-6 text-sm">
      {operationsData.map((v, key) => (
        <div
          onClick={v.onClick}
          key={key}
          className="relative flex h-full cursor-pointer items-center justify-center px-2 text-white after:absolute after:right-0 after:ml-2 after:h-3 after:w-[1px] after:bg-white/40 last:after:hidden"
        >
          {v.element}
        </div>
      ))}
    </div>
  );
};

TopOperations.OperationSelectParent = OperationSelectParent;
TopOperations.OperaionDeleteBase = OperaionDeleteBase;
TopOperations.OperationNewBase = OperationNewBase;

export default TopOperations;
