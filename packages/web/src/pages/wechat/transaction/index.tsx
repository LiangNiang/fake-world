import { useParams } from "react-router-dom";

import { BUILT_IN_TRANSACTION_TYPES, type TTransactionType } from "@/state/transaction";
import { showToast } from "@/wechatComponents/Toast";

import { buildDetailComponent } from "./builder";

const DetailAdapter = () => {
	const { type } = useParams<{ type: TTransactionType }>();

	const typeVaild = BUILT_IN_TRANSACTION_TYPES.includes(type as TTransactionType);

	if (!typeVaild) {
		showToast({
			type: "error",
			content: "无效的账单类型",
		});
		return <></>;
	}

	return buildDetailComponent(type as TTransactionType);
};

export default DetailAdapter;
