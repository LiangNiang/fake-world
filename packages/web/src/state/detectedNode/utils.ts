import type { DataNode } from 'antd/es/tree';
import { getRecoil } from 'recoil-nexus';

import { activatedNodeState, INodeState } from './nodeState';
import { allNodesTreeState } from './treeState';

export interface TreeNode extends DataNode {
  id: string;
  children: TreeNode[];
  parent?: TreeNode;
  nodeTreeSort: boolean;
}

export function buildTree(nodes: INodeState[]): TreeNode[] {
  const idToTreeNodeAndNodeState: { [id: string]: [TreeNode, INodeState] } = {};
  const childToParent: { [id: string]: string } = {};

  nodes.forEach((node) => {
    idToTreeNodeAndNodeState[node.id] = [
      {
        id: node.id,
        key: node.id,
        children: [],
        nodeTreeSort: node.nodeTreeSort,
      },
      node,
    ];
  });

  nodes.forEach((node) => {
    let directParentNode = null;
    for (const otherNode of nodes) {
      if (node === otherNode) continue;
      const position = otherNode.domElement.compareDocumentPosition(node.domElement);
      if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if (!directParentNode || directParentNode.domElement.compareDocumentPosition(otherNode.domElement) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
          directParentNode = otherNode;
        }
      }
    }
    if (directParentNode) {
      childToParent[node.id] = directParentNode.id;
    }
  });

  for (const [childId, parentId] of Object.entries(childToParent)) {
    const [parentTreeNode] = idToTreeNodeAndNodeState[parentId];
    const [childTreeNode, childNodeState] = idToTreeNodeAndNodeState[childId];
    if (parentTreeNode && childTreeNode) {
      const insertIndex = parentTreeNode.children.findIndex(({ id }) => {
        const [, siblingNodeState] = idToTreeNodeAndNodeState[id];
        const position = siblingNodeState.domElement.compareDocumentPosition(childNodeState.domElement);
        return position & Node.DOCUMENT_POSITION_PRECEDING;
      });
      if (insertIndex === -1) {
        parentTreeNode.children.push(childTreeNode);
      } else {
        parentTreeNode.children.splice(insertIndex, 0, childTreeNode);
      }
      childTreeNode.parent = parentTreeNode;
    }
  }

  return Object.values(idToTreeNodeAndNodeState)
    .map(([treeNode]) => treeNode)
    .filter((treeNode) => !(treeNode.id in childToParent))
    .sort((a, b) => {
      const aDomElement = idToTreeNodeAndNodeState[a.id][1].domElement;
      const bDomElement = idToTreeNodeAndNodeState[b.id][1].domElement;
      const position = aDomElement.compareDocumentPosition(bDomElement);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      } else {
        return 0;
      }
    });
}

export function findNodeInTree(nodeId: string, nodeTree: TreeNode[]) {
  const findNode = (node: TreeNode): TreeNode | null => {
    if (node.id === nodeId) {
      return node;
    }
    for (const child of node.children) {
      const result = findNode(child);
      if (result) {
        return result;
      }
    }
    return null;
  };
  let targetNode: TreeNode | null = null;
  for (const rootNode of nodeTree) {
    targetNode = findNode(rootNode);
    if (targetNode) break;
  }
  return targetNode;
}

export function getActivatedNodeParent() {
  const activatedNode = getRecoil(activatedNodeState);
  if (activatedNode) {
    return findNodeInTree(activatedNode, getRecoil(allNodesTreeState))?.parent;
  }
}
