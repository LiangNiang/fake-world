import { App as AntdApp } from "antd";
import type { TFunction } from "i18next";
import { Navigate, type RouteObject, type UIMatch } from "react-router-dom";

import App from "@/App";
import ShareEntry from "@/pages/share";
import Contacts from "@/pages/wechat/contacts";
import Conversation from "@/pages/wechat/conversation";
import Discover from "@/pages/wechat/discover";
import Friend from "@/pages/wechat/friend";
import WechatIndex from "@/pages/wechat/index";
import MomentsIndex from "@/pages/wechat/moments";
import MomentDetail from "@/pages/wechat/moments/Detail";
import MomentsLayout from "@/pages/wechat/moments/Layout";
import PersonalMoments from "@/pages/wechat/moments/Personal";
import My from "@/pages/wechat/my";
import ProfileEdit from "@/pages/wechat/my/profile-edit";
import Service from "@/pages/wechat/service";
import DetailAdapter from "@/pages/wechat/transaction";
import Wallet from "@/pages/wechat/wallet";
import Balance from "@/pages/wechat/wallet/Balance";
import { BUILT_IN_TRANSACTION_TYPES_LABELS } from "@/state/transaction";

export interface ICommonRouteHandle {
	label?: string | ((params: UIMatch["params"], t: TFunction) => string);
}

export const routes: RouteObject[] = [
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate replace to="/wechat" />,
			},
			{
				path: "wechat",
				handle: {
					label: "app.wechat",
				},
				children: [
					{
						index: true,
						element: <WechatIndex />,
						handle: {
							label: "routerLabel.wechat.index",
						},
					},
					{
						path: "conversation/:id",
						element: <Conversation />,
						handle: {
							label: "routerLabel.wechat.cHistory",
						},
					},
					{
						path: "my",
						handle: {
							label: "routerLabel.wechat.my",
						},
						children: [
							{
								index: true,
								element: <My />,
							},
							{
								path: "profile-edit",
								element: <ProfileEdit />,
								handle: {
									label: "routerLabel.wechat.profileEdit",
								},
							},
						],
					},
					{
						path: "service",
						handle: {
							label: "routerLabel.wechat.services",
						},
						element: <Service />,
					},
					{
						path: "wallet",
						handle: {
							label: "routerLabel.wechat.wallet",
						},
						children: [
							{
								index: true,
								element: <Wallet />,
							},
							{
								path: "balance",
								element: <Balance />,
								handle: {
									label: "routerLabel.wechat.balance",
								},
							},
						],
					},
					{
						path: "discover",
						handle: {
							label: "routerLabel.wechat.discover",
						},
						children: [
							{
								index: true,
								element: <Discover />,
							},
						],
					},
					{
						path: "contacts",
						handle: {
							label: "routerLabel.wechat.contacts",
						},
						children: [
							{
								index: true,
								element: <Contacts />,
							},
						],
					},
					{
						path: "moments",
						element: <MomentsLayout />,
						handle: {
							label: "routerLabel.wechat.moments",
						},
						children: [
							{
								index: true,
								element: <MomentsIndex />,
							},
							{
								path: "user/:id",
								element: <PersonalMoments />,
								handle: {
									label: "routerLabel.wechat.personalMoments",
								},
							},
						],
					},
					{
						path: "moments/:id",
						element: <MomentDetail />,
						handle: {
							label: "routerLabel.wechat.momentDetail",
						},
					},
					{
						path: "friend",
						handle: {
							label: "routerLabel.wechat.user",
						},
						children: [
							{
								path: ":id",
								element: <Friend />,
							},
						],
					},
					{
						path: "transaction",
						handle: {
							label: "routerLabel.wechat.transaction",
						},
						children: [
							{
								path: ":type",
								element: <DetailAdapter />,
								handle: {
									label: (p: UIMatch["params"], t: TFunction) =>
										t(
											BUILT_IN_TRANSACTION_TYPES_LABELS[
												p.type as keyof typeof BUILT_IN_TRANSACTION_TYPES_LABELS
											],
										),
								},
							},
						],
					},
				],
			},
		],
	},
	{
		path: "/s/:shareKey",
		element: (
			<AntdApp>
				<ShareEntry />
			</AntdApp>
		),
	},
	// {
	//   path: '/screenshot',
	//   element: <ScreenshotApp />,
	// },
];
