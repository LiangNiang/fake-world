import { Global, css } from "@emotion/react";
import { useCreation } from "ahooks";
import {
	type PropsWithChildren,
	type RefObject,
	createContext,
	memo,
	useContext,
	useMemo,
	useRef,
} from "react";
import { CSSTransition } from "react-transition-group";
import type { CSSTransitionProps } from "react-transition-group/CSSTransition";

type Props = {
	show: boolean;
};

type TStatusCallback = {
	eventName: string;
	fns: (() => void)[];
	setCallback: (fn: () => void) => () => void;
	removeCallback: (fn: () => void) => void;
	run: () => void;
};

interface IBottomPopupContext {
	nodeRef: RefObject<any>;
	enteringStatusCallback: TStatusCallback;
	enteredStatusCallback: TStatusCallback;
	exitStatusCallback: TStatusCallback;
	exitedStatusCallback: TStatusCallback;
	exitingStatusCallback: TStatusCallback;
}

const statusCallbackFactory = (eventName: string) => {
	const statusCallback: TStatusCallback = {
		eventName: "",
		fns: [],
		setCallback: function (fn: () => void) {
			this.fns.push(fn);
			return () => this.removeCallback(fn);
		},
		removeCallback: function (fn: () => void) {
			this.fns = this.fns.filter((f) => f !== fn);
		},
		run: function () {
			this.fns.forEach((fn) => fn());
		},
	};
	return {
		...statusCallback,
		eventName,
	};
};

const PopUpContext = createContext<IBottomPopupContext | null>(null);

export const usePopup = () => useContext(PopUpContext)!;

const WrappedChildren = ({ children }: PropsWithChildren) => {
	const { nodeRef } = usePopup();
	return <div ref={nodeRef}>{children}</div>;
};

const MemoWrappedChildren = memo(WrappedChildren);

const BottomPopup = ({
	children,
	show,
	...rest
}: PropsWithChildren<Props & Partial<CSSTransitionProps>>) => {
	const nodeRef = useRef(null);

	const enteringStatusCallback = useCreation(() => statusCallbackFactory("onEntering"), []);
	const enteredStatusCallback = useCreation(() => statusCallbackFactory("onEntered"), []);
	const exitStatusCallback = useCreation(() => statusCallbackFactory("onExit"), []);
	const exitedStatusCallback = useCreation(() => statusCallbackFactory("onExited"), []);
	const exitingStatusCallback = useCreation(() => statusCallbackFactory("onExiting"), []);

	const value: IBottomPopupContext = useMemo(
		() => ({
			nodeRef,
			enteringStatusCallback,
			enteredStatusCallback,
			exitStatusCallback,
			exitedStatusCallback,
			exitingStatusCallback,
		}),
		[],
	);

	return (
		<PopUpContext.Provider value={value}>
			<Global
				styles={css`
          .bottomPopup {
            &-enter {
              height: 0;
            }
            &-enter-active {
              height: 350px;
              transition: height linear 150ms;
            }
            &-enter-done {
              height: 350px;
            }
            &-exit {
              height: 0 !important;
              transition: height linear 150ms;
            }
          }
        `}
			/>
			<CSSTransition
				in={show}
				nodeRef={nodeRef}
				timeout={150}
				unmountOnExit
				classNames="bottomPopup"
				onEntering={() => {
					enteringStatusCallback.run();
				}}
				onEntered={() => {
					enteredStatusCallback.run();
				}}
				onExit={() => {
					exitStatusCallback.run();
				}}
				onExiting={() => {
					exitingStatusCallback.run();
				}}
				onExited={() => {
					exitedStatusCallback.run();
				}}
				{...rest}
			>
				<MemoWrappedChildren>{children}</MemoWrappedChildren>
			</CSSTransition>
		</PopUpContext.Provider>
	);
};

export default BottomPopup;
