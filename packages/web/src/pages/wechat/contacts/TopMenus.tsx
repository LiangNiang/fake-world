import { css } from "@emotion/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import List from "@/wechatComponents/List";

import GroupChatIMG from "./assets/group-chat.png";
import NewIMG from "./assets/new.png";
import OfficialIMG from "./assets/official.png";
import OnlyChatIMG from "./assets/only-chat.png";
import TagIMG from "./assets/tag.png";

const TopMenus = () => {
	const { t } = useTranslation();

	return (
		<List className="relative after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-black/10 after:border-t">
			<List.Item
				textPrevClassName="ml-4"
				textPrev={
					<div
						className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
						css={css`
              background-image: url(${NewIMG});
            `}
					/>
				}
			>
				{t("wechatPage.contacts.new")}
			</List.Item>
			<List.Item
				textPrevClassName="ml-4"
				textPrev={
					<div
						className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
						css={css`
              background-image: url(${OnlyChatIMG});
            `}
					/>
				}
			>
				{t("wechatPage.contacts.chatsOnly")}
			</List.Item>
			<List.Item
				textPrevClassName="ml-4"
				textPrev={
					<div
						className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
						css={css`
              background-image: url(${GroupChatIMG});
            `}
					/>
				}
			>
				{t("wechatPage.contacts.group")}
			</List.Item>
			<List.Item
				textPrevClassName="ml-4"
				textPrev={
					<div
						className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
						css={css`
              background-image: url(${TagIMG});
            `}
					/>
				}
			>
				{t("wechatPage.contacts.tags")}
			</List.Item>
			<List.Item
				textPrevClassName="ml-4"
				textPrev={
					<div
						className="mr-3 h-9 w-9 rounded bg-cover bg-repeat-round"
						css={css`
              background-image: url(${OfficialIMG});
            `}
					/>
				}
			>
				{t("wechatPage.contacts.official")}
			</List.Item>
		</List>
	);
};

export default memo(TopMenus);
