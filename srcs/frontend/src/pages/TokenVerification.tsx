import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useNotif } from "../components/hooks/useNotif";
import { validateToken } from "../api/http/email_verification";
import { useAuth } from "../components/hooks/useAuth";


export function VerifyEmail() {
	const notif = useNotif();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const auth = useAuth();
	const hasVerified = useRef(false);
	const [status, setStatus] = useState<"loading" | "error">("loading");

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
			set_error();
			return;
		}
		async function set_error(){
			setStatus("error");
		}
		async function verify(searchId: string, token: string) {
			const result = await validateToken(searchId, token);

			if (result.code === 200) {
				notif?.showNotif(
					"Email Verified",
					"Your email has been successfully verified.",
					5000
				);
				auth.setEmailVerified(true);
				navigate("/login", { replace: true });
			} else {
				notif?.showNotif(
					"Verification Error",
					result.response,
					5000
				);
				setStatus("error");
			}
		}

		verify(searchId, token);
	}, [searchParams, notif, navigate]);

	if (status === "error") {
	return (
		<div className="page-content flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-2xl font-bold">Verification failed</h1>
			<p>The verification link is invalid, expired, or has already been used.</p>

			<button
				className="btn btn-primary"
				onClick={() => navigate(auth.logged_in ? "/email_verification" : "/login")}
			>
				Continue
			</button>
		</div>
		);
	}

	return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>
	);
}