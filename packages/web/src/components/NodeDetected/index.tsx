import { useMergeRefs } from "@floating-ui/react";
import { useUpdateEffect } from "ahooks";
import { isArray, omit } from "lodash-es";
import {
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
	type Ref,
	memo,
	useCallback,
	useEffect,
	useId,
	useRef,
} from "react";
import { getRecoil, resetRecoil, setRecoil } from "recoil-nexus";
import Sortable from "sortablejs";

import {
	activatedNodeState,
	flag2State,
	hoverdNodeState,
	nodeDataState,
	nodeInjectMetaState,
} from "@/state/detectedNode";
import type { StaticMetaData } from "@/state/detectedNode/typing";

import useMode from "../useMode";

export type InjectProps = {
	metaData?: StaticMetaData.InjectMetaData | StaticMetaData.InjectMetaData[];
	nodeTreeSort?: boolean;
};

type PropsAreEqual<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean;

function canBeDetected<T extends object>(
	component: {
		(props: T): Exclude<ReactNode, undefined>;
		displayName?: string;
	},
	propsAreEqual?: PropsAreEqual<T> | false,
	componentName = component.displayName ?? component.name,
) {
	const NodeDetected = (
		props: InjectProps & T & HTMLAttributes<void> & { innerRef?: Ref<any> },
	) => {
		const { metaData: injectMetaData, innerRef, id: preId } = props;
		const id = preId ?? useId();
		const divRef = useRef<Element>(null);
		const mergedRef = useMergeRefs([divRef, innerRef]);
		const { isPreview } = useMode();

		const mapCompared = (v?: StaticMetaData.InjectMetaData) => ({
			type: v?.type,
			index: v?.index,
			operations: v?.operations?.map((o) => o.key ?? "") ?? [],
		});
		const comparedInjectMetaData = isArray(injectMetaData)
			? injectMetaData.map(mapCompared)
			: mapCompared(injectMetaData);

		useEffect(() => {
			setRecoil(flag2State, false);
			setTimeout(() => {
				if (divRef.current) {
					setRecoil(nodeInjectMetaState(id), injectMetaData);
					setRecoil(nodeDataState(id), {
						id,
						domElement: divRef.current,
						nodeTreeSort: !!props.nodeTreeSort,
					});
				}
			});
			return () => {
				setRecoil(flag2State, false);
				setTimeout(() => {
					resetRecoil(nodeDataState(id));
					if (getRecoil(activatedNodeState) === id) {
						resetRecoil(activatedNodeState);
					}
				});
			};
		}, []);

		useUpdateEffect(() => {
			setRecoil(nodeInjectMetaState(id), injectMetaData);
		}, [JSON.stringify(comparedInjectMetaData)]);

		const onClick = useCallback((ev: MouseEvent) => {
			ev.stopPropagation();
			setRecoil(activatedNodeState, id);
		}, []);

		const onMouseLeave = useCallback((ev: MouseEvent) => {
			if (Sortable.active) return;
			ev.stopPropagation();
			setRecoil(hoverdNodeState, null);
		}, []);

		const onMouseOver = useCallback((ev: MouseEvent) => {
			if (Sortable.active) return;
			ev.stopPropagation();
			setRecoil(hoverdNodeState, id);
		}, []);

		const fp = omit(props, ["metaData", "innerRef", "nodeTreeSort"]);

		if (isPreview) {
			return component({
				...(fp as T & HTMLAttributes<void>),
				ref: mergedRef,
				id,
				"nd-id": id,
			}) as JSX.Element;
		}

		return component({
			...(fp as T & HTMLAttributes<void>),
			ref: mergedRef,
			"nd-id": id,
			id,
			onMouseLeave,
			onMouseOver,
			onClick,
		}) as JSX.Element;
	};

	NodeDetected.displayName = `NodeDetected(${componentName})`;

	const wrappedComponent =
		propsAreEqual === false ? NodeDetected : memo(NodeDetected, propsAreEqual);

	return wrappedComponent as typeof NodeDetected;
}

canBeDetected.div = canBeDetected((props) => <div {...props} />);
canBeDetected.section = canBeDetected((props) => <section {...props} />);
canBeDetected.span = canBeDetected((props) => <span {...props} />);

export { canBeDetected };
