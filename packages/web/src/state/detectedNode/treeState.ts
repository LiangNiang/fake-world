import { values } from 'lodash-es';
import { DefaultValue, selector } from 'recoil';

import { allNodesState } from '.';
import { buildTree } from './utils';

/** allNodesState 派生为树结构 */
export const allNodesTreeState = selector({
  key: 'allNodesTreeState',
  get: ({ get }) => {
    const allNodes = get(allNodesState);
    return buildTree(values(allNodes));
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(allNodesState, (pv) => ({
        ...pv,
      }));
    }
  },
});
