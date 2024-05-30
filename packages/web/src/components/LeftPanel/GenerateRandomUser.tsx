import { DeleteOutlined } from "@ant-design/icons";
import { App, Button } from "antd";
import { useTranslation } from "react-i18next";
import { getRecoil } from "recoil-nexus";

import { quickAddFakeUser, removeFakeUsers } from "@/faker/wechat/user";
import { friendsIdsState } from "@/state/profile";

const GenerateRandomUser = () => {
	const { message, modal } = App.useApp();
	const { t } = useTranslation();

	return (
		<Button.Group>
			<Button
				onClick={() => {
					requestIdleCallback(() => {
						if (getRecoil(friendsIdsState).length > 300) {
							message.error(t("menu.mainBlock.friendsLimitedError"));
							return;
						}
						quickAddFakeUser(50);
						message.success(t("base.success"));
					});
				}}
			>
				+ 50
			</Button>
			<Button
				onClick={() => {
					modal.confirm({
						title: t("menu.mainBlock.clearFriends"),
						onOk: () => {
							removeFakeUsers();
							message.success(t("base.success"));
						},
					});
				}}
				danger
				icon={<DeleteOutlined />}
			/>
		</Button.Group>
	);
};

export default GenerateRandomUser;
