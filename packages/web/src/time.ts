import type { PluginFunc } from "dayjs";
import dayjs from "dayjs";
import en from "dayjs/locale/en";
import zhCN from "dayjs/locale/zh-cn";
import zhTW from "dayjs/locale/zh-tw";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";

import { getCurrentLanguage } from "./i18n";

export const LOCALE_MAP = {
	"zh-CN": zhCN,
	"en-US": en,
	"zh-TW": zhTW,
};

const isCurrentYear: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
	dayjsClass.prototype.isCurrentYear = function () {
		const comparisonTemplate = "YYYY";
		const now = dayjsFactory();
		return this.format(comparisonTemplate) === now.format(comparisonTemplate);
	};
};

export const initDayjs = () => {
	const curLang = getCurrentLanguage();
	dayjs.locale(LOCALE_MAP[curLang as keyof typeof LOCALE_MAP]);
	dayjs.extend(updateLocale);
	dayjs.extend(isToday);
	dayjs.extend(isYesterday);
	dayjs.extend(relativeTime);
	dayjs.extend(isCurrentYear);
	dayjs.extend(weekday);
};
