import { canBeDetected } from "@/components/NodeDetected";
import { MYSELF_ID } from "@/faker/wechat/user";
import { MetaDataType } from "@/state/detectedNode";
import { type IStateFeed, userFeedListAtom } from "@/stateV2/moments";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { groupBy, isEmpty, keys } from "lodash-es";
import PersonalContent from "./Feed/PersonalContent";
import { useProfile } from "./hook";

enum TimeType {
	TODAY = "today",
	YESTERDAY = "yesterday",
}

const getTimeType = (timestamp: number) => {
	if (dayjs(timestamp).isToday()) {
		return TimeType.TODAY;
	}
	if (dayjs(timestamp).isYesterday()) {
		return TimeType.YESTERDAY;
	}
	return dayjs(timestamp).format("YYYY");
};

const PersonalMoments = () => {
	const { signature, id, momentsPrivacy } = useProfile();
	const userFeeds = useAtomValue(userFeedListAtom(id));
	const groupedFeeds = groupBy(
		userFeeds
			.slice()
			.sort((a, b) => b.sendTimestamp - a.sendTimestamp)
			.map((v) => ({ ...v, timeType: getTimeType(v.sendTimestamp) })),
		"timeType",
	);
	const todayFeeds = groupedFeeds[TimeType.TODAY] || [];
	const yesterdayFeeds = groupedFeeds[TimeType.YESTERDAY] || [];
	const allYearKeys = keys(groupedFeeds).filter(
		(v) => v !== TimeType.TODAY && v !== TimeType.YESTERDAY,
	);

	const getYearGroupedFeeds = (year: string) =>
		groupBy(groupedFeeds[year] ?? [], (v) => dayjs(v.sendTimestamp).format("MM-DD"));

	const renderGroupedDateFeeds = (
		data: Record<string, (IStateFeed & { timeType: ReturnType<typeof getTimeType> })[]>,
	) => {
		const dataKeys = keys(data);
		if (isEmpty(dataKeys)) return null;
		return dataKeys.map((k) => {
			const [M, D] = k.split("-");
			return (
				<div className="flex space-x-3" key={k}>
					<div className="w-16 font-bold">
						<span className="text-2xl">{D}</span>
						<span className="text-xs">{Number(M)}月</span>
					</div>
					<div className="flex flex-1 flex-col space-y-1">
						{data[k].map((v) => (
							<PersonalContent id={v.id} key={v.id} />
						))}
					</div>
				</div>
			);
		});
	};

	const renderBottomTipsContent = () => {
		switch (momentsPrivacy) {
			case "all":
				return <div className="mx-2 h-1 w-1 rounded-full bg-black/10" />;
			case "lastSixMonths":
				return <div className="mx-2 text-sm">朋友仅展示最近半年的朋友圈</div>;
			case "lastThreeDays":
				return <div className="mx-2 text-sm">朋友仅展示最近三天的朋友圈</div>;
			case "lastOneMonth":
				return <div className="mx-2 text-sm">朋友仅展示最近一个月的朋友圈</div>;
			default:
				return null;
		}
	};

	const notCurrentYearKeys = allYearKeys
		.filter((v) => !dayjs(v).isCurrentYear())
		.sort((a, b) => Number(b) - Number(a));
	const groupedCurrentYearFeeds = getYearGroupedFeeds(dayjs().format("YYYY"));

	return (
		<canBeDetected.div
			className="mt-6 flex flex-col pb-3"
			metaData={{
				type: MetaDataType.UserAllFeeds,
				index: id,
				treeItemDisplayName: (data) => `${data.nickname}的所有朋友圈`,
			}}
		>
			{!isEmpty(signature) && (
				<div className="break-words px-4 text-right text-black/60 text-sm">{signature}</div>
			)}
			<div className="mt-6 flex flex-col space-y-6">
				<div className="flex flex-col space-y-5 px-3">
					{!isEmpty(todayFeeds) && (
						<div className="flex space-x-3">
							<div className="w-16 font-bold text-2xl">今天</div>
							<div className="flex flex-1 flex-col space-y-1">
								{todayFeeds.map((v) => (
									<PersonalContent id={v.id} key={v.id} />
								))}
							</div>
						</div>
					)}
					{!isEmpty(yesterdayFeeds) && (
						<div className="flex space-x-3">
							<div className="w-16 font-bold text-2xl">昨天</div>
							<div className="flex flex-1 flex-col space-y-1">
								{yesterdayFeeds.map((v) => (
									<PersonalContent id={v.id} key={v.id} />
								))}
							</div>
						</div>
					)}
					{renderGroupedDateFeeds(groupedCurrentYearFeeds)}
				</div>
				{notCurrentYearKeys.map((y) => {
					const groupedYearData = getYearGroupedFeeds(y);
					return (
						<div key={y}>
							<div className="px-2 font-bold text-3xl">{y}年</div>
							<div className="mt-6 flex flex-col space-y-5 px-3">
								{renderGroupedDateFeeds(groupedYearData)}
							</div>
						</div>
					);
				})}
				<canBeDetected.div
					className="flex items-center justify-center py-4"
					metaData={
						id === MYSELF_ID
							? {
									type: MetaDataType.MyProfile,
									treeItemDisplayName: "允许朋友查看朋友圈的范围",
								}
							: {
									type: MetaDataType.FirendProfile,
									index: id,
									treeItemDisplayName: "允许朋友查看朋友圈的范围",
								}
					}
				>
					<div className="h-[1px] w-8 bg-black/10" />
					{renderBottomTipsContent()}
					<div className="h-[1px] w-8 bg-black/10" />
				</canBeDetected.div>
			</div>
		</canBeDetected.div>
	);
};

export default PersonalMoments;
