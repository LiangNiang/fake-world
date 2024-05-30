import type { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

import CloseOutlinedSVG from "@/assets/close-outlined.svg?react";
import HelpOutlinedSVG from "@/assets/help-outlined.svg?react";
import { type InjectProps, canBeDetected } from "@/components/NodeDetected";
import useModeNavigate from "@/components/useModeNavigate";

type Props = {
	topElement: ReactNode;
	columnElement: ReactNode;
	metaData: InjectProps["metaData"] | null;
};

const DetaiLayout = ({ topElement, columnElement, metaData }: Props) => {
	const navigate = useModeNavigate();

	return (
		<>
			<div className="flex justify-between px-4 py-2">
				<CloseOutlinedSVG
					fill="black"
					className="cursor-pointer"
					onClick={() => navigate("/wechat")}
				/>
				<div>全部账单</div>
			</div>
			<div className="flex flex-1 flex-col overflow-auto">
				<canBeDetected.div metaData={metaData ?? undefined}>
					<div className="mx-6 mt-8 flex flex-col items-center border-black/10 border-b pb-10">
						{topElement}
					</div>
					<div className="mx-6 my-6 flex flex-col space-y-2 text-sm">{columnElement}</div>
				</canBeDetected.div>
				<div className="flex flex-1 flex-col bg-[rgba(237,237,237,1)] text-sm">
					<div className="mt-1.5 bg-white px-6">
						<div className="border-black/10 border-b py-3">账单服务</div>
						<div className="grid grid-cols-2 py-3">
							<div className="flex items-center">
								<HelpOutlinedSVG fill="#7989AA" height={18} width={18} />
								<span className="ml-2 text-wechatLink-3">对此订单有疑惑</span>
							</div>
						</div>
					</div>
					<div className={twJoin("mt-auto mb-8 pt-8 text-center text-black/30 text-xs")}>
						本服务由财付通提供
					</div>
				</div>
			</div>
		</>
	);
};

export default DetaiLayout;
