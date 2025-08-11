import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";
import styles from "./index.module.css";

type Props = {
	label: string;
	badge?: string | number;
	children: React.ReactNode;
};

const Component: React.FC<Props> = ({ label, badge, children }) => {
	return (
		<Disclosure>
			<DisclosureButton className={styles.button}>
				<span>{label}</span>
				{badge != null && (
					<span
						className={`${styles.badge} ${badge === 0 ? styles.Disabled : ""}`}
					>
						{badge}
					</span>
				)}
			</DisclosureButton>
			<DisclosurePanel static className={styles.panel}>
				{children}
			</DisclosurePanel>
		</Disclosure>
	);
};

export { Component as Disclosure };
