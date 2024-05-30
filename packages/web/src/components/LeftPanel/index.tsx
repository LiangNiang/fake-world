import { BarsOutlined, CodepenOutlined, GithubOutlined, HomeOutlined } from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { memo } from "react";
import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { EMenus, menuState } from "@/state/globalConfig";

import CodeMenu from "./CodeMenu";
import CommonBlock from "./CommonBlock";
import MainMenu from "./MainMenu";
import TreesMenu from "./TreesMenu";

const LeftPanel = () => {
	const [menu, setMenu] = useRecoilState(menuState);
	const { t } = useTranslation();

	const MENU_ITEMS: MenuProps["items"] = [
		{
			key: EMenus.Main,
			icon: <HomeOutlined />,
			title: t("menu.main"),
		},
		{
			key: EMenus.Trees,
			icon: <BarsOutlined />,
			title: t("menu.trees"),
		},
		{
			key: EMenus.Code,
			icon: <CodepenOutlined />,
			title: t("menu.dataSource"),
		},
		{
			key: EMenus.Git,
			icon: <GithubOutlined />,
			title: "Github",
		},
	];

	return (
		<div className="flex h-screen flex-col pt-4 pr-4" id="left-panel">
			<div className="flex flex-1 overflow-hidden">
				<Menu
					onSelect={({ selectedKeys }) => {
						const value = selectedKeys[0] as EMenus;
						if (value === EMenus.Git) {
							window.open("https://github.com/LiangNiang/fake-world");
							return;
						}
						setMenu(value);
					}}
					style={{ width: "64px" }}
					selectedKeys={[menu]}
					items={MENU_ITEMS}
					mode="inline"
					inlineCollapsed
				/>
				<div className="flex flex-1 flex-col overflow-auto px-4 pt-2">
					<CommonBlock />
					{menu === EMenus.Main && <MainMenu />}
					{menu === EMenus.Trees && <TreesMenu />}
					{menu === EMenus.Code && <CodeMenu />}
				</div>
			</div>
			<div className="mt-auto p-4">
				<Marquee
					className="flex space-x-4 text-gray-500 text-sm"
					pauseOnHover
					pauseOnClick
					speed={30}
				>
					Powered by&nbsp;
					<a
						href="https://react.dev/"
						target="_blank"
						rel="noreferrer"
						className="text-antDaybreakBlue-5"
					>
						React
					</a>
					&nbsp;&&nbsp;
					<a
						href="https://recoiljs.org/"
						target="_blank"
						rel="noreferrer"
						className="text-antDaybreakBlue-5"
					>
						Recoil
					</a>
					&nbsp;&&nbsp;
					<a
						href="https://tailwindcss.com/"
						target="_blank"
						rel="noreferrer"
						className="text-antDaybreakBlue-5"
					>
						Tailwind CSS
					</a>
					&nbsp;&&nbsp;
					<a
						href="https://ant.design/"
						target="_blank"
						rel="noreferrer"
						className="text-antDaybreakBlue-5"
					>
						Antd
					</a>
					,&nbsp;Built with&nbsp;
					<a
						href="https://vitejs.cn/"
						target="_blank"
						rel="noreferrer"
						className="text-antDaybreakBlue-5"
					>
						Vite
					</a>
					.&nbsp;Author:&nbsp;
					<span>liangniangbaby@gmail.com</span>
				</Marquee>
			</div>
		</div>
	);
};

export default memo(LeftPanel);
