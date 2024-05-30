import { getRecoil, resetRecoil, setRecoil } from "recoil-nexus";

import { type IProfile, friendState, friendsIdsState } from "@/state/profile";

import { generaterFakeUser, randomUserId } from "./generator";

type options = {
	insertType?: "after" | "before";
};

export function addFakeUser(
	preData: Partial<IProfile> = {},
	options: options = {
		insertType: "after",
	},
) {
	const { insertType } = options;
	const id = randomUserId();
	setRecoil(friendsIdsState, (prev) => (insertType === "after" ? [...prev, id] : [id, ...prev]));
	const profile = generaterFakeUser({ ...preData, id, createdByFaker: true });
	setRecoil(friendState(id), profile);
}

export function quickAddFakeUser(num = 20) {
	for (let i = 0; i < num; i++) {
		addFakeUser();
	}
}

export function removeFakeUsers() {
	const ids = getRecoil(friendsIdsState);
	const needRemoveIds: IProfile["id"][] = [];
	ids.forEach((id) => {
		const profile = getRecoil(friendState(id));
		if (profile.createdByFaker) {
			needRemoveIds.push(id);
			setRecoil(friendState(id), (v) => v);
			resetRecoil(friendState(id));
		}
	});
	setRecoil(friendsIdsState, (prev) => prev.filter((id) => !needRemoveIds.includes(id)));
}
