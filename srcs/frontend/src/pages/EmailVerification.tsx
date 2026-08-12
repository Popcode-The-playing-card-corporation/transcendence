import { useState } from "react";
import { useNotif } from "../components/hooks/useNotif"; // <-- REPLACE path if necessary
import { sendVerificationEmail } from "../api/http/email_verification"; // <-- REPLACE with actual API file

export function EmailVerification() {
	const notif = useNotif();
	const [sending, setSending] = useState(false);

	async function handleSendEmail() {
		if (sending)
			return;

		setSending(true);

		const result = await sendVerificationEmail();

		if (result.code === 200) {
			notif?.showNotif(
				"Email Sent",
				"Check your inbox for the verification link.",
				5000
			);
		} else {
			notif?.showNotif(
				"Verification Error",
				result.response,
				5000
			);
		}

		setSending(false);
	}

	return (
		<div className="page-content flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-2xl font-bold">
				Verify your email
			</h1>

			<p>
				Send a verification link to your email address to continue.
			</p>

			<button
				onClick={handleSendEmail}
				disabled={sending}
				className="btn btn-primary"
			>
				{sending ? "Sending..." : "Send verification email"}
			</button>
		</div>
	);
}