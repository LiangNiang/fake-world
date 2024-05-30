import { App, Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { imageDBManager } from "@/dataSource";
import { deleteDataSource, uploadDataSource } from "@/services";
import { type IDataSourceItem, dataSourceListState } from "@/state/globalConfig";

type Props = {
	record: IDataSourceItem;
};

const ShareOperation = ({ record }: Props) => {
	const [loading, setLoading] = useState(false);
	const { message } = App.useApp();
	const setDataSourceList = useSetRecoilState(dataSourceListState);
	const { t } = useTranslation();

	const { shareKey, shareId, id } = record;
	const shared = !!shareKey;

	const deleteShare = async () => {
		if (!shareId) return;
		try {
			await deleteDataSource(shareId);
			setDataSourceList((prev) =>
				prev.map((item) =>
					item.id === record.id ? { ...item, shareId: undefined, shareKey: undefined } : item,
				),
			);
			message.success(t("base.success"));
		} catch (err) {
			console.error(err);
			message.error(t("base.fail"));
		}
	};

	const createShare = async () => {
		const file = await imageDBManager.exportDBById(id);
		try {
			const res = await uploadDataSource({
				data: localStorage.getItem(id) ?? "{}",
				file,
			});
			const { shareKey, shareId } = res.data;
			setDataSourceList((prev) =>
				prev.map((item) => (item.id === id ? { ...item, shareKey, shareId } : item)),
			);
			message.success(t("base.success"));
		} catch (err) {
			console.error(err);
			message.error(t("base.fail"));
		}
	};

	const handleClick = async () => {
		setLoading(true);
		if (shared) {
			await deleteShare();
		} else {
			await createShare();
		}
		setLoading(false);
	};

	return (
		<Button type="link" loading={loading} className="px-2 py-1" onClick={handleClick}>
			{shared
				? t("menu.dataSourceManage.operation.unShare")
				: t("menu.dataSourceManage.operation.share")}
		</Button>
	);
};

export default ShareOperation;
