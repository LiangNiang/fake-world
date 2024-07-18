import { memo } from "react";
import MetaDataEditor from "../MetaDataEditor";

const RightPanel = () => {
	return (
		<div className="flex h-screen flex-col max-lg:hidden">
			<div className="flex-1 overflow-auto border-orange-400 border-y border-dashed p-4">
				<div>
					<MetaDataEditor />
				</div>
			</div>
		</div>
	);
};

export default memo(RightPanel);
