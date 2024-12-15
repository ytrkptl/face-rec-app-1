import React from "react";
import "./EmailVerificationNotice.css";
import { useAuth } from "@/hooks/useAuth";
import { sendEmailVerification } from "firebase/auth";

const EmailVerificationNotice = () => {
	const { user } = useAuth();

	const handleResendEmail = async () => {
		try {
			if (user) {
				await sendEmailVerification(user);
				alert("Verification email resent. Please check your inbox.");
			} else {
				alert("No user is signed in.");
			}
		} catch (error) {
			console.error("Error resending verification email:", error.message);
		}
	};

	return (
		<div className="email-verification-notice">
			<h2>Email Verification Required</h2>
			<p>Please verify your email by clicking on the link provided in the email.</p>
			<p>Then, please refresh this page.</p>
			<p>
				If you did not receive the email, check your spam folder or{" "}
				<button
					className="resend-button"
					onClick={handleResendEmail}>
					click here
				</button>{" "}
				to resend the verification email.
			</p>
		</div>
	);
};

export default EmailVerificationNotice;
