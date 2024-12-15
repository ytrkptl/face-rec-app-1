import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithCredentialsWrapper } from "@/services/firebase.utils";
import Spinner from "../Spinner/Spinner";
import "./Signin.css";
import { useDispatch } from "react-redux";
import { newUpdateUserSignInStatus } from "@/redux/user/user.actions";
import { getUserProfileDocument } from "../../services/firebase.utils";

const Signin = () => {
	const [signInState, setSignInState] = useState({
		signInEmail: "",
		signInPassword: "",
		errorMessage: `Something went wrong. Please try again.`,
		emailErrorMessage: "",
		passwordErrorMessage: "",
		showEmailError: false,
		showPasswordError: false,
		showError: false,
		showSpinner: false,
		loading: false
	});

	const {
		signInEmail,
		signInPassword,
		errorMessage,
		emailErrorMessage,
		passwordErrorMessage,
		showEmailError,
		showPasswordError,
		showError,
		loading
	} = signInState;

	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const dispatch = useDispatch();

	const navigate = useNavigate();

	useEffect(() => {
		emailRef?.current?.focus();
		return () => {};
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setSignInState((prevState) => ({
			...prevState,
			[name]: value
		}));
	};

	const onEmailError = (show) => {
		if (show) {
			setSignInState({
				...signInState,
				showEmailError: true,
				emailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`
			});
			emailRef?.current?.classList.add("highlightClassInSignIn");
			emailRef?.current?.focus();
			return;
		}
		setSignInState({
			...signInState,
			showEmailError: false
		});
		emailRef?.current?.classList.remove("highlightClassInSignIn");
	};

	const onEnterKeyPressOnEmail = (event) => {
		if (event.key === "Enter" && signInEmail === "") {
			onEmailError(true);
		} else if (event.key === "Enter" && emailRef?.current?.validity.typeMismatch) {
			onEmailError(true);
		} else if (event.key === "Enter" && !emailRef?.current?.validity.typeMismatch) {
			onEmailError(false);
			if (signInPassword === "") {
				passwordRef?.current?.focus();
			} else {
				return onSubmitSignIn();
			}
		}
	};

	const onPasswordError = (showPasswordError) => {
		if (showPasswordError) {
			setSignInState({
				...signInState,
				showPasswordError: true,
				passwordErrorMessage: "Password is a required field and must be between 8 - 10 characters."
			});
			passwordRef?.current?.classList.add("highlightClassInSignIn");
			passwordRef?.current?.focus();
			return;
		}
		setSignInState({
			...signInState,
			showPasswordError: false
		});
		passwordRef?.current?.classList.remove("highlightClassInSignIn");
	};

	const onEnterKeyPressOnPassword = (event) => {
		if (event.key === "Enter" && signInPassword.length < 8) {
			onPasswordError(true);
		} else if (event.key === "Enter" && !passwordRef?.current?.validity.valid) {
			onPasswordError(true);
		} else if (event.key === "Enter" && signInPassword.length >= 8) {
			onPasswordError(false);
			if (signInEmail === "") {
				emailRef?.current?.focus();
			} else {
				return onSubmitSignIn();
			}
		}
	};

	const onSubmitForm = async (event) => {
		event.preventDefault();
	};

	const onSubmitSignIn = async () => {
		if (passwordRef?.current?.value.length < 8) {
			onPasswordError(true);
		} else {
			onPasswordError(false);
		}
		if (signInEmail === "" || emailRef?.current?.validity.typeMismatch) {
			onEmailError(true);
		} else {
			onEmailError(false);
		}
		if (!showEmailError && !showPasswordError && signInEmail !== "" && signInPassword !== "") {
			setSignInState({ ...signInState, showSpinner: true });
			// sign in using firebase
			try {
				const result = await signInWithCredentialsWrapper(signInEmail, signInPassword);
				console.log(result);
				setSignInState({
					...signInState,
					showError: false,
					showSpinner: false
				});
				const userProfileData = await getUserProfileDocument(result.user.uid);
				delete userProfileData.createdAt;
				dispatch(newUpdateUserSignInStatus(200, userProfileData));
			} catch (err) {
				setSignInState({
					...signInState,
					showError: true,
					errorMessage: `${err.message}`,
					showSpinner: false
				});
				dispatch(newUpdateUserSignInStatus(401, null));
			}
		}
	};

	return (
		<article className="signinArticle">
			<main className="signinMain">
				<div className="signinMeasure">
					<fieldset
						id="sign_up"
						className="signinFieldset">
						<legend className="signinLegend">Sign In</legend>
						{showError && <p className="signinErrorDisplay">{errorMessage}</p>}
						<div
							className="belowLegendDivInSignin"
							onSubmit={onSubmitForm}>
							<label
								className="belowLegendLabelInSignin"
								htmlFor="signInEmail">
								Email
							</label>
							<input
								className="belowLegendInputInSignin"
								type="email"
								name="signInEmail"
								id="signInEmail"
								required
								ref={emailRef}
								onChange={handleChange}
								onKeyDown={onEnterKeyPressOnEmail}
							/>
							{showEmailError && <p className="signinErrorDisplay signinFieldsError">{emailErrorMessage}</p>}
						</div>
						<div
							className="belowLegendDivInSignin"
							onSubmit={onSubmitForm}>
							<label
								className="belowLegendLabelInSignin"
								htmlFor="signInPassword">
								Password
							</label>
							<input
								className="belowLegendInputInSignin"
								type="password"
								id="signInPassword"
								name="signInPassword"
								required
								ref={passwordRef}
								minLength={8}
								maxLength={10}
								onChange={handleChange}
								onKeyDown={onEnterKeyPressOnPassword}
							/>
							{showPasswordError === true && (
								<p className="signinErrorDisplay signinFieldsError">{passwordErrorMessage}</p>
							)}
						</div>
					</fieldset>
					<Spinner showSpinner={loading} />
					<input
						onClick={onSubmitSignIn}
						className="signinButtonInSignin"
						type="submit"
						value="Sign in"
					/>
					<div className="belowSigninButtonDiv">
						<p
							onClick={() => navigate("/forgot")}
							className="registerLinkInSignin">
							Forgot Password
						</p>
						<p
							onClick={() => navigate("/register")}
							className="registerLinkInSignin">
							Register
						</p>
					</div>
				</div>
			</main>
		</article>
	);
};

export default Signin;
