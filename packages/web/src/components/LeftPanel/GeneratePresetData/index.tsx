import { ENV_API_BASE_URL } from "@/consts";
import { randomTimeString } from "@/faker/helper";
import { generateFakeUser } from "@/faker/wechat/user";
import { setDialogueListValue } from "@/stateV2/dialogueList";
import { setAllProfilesValue } from "@/stateV2/profile";
import { useUnmount } from "ahooks";
import { experimental_useObject as useObject } from "ai/react";
import { App, Button } from "antd";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { removeAllUsers } from "./actions";

const GeneratePresetData = () => {
	const { t } = useTranslation();
	const { modal, message } = App.useApp();
	const {
		submit,
		isLoading: aiLoading,
		object,
		stop,
		error,
	} = useObject({
		api: `${ENV_API_BASE_URL}/api/v1/ai/preset_data`,
		schema: z.object({
			profiles: z
				.array(
					z.object({
						wechat: z.string(),
						nickname: z.string(),
						signature: z.string(),
						gender: z.enum(["male", "female"]),
					}),
				)
				.length(3),
		}),
	});

	useUnmount(() => {
		if (aiLoading) {
			stop();
			message.warning("生成已取消");
		}
	});

	useEffect(() => {
		console.log(object);
	}, [object]);

	const handleClick = () => {
		modal.confirm({
			title: t("menu.mainBlock.generatePresetDataConfirm"),
			onOk: () => {
				removeAllUsers();
				submit({});
				for (let i = 0; i < 3; i++) {
					const fakeUser = generateFakeUser();
					setAllProfilesValue((pv) => [...pv, fakeUser]);
					setDialogueListValue((pv) => [
						...pv,
						{
							id: nanoid(),
							friendId: fakeUser.id,
							lastMessage: "xxx",
							lastMessageTime: randomTimeString(),
						},
					]);
				}
			},
		});
	};

	return (
		<Button loading={aiLoading} onClick={handleClick}>
			{t("menu.mainBlock.beginGenerating")}
		</Button>
	);
};

export default GeneratePresetData;
