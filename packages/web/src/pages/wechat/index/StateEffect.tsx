import { dialogueListState } from "@/state/dialogueState";
import { useRecoilValue } from "recoil";

const StateEffect = () => {
	const dialogueList = useRecoilValue(dialogueListState);

	// useEffect(() => {
	// 	if (totalUnreadCount.calcuateType === CalcuateType.AUTO) {
	// 		const count = dialogueList.reduce((acc, dialogue) => {
	// 			if (
	// 				!dialogue.badgeHide &&
	// 				dialogue.unreadDisplayType !== "dot" &&
	// 				isNumber(dialogue.unreadMarkNumber)
	// 			) {
	// 				return acc + dialogue.unreadMarkNumber;
	// 			}
	// 			return acc;
	// 		}, 0);
	// 		setTotalUnreadCount((v) => ({
	// 			...v,
	// 			count,
	// 		}));
	// 	}
	// }, [dialogueList]);

	// useEffect(() => {
	// 	setBtmNavbars((pv) => ({
	// 		...pv,
	// 		WECHAT: {
	// 			...pv.WECHAT,
	// 			badgeNumber: totalUnreadCount.count,
	// 		},
	// 	}));
	// }, [totalUnreadCount]);

	return <></>;
};

export default StateEffect;
