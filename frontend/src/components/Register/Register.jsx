import { useEffect, useRef, useState } from "react";
import Spinner from "../Spinner/Spinner";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import {
	createUserProfileDocument,
	sendRegistrationVerificationEmail,
	signUpWithCredentialsWrapper
} from "@/services/firebase.utils";
import { useDispatch } from "react-redux";
import { newUpdateUserSignInStatus } from "@/redux/user/user.actions";
// import { NODE_ENV } from "@/config/index.js";

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading] = useState(false);
	const [registerState, setRegisterState] = useState({
		registerName: "",
		registerEmail: "",
		registerPassword: "",
		registerConfirmationId: "",
		nameErrorMessage: "",
		emailErrorMessage: "",
		passwordErrorMessage: "",
		confirmationIdErrorMessage: "",
		showNameError: false,
		showEmailError: false,
		showPasswordError: false,
		successMessage: "",
		errorMessage: `Something went wrong.
              Please try again.`,
		showError: false,
		showSpinner: false,
		successData: false,
		registerStepNum: 1
	});

	const {
		registerName,
		registerEmail,
		registerPassword,
		nameErrorMessage,
		emailErrorMessage,
		passwordErrorMessage,
		showNameError,
		showEmailError,
		showPasswordError,
		successMessage,
		errorMessage,
		showError,
		showSpinner,
		successData,
		registerStepNum
	} = registerState;

	const registerNameRef = useRef(null);
	const registerEmailRef = useRef(null);
	const registerPasswordRef = useRef(null);
	const registerConfirmationIdRef = useRef(null);
	const signinLinkRef = useRef(null);

	useEffect(() => {
		registerNameRef?.current?.focus();

		return () => {};
	}, [registerNameRef]);

	useEffect(() => {
		if (registerStepNum === 1) {
			if (registerNameRef?.current?.validity.valid && showNameError) {
				setRegisterState({
					...registerState,
					showNameError: false
				});
			} else if (!registerNameRef?.current?.validity.valid && !showNameError) {
				setRegisterState({
					...registerState,
					showNameError: true
				});
			}
			if (registerEmailRef?.current?.validity.valid && showEmailError) {
				setRegisterState({
					...registerState,
					showEmailError: false
				});
			} else if (registerEmailRef?.current?.validity.valid === false && showEmailError === false) {
				setRegisterState({
					...registerState,
					showEmailError: true
				});
			}
			if (registerPasswordRef?.current?.validity.valid && showPasswordError) {
				setRegisterState({
					...registerState,
					showPasswordError: false
				});
			} else if (registerPasswordRef?.current?.validity.valid === false && showPasswordError === false) {
				setRegisterState({
					...registerState,
					showPasswordError: true
				});
			}
		}
		if (successData && showError) {
			setRegisterState({
				...registerState,
				successData: false
			});
		}
	}, [
		registerStepNum,
		registerNameRef,
		showNameError,
		registerEmailRef,
		showEmailError,
		registerPasswordRef,
		showPasswordError,
		registerConfirmationIdRef,
		successData,
		showError,
		registerState
	]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setRegisterState({
			...registerState,
			[name]: value
		});
	};

	const onNameError = (show) => {
		if (show) {
			setRegisterState({
				...registerState,
				showNameError: true,
				nameErrorMessage: "Name is a required field"
			});
			registerNameRef?.current?.classList.add("highlightClassInRegister");
			registerNameRef?.current?.focus();
			return;
		}
		setRegisterState({
			...registerState,
			showNameError: false,
			nameErrorMessage: ""
		});
		registerNameRef?.current?.classList.remove("highlightClassInRegister");
	};

	const onEnterKeyPressOnName = (event) => {
		if (event.key === "Enter" && registerName === "") {
			onNameError(true);
		} else if (event.key === "Enter" && registerName !== "") {
			onNameError(false);
			if (registerEmail === "") {
				registerEmailRef?.current?.focus();
			} else if (registerPassword === "") {
				registerPasswordRef?.current?.focus();
			} else {
				return onRegisterStep1();
			}
		}
	};

	const onEmailError = (show) => {
		if (show) {
			setRegisterState({
				...registerState,
				showEmailError: true,
				emailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`
			});
			registerEmailRef?.current?.classList.add("highlightClassInRegister");
			registerEmailRef?.current?.focus();
			return;
		}
		setRegisterState({
			...registerState,
			showEmailError: false
		});
		registerEmailRef?.current?.classList.remove("highlightClassInRegister");
	};

	const onEnterKeyPressOnEmail = (event) => {
		if (event.key === "Enter" && registerEmail === "") {
			onEmailError(true);
		} else if (event.key === "Enter" && registerEmailRef?.current?.validity.typeMismatch) {
			onEmailError(true);
		} else if (event.key === "Enter" && !registerEmailRef?.current?.validity.typeMismatch) {
			onEmailError(false);
			if (registerName === "") {
				registerNameRef?.current?.focus();
			} else if (registerPassword === "") {
				registerPasswordRef?.current?.focus();
			} else {
				return onRegisterStep1();
			}
		}
	};

	const onPasswordError = (showPasswordError) => {
		if (showPasswordError) {
			setRegisterState({
				...registerState,
				showPasswordError: true,
				passwordErrorMessage: "Password is a required field and must be between 8 - 10 characters."
			});
			registerPasswordRef?.current?.classList.add("highlightClassInRegister");
			registerPasswordRef?.current?.focus();
			return;
		}
		setRegisterState({
			...registerState,
			showPasswordError: false
		});
		registerPasswordRef?.current?.classList.remove("highlightClassInRegister");
	};

	const onEnterKeyPressOnPassword = (event) => {
		if (event.key === "Enter" && registerPassword.length < 8) {
			onPasswordError(true);
		} else if (event.key === "Enter" && !registerPasswordRef?.current?.validity.valid) {
			onPasswordError(true);
		} else if (event.key === "Enter" && registerPassword.length >= 8) {
			onPasswordError(false);
			if (registerName === "") {
				registerNameRef?.current?.focus();
			} else if (registerEmail === "") {
				registerEmailRef?.current?.focus();
			} else {
				return onRegisterStep1();
			}
		}
	};

	const onSubmitForm = (event) => {
		event.preventDefault();
	};

	const onRegisterStep1 = async () => {
		if (registerStepNum === 1) {
			if (registerPasswordRef?.current?.value.length < 8) {
				onPasswordError(true);
			} else {
				onPasswordError(false);
			}
			if (registerEmail === "" || registerEmailRef?.current?.validity.typeMismatch) {
				onEmailError(true);
			} else {
				onEmailError(false);
			}
			if (registerName === "") {
				onNameError(true);
			} else {
				onNameError(false);
			}
		}
		if (
			!showNameError &&
			!showEmailError &&
			!showPasswordError &&
			registerName !== "" &&
			registerEmail !== "" &&
			registerPassword !== ""
		) {
			setRegisterState({ ...registerState, showSpinner: true });
			signinLinkRef?.current?.classList.add("registerStep2");
			try {
				const userWithEmailAndPw = await signUpWithCredentialsWrapper(registerEmail, registerPassword);
				const userObj = {
					uid: "",
					displayName: "",
					email: "",
					entries: 0,
					createdAt: "",
					pet: "",
					age: 30,
					handle: "",
					profilePhotoUrl: ""
				};
				userObj.uid = userWithEmailAndPw.auth.currentUser.uid;
				userObj.email = registerEmail;
				userObj.displayName = registerName;
				// save a human-readable date
				const date = new Date();
				const options = { year: "numeric", month: "short", day: "numeric" };
				// "Oct. 24, 2024"
				userObj.joined = date.toLocaleDateString("en-US", options);
				if (registerName) {
					userObj.profilePhotoUrl = `https://avatar-letter.fun/api/file/set1/big/${registerName[0].toLowerCase()}/png`;
				} else if (registerEmail) {
					userObj.profilePhotoUrl = `https://avatar-letter.fun/api/file/set1/big/${registerEmail[0].toLowerCase()}/png`;
				} else {
					userObj.profilePhotoUrl = `https://avatar-letter.fun/api/file/set1/big/u/png`;
				}
				await createUserProfileDocument(userWithEmailAndPw, userObj);

				await sendRegistrationVerificationEmail(userWithEmailAndPw);

				await dispatch(newUpdateUserSignInStatus(200, userObj));

				setRegisterState({
					...registerState,
					showError: false,
					showSpinner: false,
					registerStepNum: 2,
					successData: true,
					successMessage:
						"You've successfully registered. Please verify your email by clicking on the link in your email. Then, please refresh this page."
				});
				signinLinkRef?.current?.classList.remove("step2Link");
			} catch (error) {
				// if (NODE_ENV !== "production") {
				// 	console.log(error);
				// }
				setRegisterState({
					...registerState,
					showError: true,
					showSpinner: false,
					registerStepNum: 1,
					errorMessage: `${error.message}`
				});
			}
		}
	};

	return (
		<article className="registerArticle">
			<main className="registerMain">
				<div className="registerMeasure">
					<fieldset
						id="sign_up"
						className="registerFieldset">
						<legend className="registerLegend">Register</legend>
						<h4 className="register-steps">{`Step ${registerStepNum} of 2`}</h4>
						{showError && <p className="registerErrorDisplay">{errorMessage}</p>}
						{successData && <p className="registerErrorDisplay success">{successMessage}</p>}
						<Spinner showSpinner={showSpinner || loading} />
						{registerStepNum === 1 && (
							<>
								<div
									className="belowLegendDiv"
									onSubmit={onSubmitForm}>
									<label
										className="belowLegendLabel"
										htmlFor="registerName">
										Name
									</label>
									<input
										className="belowLegendInput"
										type="text"
										name="registerName"
										id="registerName"
										required
										ref={registerNameRef}
										placeholder="Enter name here"
										onChange={handleChange}
										onKeyDown={onEnterKeyPressOnName}
									/>
									{showNameError && <p className="registerErrorDisplay registerFieldsError">{nameErrorMessage}</p>}
								</div>
								<div
									className="belowLegendDiv"
									onSubmit={onSubmitForm}>
									<label
										className="belowLegendLabel"
										htmlFor="registerEmail">
										Email
									</label>
									<input
										className="belowLegendInput"
										type="email"
										required
										name="registerEmail"
										id="registerEmail"
										ref={registerEmailRef}
										placeholder="Enter email here"
										onChange={handleChange}
										onKeyDown={onEnterKeyPressOnEmail}
									/>
									{showEmailError && <p className="registerErrorDisplay registerFieldsError">{emailErrorMessage}</p>}
								</div>
								<div
									className="belowLegendDiv"
									onSubmit={onSubmitForm}>
									<label
										className="belowLegendLabel"
										htmlFor="registerPassword">
										Password
									</label>
									<input
										className="belowLegendInput"
										type="password"
										name="registerPassword"
										id="registerPassword"
										required
										ref={registerPasswordRef}
										placeholder="sshhh"
										minLength={8}
										maxLength={10}
										onChange={handleChange}
										onKeyDown={onEnterKeyPressOnPassword}
									/>
									{showPasswordError && (
										<p className="registerErrorDisplay registerFieldsError">{passwordErrorMessage}</p>
									)}
									<input
										onClick={onRegisterStep1}
										className="registerButton"
										type="button"
										value="Register"
									/>
								</div>
							</>
						)}
					</fieldset>
					<div className="belowRegisterButtonDiv">
						<span
							ref={signinLinkRef}
							onClick={() => navigate("/login")}
							style={{ marginTop: `${registerStepNum === 2 && "1rem"}` }}
							className="signinLinkInRegister">
							Sign In
						</span>
					</div>
				</div>
			</main>
		</article>
	);
};

export default Register;
