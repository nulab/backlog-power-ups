import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRef } from "react";
import styles from "./index.module.css";

type Props = {
	open: boolean;
	src: string | URL;
	onClose: () => void;
};

export const IframeDialog: React.FC<Props> = ({ open, src, onClose }) => {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const srcUrl = src instanceof URL ? src.href : src;

	const openInMainFrame = () => {
		const href = iframeRef.current?.contentWindow?.location.href;

		if (href) {
			location.href = href;
		}
	};

	return (
		<Dialog className={styles.dialog} open={open} onClose={onClose}>
			<DialogBackdrop className={styles.backdrop} />
			<div className={styles.root}>
				<DialogPanel className={styles.panel}>
					<div className={styles.container}>
						<button
							type="button"
							className={styles.link}
							onClick={openInMainFrame}
						>
							{i18n.t("openInDialog.openInMainFrame")}
						</button>
						<iframe
							ref={iframeRef}
							title="Backlog in Dialog"
							className={styles.iframe}
							src={srcUrl}
						/>
					</div>
				</DialogPanel>
			</div>
			<button
				type="button"
				className={`_trigger-text icon icon--close -x-large -inverse modal__close ${styles.close}`}
			>
				<span className="_assistive-text">{i18n.t("openInDialog.close")}</span>
			</button>
		</Dialog>
	);
};
