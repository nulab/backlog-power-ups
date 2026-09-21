/**
 * Status changes go through Backlog's own endpoint rather than the REST API,
 * so the extension keeps using the session the user is already signed in with
 * and needs no API key.
 *
 * Confirmed against a live board:
 * - the issue page posts to `/SwitchStatusAddComment.action`,
 *   `method="post"`, `enctype="multipart/form-data"`
 * - the CSRF token lives in `#csrfTokenForm input[name="csrf-token"]`
 *
 * NOT yet confirmed: the field names carrying the issue and the target status.
 * They are not in the served markup -- the status widget is a React/chosen
 * hybrid with no backing `<select>`, and the fields are injected at submit
 * time -- so they can only be read off a real status change.
 *
 * Until FIELDS is filled in, this throws instead of posting a guessed payload,
 * because a wrong field name here would silently move issues to the wrong
 * status across a whole selection.
 */
const ENDPOINT = "/SwitchStatusAddComment.action";

type StatusFields = { issue: string; status: string };

const FIELDS = null as StatusFields | null;

export const updateIssueStatus = async (
	issueKey: string,
	statusId: number,
	csrfToken: string,
): Promise<void> => {
	if (FIELDS === null) {
		throw new Error(
			"boardBulkStatus: the payload for /SwitchStatusAddComment.action is not known yet",
		);
	}

	const body = new FormData();
	body.set(FIELDS.issue, issueKey);
	body.set(FIELDS.status, String(statusId));
	body.set("csrf-token.name", "csrf-token");
	body.set("csrf-token", csrfToken);

	const res = await fetch(ENDPOINT, {
		method: "POST",
		body,
		credentials: "same-origin",
	});

	if (!res.ok) {
		throw new Error(`failed to update ${issueKey}: ${res.status}`);
	}
};
