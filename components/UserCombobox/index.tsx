import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import styles from "./index.module.css";

export type UserComboboxUser = {
	id: string | undefined;
	iconUrl: string | undefined;
	name: string | undefined;
	keyword: string | undefined;
};

type Props = {
	users: UserComboboxUser[];
	defaultUserId?: string;
	onChange?: (user: UserComboboxUser) => void;
};

export const UserCombobox: React.FC<Props> = ({
	users,
	defaultUserId,
	onChange,
}) => {
	const defaultUser = users.find(({ id }) => id === defaultUserId);
	const [user, setUser] = useState(defaultUser ?? null);
	const [search, setSearch] = useState("");

	const filteredUsers = users.filter(
		({ keyword }) =>
			!search || keyword?.toLowerCase().includes(search.toLowerCase()),
	);

	const handleChange = (user: UserComboboxUser | null) => {
		if (user) {
			onChange?.(user);
		}

		setUser(user ?? null);
	};

	return (
		<Combobox
			value={user}
			virtual={{ options: filteredUsers }}
			onChange={handleChange}
		>
			<div className={styles.field}>
				<ComboboxInput
					className={styles.input}
					aria-label="User"
					displayValue={() => user?.name || ""}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<ComboboxButton className={styles.button} aria-label="Open" />
			</div>
			<ComboboxOptions anchor="bottom" className={styles.options}>
				{({ option }: { option: UserComboboxUser }) => (
					<ComboboxOption
						key={option.id}
						value={option}
						className={styles.option}
					>
						<img className={styles.icon} src={option.iconUrl} alt="" />
						{option.name}
					</ComboboxOption>
				)}
			</ComboboxOptions>
		</Combobox>
	);
};
