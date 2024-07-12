import { getModeValueSnapshot } from "@/stateV2/mode";
import { showToast } from "@/wechatComponents/Toast";
import { noop } from "lodash-es";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { type NavigateFunction, useNavigate } from "react-router-dom";

type Options = {
	errorMsg?: string;
	silence?: boolean;
};

export default function useModeNavigate(options?: Options): NavigateFunction {
	const { t, i18n } = useTranslation();
	const { errorMsg = t("base.safeNavigateNotice"), silence = false } = options ?? {};
	const baseNavigate = useNavigate();

	const navigate = useCallback(
		(...args: Parameters<NavigateFunction>) => {
			if (getModeValueSnapshot() === "edit") {
				!silence &&
					showToast({
						type: "error",
						content: errorMsg,
					});
				return noop;
			}
			return baseNavigate(...args);
		},
		[i18n.language],
	);

	return navigate as NavigateFunction;
}
