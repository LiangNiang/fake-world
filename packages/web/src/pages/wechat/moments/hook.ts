import { isEmpty } from "lodash-es";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import type { InjectProps } from "@/components/NodeDetected";
import { MYSELF_ID } from "@/faker/wechat/user";
import { MetaDataType } from "@/state/detectedNode";
import { friendState } from "@/state/profile";

export const useProfileId = () => {
	const params = useParams<{ id: string }>();
	return isEmpty(params) || params.id === "my" ? MYSELF_ID : params.id!;
};

export const useProfile = () => {
	const id = useProfileId();
	const profile = useRecoilValue(friendState(id));
	return profile;
};

export const usePartMetaData = (): InjectProps["metaData"] => {
	const id = useProfileId();
	if (id === MYSELF_ID) {
		return {
			type: MetaDataType.MyProfile,
		};
	}
	return {
		type: MetaDataType.FirendProfile,
		index: id,
	};
};
