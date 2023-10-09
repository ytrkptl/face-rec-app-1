import { useState, useRef, useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = ({ loadUser, toggleSignIn }) => {
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
    showConfirmationIdError: false,
    successMessage: "",
    errorMessage: `Something went wrong. 
              Please try again.`,
    showError: false,
    showSpinner: false,
    successData: false,
    registerStepNum: 1,
  });

  const {
    registerName,
    registerEmail,
    registerPassword,
    registerConfirmationId,
    nameErrorMessage,
    emailErrorMessage,
    passwordErrorMessage,
    confirmationIdErrorMessage,
    showNameError,
    showEmailError,
    showPasswordError,
    showConfirmationIdError,
    successMessage,
    errorMessage,
    showError,
    showSpinner,
    successData,
    registerStepNum,
  } = registerState;

  const registerNameRef = useRef(null);
  const registerEmailRef = useRef(null);
  const registerPasswordRef = useRef(null);
  const registerConfirmationIdRef = useRef(null);
  const signinLinkRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    registerNameRef?.current?.focus();

    return () => {};
  }, [registerNameRef]);

  useEffect(() => {
    if (registerStepNum === 1) {
      if (registerNameRef?.current?.validity.valid && showNameError) {
        setRegisterState({
          ...registerState,
          showNameError: false,
        });
      } else if (!registerNameRef?.current?.validity.valid && !showNameError) {
        setRegisterState({
          ...registerState,
          showNameError: true,
        });
      }
      if (registerEmailRef?.current?.validity.valid && showEmailError) {
        setRegisterState({
          ...registerState,
          showEmailError: false,
        });
      } else if (
        registerEmailRef?.current?.validity.valid === false &&
        showEmailError === false
      ) {
        setRegisterState({
          ...registerState,
          showEmailError: true,
        });
      }
      if (registerPasswordRef?.current?.validity.valid && showPasswordError) {
        setRegisterState({
          ...registerState,
          showPasswordError: false,
        });
      } else if (
        registerPasswordRef?.current?.validity.valid === false &&
        showPasswordError === false
      ) {
        setRegisterState({
          ...registerState,
          showPasswordError: true,
        });
      }
      if (
        registerConfirmationIdRef?.current?.validity.valid &&
        showConfirmationIdError
      ) {
        setRegisterState({
          ...registerState,
          showConfirmationIdError: false,
        });
      } else if (
        registerConfirmationIdRef?.current?.validity.valid === false &&
        showConfirmationIdError === false
      ) {
        setRegisterState({
          ...registerState,
          showConfirmationIdError: true,
        });
      }
    }
    if (successData && showError) {
      setRegisterState({
        ...registerState,
        successData: false,
      });
    }
  }, [registerStepNum, registerNameRef, showNameError, registerEmailRef, showEmailError, registerPasswordRef, showPasswordError, registerConfirmationIdRef, showConfirmationIdError, successData, showError, registerState]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRegisterState({
      ...registerState,
      [name]: value,
    });
  };

  const onNameError = (show) => {
    if (show) {
      setRegisterState({
        ...registerState,
        showNameError: true,
        nameErrorMessage: "Name is a required field",
      });
      registerNameRef?.current?.classList.add("highlightClassInRegister");
      registerNameRef?.current?.focus();
      return;
    }
    setRegisterState({
      ...registerState,
      showNameError: false,
      nameErrorMessage: "",
    });
    registerNameRef?.current?.classList.remove("highlightClassInRegister");
    return;
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
        onRegisterStep1();
      }
    }
  };

  const onEmailError = (show) => {
    if (show) {
      setRegisterState({
        ...registerState,
        showEmailError: true,
        emailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`,
      });
      registerEmailRef?.current?.classList.add("highlightClassInRegister");
      registerEmailRef?.current?.focus();
      return;
    }
    setRegisterState({
      ...registerState,
      showEmailError: false,
    });
    registerEmailRef?.current?.classList.remove("highlightClassInRegister");
    return;
  };

  const onEnterKeyPressOnEmail = (event) => {
    if (event.key === "Enter" && registerEmail === "") {
      onEmailError(true);
    } else if (
      event.key === "Enter" &&
      registerEmailRef?.current?.validity.typeMismatch
    ) {
      onEmailError(true);
    } else if (
      event.key === "Enter" &&
      !registerEmailRef?.current?.validity.typeMismatch
    ) {
      onEmailError(false);
      if (registerName === "") {
        registerNameRef?.current?.focus();
      } else if (registerPassword === "") {
        registerPasswordRef?.current?.focus();
      } else {
        onRegisterStep1();
      }
    }
  };

  const onPasswordError = (showPasswordError) => {
    if (showPasswordError) {
      setRegisterState({
        ...registerState,
        showPasswordError: true,
        passwordErrorMessage:
          "Password is a required field and must be between 8 - 10 characters.",
      });
      registerPasswordRef?.current?.classList.add("highlightClassInRegister");
      registerPasswordRef?.current?.focus();
      return;
    }
    setRegisterState({
      ...registerState,
      showPasswordError: false,
    });
    registerPasswordRef?.current?.classList.remove("highlightClassInRegister");
    return;
  };

  const onEnterKeyPressOnPassword = (event) => {
    if (event.key === "Enter" && registerPassword.length < 8) {
      onPasswordError(true);
    } else if (
      event.key === "Enter" &&
      !registerPasswordRef?.current?.validity.valid
    ) {
      onPasswordError(true);
    } else if (event.key === "Enter" && registerPassword.length >= 8) {
      onPasswordError(false);
      if (registerName === "") {
        registerNameRef?.current?.focus();
      } else if (registerEmail === "") {
        registerEmailRef?.current?.focus();
      } else {
        onRegisterStep1();
      }
    }
  };

  const onConfirmationIdError = (show) => {
    if (show) {
      setRegisterState({
        ...registerState,
        showConfirmationIdError: true,
        confirmationIdErrorMessage:
          "Confirmation Id is required and must match the code you received via email",
      });
      registerConfirmationIdRef?.current?.classList.add(
        "highlightClassInRegister"
      );
      registerConfirmationIdRef?.current?.focus();
      return;
    }
    setRegisterState({
      ...registerState,
      showConfirmationIdError: false,
    });
    registerConfirmationIdRef?.current?.classList.remove(
      "highlightClassInRegister"
    );
    return;
  };

  const onEnterKeyPressOnConfirmationId = (event) => {
    if (event.key === "Enter" && registerConfirmationId === "") {
      onConfirmationIdError(true);
    } else if (event.key === "Enter" && registerConfirmationId !== "") {
      onConfirmationIdError(false);
      onRegisterStep2();
    }
  };

  const saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
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
      if (
        registerEmail === "" ||
        registerEmailRef?.current?.validity.typeMismatch
      ) {
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
      setRegisterState({...registerState, showSpinner: true });
      signinLinkRef?.current?.classList.add("registerStep2");
      const response = await fetch(`/register-step-1`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setRegisterState({
          ...registerState,
          showError: true,
          showSpinner: false,
          registerStepNum: 1,
          errorMessage: `${data}`,
        });
      } else if (response.status === 200) {
        setRegisterState({
          ...registerState,
          showError: false,
          showSpinner: false,
          registerStepNum: 2,
          successData: true,
          successMessage: `${data}`,
        });
        signinLinkRef?.current?.classList.remove("step2Link");
      }
    }
    return;
  };

  const onRegisterStep2 = async () => {
    try {
      if (registerConfirmationId === "") {
        onConfirmationIdError(true);
        return;
      }
      onConfirmationIdError(false);
      setRegisterState({
        ...registerState, showSpinner: true });
      const response = await fetch(`/register-step-2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationId: registerConfirmationId,
        }),
      });
      const data = await response.json();
      if (data.userId && data.success === 200) {
        saveAuthTokenInSession(data.token);
        await getProfileAndSignIn(data);
        return;
      } else {
        setRegisterState({
          ...registerState,
          showError: true,
          errorMessage: `${data}`,
          showSpinner: false,
        });
      }
    } catch (error) {
      setRegisterState({
        ...registerState,
        showError: true,
        errorMessage: `Something went wrong. Please try again.`,
        showSpinner: false,
      });
    }
  };

  const getProfileAndSignIn = async (data) => {
    try {
      const resp = await fetch(`/profile/${data.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.token,
        },
      });
      const user = await resp.json();
      if (process.env.NODE_ENV !== "production") {
        console.log(resp, user);
      }
      if (user && user.email) {
        loadUser(user);
        toggleSignIn(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error);
      }
      setRegisterState({
        ...registerState,
        showError: true,
        errorMessage: `Something went wrong. Please try again.`,
        showSpinner: false,
      });
    }
  };

  const onResendEmail = () => {
    setRegisterState({...registerState, registerStepNum: 2, showSpinner: true });
    signinLinkRef?.current?.classList.add("registerStep2");
    fetch(`/register-step-1`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRegisterState({
          ...registerState,
          showError: false,
          showSpinner: false,
          registerStepNum: 2,
          successData: true,
          successMessage: `${data}`,
        });
        signinLinkRef?.current?.classList.remove("step2Link");
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(error);
        }
        setRegisterState({
          ...registerState,
          showError: true,
          showSpinner: false,
          registerStepNum: 1,
        });
      });
  };

  return (
    <article className="registerArticle">
      <main className="registerMain">
        <div className="registerMeasure">
          <fieldset id="sign_up" className="registerFieldset">
            <legend className="registerLegend">Register</legend>
            <h4 className="register-steps">{`Step ${registerStepNum} of 2`}</h4>
            {showError && (
              <p className="registerErrorDisplay">{errorMessage}</p>
            )}
            {successData && (
              <p className="registerErrorDisplay success">{successMessage}</p>
            )}
            <Spinner showSpinner={showSpinner} />
            {registerStepNum === 1 ? (
              <div>
                <div className="belowLegendDiv" onSubmit={onSubmitForm}>
                  <label className="belowLegendLabel" htmlFor="registerName">
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
                  {showNameError && (
                    <p className="registerErrorDisplay registerFieldsError">
                      {nameErrorMessage}
                    </p>
                  )}
                </div>
                <div className="belowLegendDiv" onSubmit={onSubmitForm}>
                  <label className="belowLegendLabel" htmlFor="registerEmail">
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
                  {showEmailError && (
                    <p className="registerErrorDisplay registerFieldsError">
                      {emailErrorMessage}
                    </p>
                  )}
                </div>
                <div className="belowLegendDiv" onSubmit={onSubmitForm}>
                  <label
                    className="belowLegendLabel"
                    htmlFor="registerPassword"
                  >
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
                    <p className="registerErrorDisplay registerFieldsError">
                      {passwordErrorMessage}
                    </p>
                  )}
                  <input
                    onClick={onRegisterStep1}
                    className="registerButton"
                    type="button"
                    value="Register"
                  />
                </div>
              </div>
            ) : (
              <div className="belowLegendDiv" onSubmit={onSubmitForm}>
                <label
                  className="belowLegendLabel"
                  htmlFor="registerConfirmationId"
                >
                  Confirmation Id
                </label>
                <input
                  className="belowLegendInput"
                  type="text"
                  name="registerConfirmationId"
                  id="registerConfirmationId"
                  required
                  ref={registerConfirmationIdRef}
                  placeholder="Paste code here"
                  autoFocus
                  onChange={handleChange}
                  onKeyDown={onEnterKeyPressOnConfirmationId}
                />
                {showConfirmationIdError && (
                  <p className="registerErrorDisplay registerFieldsError">
                    {confirmationIdErrorMessage}
                  </p>
                )}
                <input
                  onClick={onRegisterStep2}
                  className="registerButton"
                  type="submit"
                  value="Create Account"
                />
                <input
                  onClick={onResendEmail}
                  className="registerButton"
                  type="submit"
                  value="Resend Email"
                />
              </div>
            )}
          </fieldset>
          <div className="belowRegisterButtonDiv">
            {registerStepNum === 2 && (
              <span className="belowRegisterButtonSpan1">
                Or, if you already have an account, go back to
              </span>
            )}
            <span
              ref={signinLinkRef}
              onClick={() => navigate("/signin")}
              className="signinLinkInRegister"
            >
              Sign In
            </span>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Register;
