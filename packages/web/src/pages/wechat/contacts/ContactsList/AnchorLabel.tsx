import { otherS, starS } from "@/stateV2/profile";
import { isSymbol } from "lodash-es";
import { forwardRef, memo } from "react";
import { useTranslation } from "react-i18next";
import { twJoin } from "tailwind-merge";

type Props = {
	labelKey: string;
	labelTitle: string | symbol;
	isStuck: boolean;
	isBeforeStuck: boolean;
};

const AnchorLabel = forwardRef<HTMLDivElement, Props>(
	({ labelKey, labelTitle, isStuck, isBeforeStuck }, ref) => {
		const { t } = useTranslation();

		const renderTitle = () => {
			if (isSymbol(labelTitle)) {
				switch (labelTitle) {
					case starS:
						return <span>&#x2606; {t("wechatPage.contacts.starred")}</span>;
					case otherS:
						return <span>#</span>;
					default:
						return null;
				}
			}
			return <span>{labelTitle}</span>;
		};

		return (
			<>
				<div id={labelKey} className="mt-4" />
				<div
					data-key={labelKey}
					className={twJoin(
						"sticky top-0 z-40 mb-1 ml-4 h-6 bg-white py-[2px] font-medium text-black/60 text-sm",
						isStuck && "z-50 border-black/5 border-b",
						isBeforeStuck && "border-black/5 border-b",
					)}
					ref={ref}
				>
					{renderTitle()}
				</div>
			</>
		);
	},
);

AnchorLabel.displayName = "AnchorLabel";

export default memo(AnchorLabel);
