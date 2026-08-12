import { useEffect, useState, useRef } from "react";
import { useNotif } from "../components/hooks/useNotif"; // <-- REPLACE path if necessary
import { sendVerificationEmail } from "../api/http/email_verification"; // <-- REPLACE with actual API file

export function EmailVerification() {
	const notif = useNotif();
	const [sending, setSending] = useState(false);
	const hasSent = useRef(false);

	useEffect(() => {
		if (hasSent.current)
			return;
		hasSent.current = true;
		handleSendEmail();
	}, []);

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
				We've sent a verification link to your email address.
				It may take a few minutes to arrive. Remember to check your spam folder.
			</p>

			<button
				onClick={handleSendEmail}
				disabled={sending}
				className="btn btn-primary"
			>
				{sending ? "Sending..." : "Re-send verification email"}
			</button>
		</div>
	);
}