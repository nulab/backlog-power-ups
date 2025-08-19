import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";
import styles from "./index.module.css";

type Props = {
	label: string;
	enabledBadge?: string | number;
	disabledBadge?: string | number;
	children: React.ReactNode;
};

const Component: React.FC<Props> = ({
	label,
	enabledBadge,
	disabledBadge,
	children,
}) => {
	return (
		<Disclosure>
			<DisclosureButton className={styles.button}>
				<span className={styles.label}>{label}</span>
				<span className={styles.badges}>
					{enabledBadge != null && (
						<span
							className={`${styles.badge} ${
								enabledBadge === 0 ? styles.Disabled : ""
							}`}
						>
							{enabledBadge}
						</span>
					)}
					{disabledBadge != null && (
						<span className={`${styles.badge} ${styles.Disabled}`}>
							{disabledBadge}
						</span>
					)}
				</span>
			</DisclosureButton>
			<DisclosurePanel static className={styles.panel}>
				{children}
			</DisclosurePanel>
		</Disclosure>
	);
};

export { Component as Disclosure };
