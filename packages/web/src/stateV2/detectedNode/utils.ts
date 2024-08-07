import { debounce } from "lodash-es";
import { type IStateNode, getActivatedNodeValueSnapshot } from "./nodeAtom";
import { type TreeNode, getAllNodesTreeValueSnapshot } from "./nodeTreeAtom";

export async function getActivatedNodeParent() {
	const activatedNode = getActivatedNodeValueSnapshot();
	const allNodesTree = await getAllNodesTreeValueSnapshot();
	if (activatedNode) {
		return findNodeInTree(activatedNode, allNodesTree)?.parent;
	}
}

export function buildTree(nodes: IStateNode[]): TreeNode[] {
	console.time("buildTree");
	const idToTreeNodeAndNodeState: { [id: string]: [TreeNode, IStateNode] } = {};
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
		const nodeDOM = document.getElementById(node.id);
		if (!nodeDOM) return;
		for (const otherNode of nodes) {
			const otherNodeDOM = document.getElementById(otherNode.id);
			if (node === otherNode || !otherNodeDOM) continue;
			const position = otherNodeDOM.compareDocumentPosition(nodeDOM);
			if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
				if (
					!directParentNode ||
					document.getElementById(directParentNode.id)!.compareDocumentPosition(otherNodeDOM) &
						Node.DOCUMENT_POSITION_CONTAINED_BY
				) {
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
				const siblingNodeDOM = document.getElementById(siblingNodeState.id)!;
				const childNodeDOM = document.getElementById(childNodeState.id)!;
				const position = siblingNodeDOM.compareDocumentPosition(childNodeDOM);
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

	const finalRes = Object.values(idToTreeNodeAndNodeState)
		.map(([treeNode]) => treeNode)
		.filter((treeNode) => !(treeNode.id in childToParent))
		.sort((a, b) => {
			const aDomElement = document.getElementById(idToTreeNodeAndNodeState[a.id][1].id);
			const bDomElement = document.getElementById(idToTreeNodeAndNodeState[b.id][1].id);
			if (!aDomElement || !bDomElement) {
				return 0;
			}
			const position = aDomElement.compareDocumentPosition(bDomElement);
			if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
				return -1;
			}
			if (position & Node.DOCUMENT_POSITION_PRECEDING) {
				return 1;
			}
			return 0;
		});

	console.timeEnd("buildTree");

	return finalRes;
}

export const debounceBuildTree = debounce(
	(payload: IStateNode[], callback: (result: TreeNode[]) => void) => {
		const res = buildTree(payload);
		callback(res);
	},
	300,
);

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
