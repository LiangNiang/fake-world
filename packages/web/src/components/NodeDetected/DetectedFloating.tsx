import {
	FloatingOverlay,
	FloatingPortal,
	type Middleware,
	autoUpdate,
	detectOverflow,
	size,
	useFloating,
} from "@floating-ui/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { twJoin } from "tailwind-merge";

import TopOperations from "@/components/TopOperations";
import { activatedNodeState, hoverdNodeState } from "@/state/detectedNode";

type ActivatedBorderProps = {
	element: Element;
	type: "hover" | "activated";
	nodeId: string;
};

const screenOverflow: Middleware = {
	name: "screenOverflow",
	fn: async (state) => {
		const boundary = document.getElementById("screen")!;
		const overflow = await detectOverflow(state, {
			boundary,
			elementContext: "reference",
		});
		const { top, bottom } = overflow;
		const topClipped = top >= 0;
		const bottomClipped = bottom >= 0;
		const allClipped = topClipped && bottomClipped;
		const unClipped = !topClipped && !bottomClipped;

		return {
			data: {
				overflow,
				topClipped,
				bottomClipped,
				allClipped,
				unClipped,
				offsetTop: boundary.offsetTop,
				screenHeight: boundary.clientHeight,
				completelyHidden: bottom > boundary.offsetTop,
			},
		};
	},
};

const DetectedOverlay = ({ element, type, nodeId }: ActivatedBorderProps) => {
	const { floatingStyles, refs, elements } = useFloating({
		elements: {
			reference: element,
		},
		placement: "top-start",
		middleware: [
			screenOverflow,
			size({
				apply: ({ elements, middlewareData }) => {
					const { overflow } = middlewareData.screenOverflow;
					const clipTop = overflow.top;
					const clipBottom = overflow.bottom;
					const needClip = clipTop > 0 || clipBottom > 0;
					Object.assign(elements.floating.style, {
						clipPath: needClip
							? `inset(${clipTop > 0 ? clipTop : -28}px 0 ${clipBottom}px 0)`
							: "unset",
					});
				},
			}),
		],
		whileElementsMounted: autoUpdate,
	});

	const elementRect = elements.reference!.getBoundingClientRect();

	const operaionsElement = useMemo(() => {
		return <TopOperations nodeId={nodeId} />;
	}, [nodeId]);

	return (
		<FloatingPortal>
			<FloatingOverlay
				className={twJoin(
					"!overflow-hidden pointer-events-none h-screen w-screen",
					type === "activated" && "z-200",
					type === "hover" && "z-40",
				)}
			>
				<div
					ref={refs.setFloating}
					className={twJoin(
						"-outline-offset-2 outline outline-2",
						type === "activated" && "outline-antDaybreakBlue-6",
						type === "hover" && "outline-dashed outline-antDaybreakBlue-3",
					)}
					style={{
						...floatingStyles,
						width: elementRect.width,
						height: elementRect.height,
						top: elementRect.height,
					}}
				>
					{type === "activated" && operaionsElement}
				</div>
			</FloatingOverlay>
		</FloatingPortal>
	);
};

const DetectedOverall = () => {
	const activatedNode = useRecoilValue(activatedNodeState);
	const hoverdNode = useRecoilValue(hoverdNodeState);

	const activatedBorder = useMemo(() => {
		if (activatedNode) {
			const element = document.getElementById(activatedNode);
			if (!element) return null;
			return <DetectedOverlay type="activated" element={element} nodeId={activatedNode} />;
		}
	}, [activatedNode]);

	const hoverdBorder = useMemo(() => {
		if (hoverdNode && hoverdNode !== activatedNode) {
			const element = document.getElementById(hoverdNode);
			if (!element) return null;
			return <DetectedOverlay type="hover" element={element} nodeId={hoverdNode} />;
		}
	}, [hoverdNode]);

	return (
		<>
			{activatedBorder}
			{hoverdBorder}
		</>
	);
};

export default DetectedOverall;
