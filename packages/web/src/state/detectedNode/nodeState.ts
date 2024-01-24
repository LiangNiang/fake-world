import { isArray, isEmpty } from 'lodash-es';
import { atom, atomFamily, DefaultValue, selectorFamily } from 'recoil';

import { ListTaskManager, nodeRuntimeState } from '.';
import { OverallMetaData, StaticMetaData } from './typing';

export interface IAllNodeState {
  [key: string]: INodeState;
}
/** 所有的可探测节点集合 */
export const allNodesState = atom<IAllNodeState>({
  key: 'allNodesState',
  default: {},
});

export interface INodeState {
  id: string;
  domElement: Element;
  injectMetaData?: StaticMetaData.InjectMetaData | StaticMetaData.InjectMetaData[];
  freshData?: OverallMetaData.OverallData | OverallMetaData.OverallData[];
  nodeTreeSort: boolean;
}

export const nodeInjectMetaState = atomFamily<INodeState['injectMetaData'], INodeState['id']>({
  key: 'nodeInjectMetaState',
  default: undefined,
});

export const nodeFreshDataState = selectorFamily<INodeState['freshData'], INodeState['id']>({
  key: 'nodeFreshDataState',
  get:
    (param) =>
    ({ get }) => {
      const metaData = get(nodeInjectMetaState(param));
      if (isEmpty(metaData)) return undefined;
      const getSingleFreshData = (metaData: StaticMetaData.InjectMetaData) =>
        get(
          nodeRuntimeState({
            type: metaData.type,
            index: metaData.index,
          })
        );
      if (isArray(metaData)) {
        return metaData.map((m) => getSingleFreshData(m));
      } else {
        return getSingleFreshData(metaData);
      }
    },
});

export const nodeDataState = selectorFamily<INodeState | null, INodeState['id']>({
  key: 'nodeState',
  get:
    (param) =>
    ({ get }) => {
      const node = get(allNodesState)[param];
      if (!node) return null;
      const injectMetaData = get(nodeInjectMetaState(param));
      const freshData = get(nodeFreshDataState(param));
      return {
        ...get(allNodesState)[param],
        freshData,
        injectMetaData,
      };
    },
  set: (param) => (_, newValue) => {
    if (param) {
      const listTaskManager = ListTaskManager.getInstace();
      if (newValue instanceof DefaultValue) {
        listTaskManager.addDeleteTask(param);
      } else {
        listTaskManager.addInsertTask({
          key: param,
          payload: newValue,
        });
      }
    }
  },
});

export const hoverdNodeState = atom<string | null>({
  key: 'hoverdNodeState',
  default: null,
});

export const activatedNodeState = atom<string | null>({
  key: 'activatedNodeState',
  default: null,
});
