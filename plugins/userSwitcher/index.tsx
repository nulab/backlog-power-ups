import { UserCombobox, type UserComboboxUser } from "@/components/UserCombobox";
import { renderReactComponent } from "@/utils/renderReactComponent";
import styles from "./index.module.css";

export const userSwitcher = definePowerUpsPlugin({
	group: "general",
	defaultEnabled: true,
	allFrames: true,
	matches: ["/user/*"],
	async main({ observeQuerySelector }) {
		const getUsers = async () => {
			const res = await fetch("/users");
			const userHtml = await res.text();

			if (!res.ok) {
				throw new Error("fetch failed");
			}

			const parser = new DOMParser();
			const dom = parser.parseFromString(userHtml, "text/html");

			return Array.from(dom.querySelectorAll(".member-list__item")).map(
				(item) => {
					const id = item
						.querySelector(".member-list__link")
						?.getAttribute("href")
						?.split("/")
						.pop()
						?.replace(/[?#].*/, "");
					const iconUrl =
						item.querySelector(".member-list__img")?.getAttribute("src") ??
						undefined;
					const name = item.querySelector(".member-list__name")?.textContent;
					const keyword = item.querySelector(
						".member-list__filterable",
					)?.textContent;

					return { id, iconUrl, name, keyword } satisfies UserComboboxUser;
				},
			);
		};

		observeQuerySelector(".profile-content", async (el) => {
			const users = await getUsers();
			const userId = location.pathname.split("/").pop();

			const handleChange = (user: UserComboboxUser) => {
				const url = new URL(location.href);
				url.pathname = `/user/${user.id}`;

				location.href = url.href;
			};

			renderReactComponent(
				<div className={styles.container}>
					<UserCombobox
						users={users}
						defaultUserId={userId}
						onChange={handleChange}
					/>
				</div>,
				el,
			);
		});
	},
});
