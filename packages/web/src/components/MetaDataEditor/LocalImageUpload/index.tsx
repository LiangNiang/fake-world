import { DeleteTwoTone } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { isArray } from "lodash-es";
import { type ChangeEvent, useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import HashAssets from "@/components/HashAssets";
import { imageDB } from "@/dataSource";
import { getFileMD5 } from "@/utils";

type Props = {
	onChange?: (v: string | string[]) => void;
	value?: string | string[];
	maxImagesCount?: number;
};

const saveFileToDB = async (file: File) => {
	const hash = await getFileMD5(file);

	await imageDB.images.put({
		id: hash,
		file,
	});
	return hash;
};

const isMultipleFiles = (value: string | string[] | undefined): value is string[] => isArray(value);

const LocalImageUploadWithPreview = ({ value, onChange, maxImagesCount, ...rest }: Props) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [previewFileSrc, setPreviewFileSrc] = useState<string | string[] | undefined>(value);

	const isMultiple = isMultipleFiles(value);
	const inputDisabled = isMultiple ? value?.length === maxImagesCount : false;

	const handleInputChange = async (ev: ChangeEvent<HTMLInputElement>) => {
		if (isMultiple) {
			const hashList: string[] = [];
			const files = Array.from(ev.target.files || []);
			if (files.length + (value as string[]).length > maxImagesCount!) {
				messageApi.error(`最多上传${maxImagesCount}张图片`);
				return;
			}
			setPreviewFileSrc((prev) => [
				...(prev as string),
				...files.map((v) => URL.createObjectURL(v)),
			]);
			for (const file of files) {
				const hash = await saveFileToDB(file);
				hashList.push(hash);
			}
			onChange?.([...value, ...hashList]);
		} else {
			const file = ev.target.files?.item(0);
			if (file) {
				setPreviewFileSrc(URL.createObjectURL(file));
				const hash = await saveFileToDB(file);
				onChange?.(hash);
			}
		}
	};

	const mappedSortableListData = useMemo(() => {
		if (isArray(value)) return value.map((v) => ({ id: v }));
	}, [value]);

	return (
		<div className="flex flex-col">
			{contextHolder}
			<Input
				{...rest}
				type="file"
				multiple={isMultiple}
				onChange={handleInputChange}
				disabled={inputDisabled}
			/>
			<div className="mt-2">
				{isMultiple ? (
					<ReactSortable
						className="flex flex-wrap"
						list={mappedSortableListData}
						animation={400}
						setList={(v, sortable) => {
							if (sortable) {
								onChange?.(v.map((v) => v.id));
								setPreviewFileSrc(v.map((i) => i.id));
							}
						}}
					>
						{(previewFileSrc as string[]).map((v, i) => (
							<div key={i} className="relative mr-1 mb-1">
								<Button
									className="absolute top-0 right-0 z-10"
									icon={<DeleteTwoTone />}
									onClick={() => {
										onChange?.(value.filter((_, index) => index !== i));
										setPreviewFileSrc((prev) =>
											(prev as string[]).filter((_, index) => index !== i),
										);
									}}
								/>
								<HashAssets src={v} className="h-28 w-28 overflow-hidden" useAntdImageComponent />
							</div>
						))}
					</ReactSortable>
				) : (
					<HashAssets
						src={previewFileSrc as string}
						className="h-28 w-28 overflow-hidden"
						useAntdImageComponent
					/>
				)}
			</div>
		</div>
	);
};

export default LocalImageUploadWithPreview;
