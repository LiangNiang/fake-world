import { useTimeout } from "ahooks";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Transition } from "react-transition-group";
import { twJoin } from "tailwind-merge";

import DoneFilledSVG from "@/assets/done-filled.svg?react";
import ErrorFilledSVG from "@/assets/error-filled.svg?react";

const ToastTypes = ["success", "error", "text"] as const;
type TToastType = (typeof ToastTypes)[number];

type ToastProps = {
	content: string;
	onExited?: () => void;
	type?: TToastType;
};

const transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 },
};

export const Toast = ({ content, onExited, type = "text" }: ToastProps) => {
	const [show, setShow] = useState(false);
	const nodeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setShow(true);
	}, []);

	useTimeout(() => {
		setShow(false);
	}, 1500);

	const withIcon = type === "error" || type === "success";

	const renderIcon = () => {
		switch (type) {
			case "error":
				return <ErrorFilledSVG fill="white" className="h-11 w-11 flex-shrink-0" />;
			case "success":
				return <DoneFilledSVG fill="white" className="h-11 w-11 flex-shrink-0" />;
			default:
				return null;
		}
	};

	return (
		<Transition nodeRef={nodeRef} in={show} timeout={300} onExited={() => onExited?.()}>
			{(state) => (
				<div
					style={{ ...transitionStyles[state as keyof typeof transitionStyles] }}
					ref={nodeRef}
					className={twJoin(
						"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex flex-col items-center bg-wechatBG-2 text-white opacity-0 transition-opacity duration-300",
						withIcon && "h-34 w-34 justify-around space-y-2 rounded-xl py-5",
						type === "text" && "min-w-[152px] max-w-[216px] rounded-lg py-3",
					)}
				>
					{renderIcon()}
					<div
						title={content}
						className={twJoin("line-clamp-2 px-3 text-center", type === "text" && "text-sm")}
					>
						{content}
					</div>
				</div>
			)}
		</Transition>
	);
};

let __isToastShowing__ = false;

export const showToast = ({ content, onExited, type }: ToastProps) => {
	if (__isToastShowing__) return;
	__isToastShowing__ = true;
	const container = document.createElement("div");
	container.id = "toast-container";
	document.body.appendChild(container);
	const root = createRoot(container);
	root.render(
		<Toast
			content={content}
			onExited={() => {
				setTimeout(() => {
					root.unmount();
					document.body.removeChild(container);
					__isToastShowing__ = false;
					onExited?.();
				});
			}}
			type={type}
		/>,
	);
};
