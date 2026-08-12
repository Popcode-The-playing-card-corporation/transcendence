import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useNotif } from "../components/hooks/useNotif";
import { validateToken } from "../api/http/email_verification";

export function VerifyEmail() {
	const notif = useNotif();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const hasVerified = useRef(false);

	useEffect(() => {
		if (hasVerified.current)
			return;

		hasVerified.current = true;

		const searchId = searchParams.get("id");
		const token = searchParams.get("token");

		if (!searchId || !token) {
			notif?.showNotif(
				"Verification Error",
				"Invalid verification link.",
				5000
			);
			return;
		}

		async function verify(searchId: string, token: string) {
			const result = await validateToken(searchId, token);

			if (result.code === 200) {
				notif?.showNotif(
					"Email Verified",
					"Your email has been successfully verified.",
					5000
				);

				navigate("/login", { replace: true });
			} else {
				notif?.showNotif(
					"Verification Error",
					result.response,
					5000
				);
			}
		}

		verify(searchId, token);
	}, [searchParams, notif, navigate]);

	return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>
	);
}