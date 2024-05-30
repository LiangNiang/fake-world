import type { ReactNode } from "react";

export type TColumnContainerProps = {
	keys: string[];
	data: ReactNode[];
};

const Columns = ({ keys, data }: TColumnContainerProps) => {
	return keys.map((key, i) => (
		<div className="grid auto-cols-max grid-cols-12" key={key}>
			<div className="col-span-3 text-[#7F7F7F]">{key}</div>
			<div className="col-span-9 break-words">{data[i]}</div>
		</div>
	));
};

export default Columns;
