import { twJoin } from "tailwind-merge";
import styles from "./style.module.scss";

type Props = {
	className?: string;
};

const Loading = ({ className }: Props) => {
	return (
		// biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: <explanation>
		<i role="img" className={twJoin("inline-block align-middle", styles.icon, className)} />
	);
};

export default Loading;
