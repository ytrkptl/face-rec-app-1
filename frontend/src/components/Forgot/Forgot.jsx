import { useState, useRef, useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import "./Forgot.css";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const [forgotState, setForgotState] = useState({
    forgotEmail: "",
    resetId: "",
    newPassword: "",
    confirmNewPassword: "",
    errorMessage: ``,
    forgotEmailErrorMessage: "",
    resetIdErrorMessage: "",
    newPasswordErrorMessage: ``,
    confirmPasswordErrorMessage: ``,
    step2StatusMessage: ``,
    step3StatusMessage: ``,
    showError: false,
    showForgotEmailError: false,
    showResetIdError: false,
    showNewPasswordError: false,
    showConfirmPasswordError: false,
    showSpinner: null,
    proceed: false,
    showStep2Status: false,
    showStep3Status: false,
    stepNumber: 1
  });
  const {
    forgotEmail,
    resetId,
    newPassword,
    confirmNewPassword,
    errorMessage,
    forgotEmailErrorMessage,
    resetIdErrorMessage,
    newPasswordErrorMessage,
    confirmPasswordErrorMessage,
    step2StatusMessage,
    step3StatusMessage,
    showError,
    showForgotEmailError,
    showResetIdError,
    showNewPasswordError,
    showConfirmPasswordError,
    showSpinner,
    proceed,
    showStep2Status,
    showStep3Status,
    stepNumber
  } = forgotState;

  const forgotEmailRef = useRef(null);
  const resetIdRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    forgotEmailRef.current.focus();
  }, []);

  useEffect(() => {
    if (stepNumber === 1 && forgotEmailRef.current) {
      if (forgotEmailRef.current.validity.valid === true && showForgotEmailError === true) {
        setForgotState({ ...forgotState, showForgotEmailError: false });
      } else if (forgotEmailRef.current.validity.valid === false && showForgotEmailError === false) {
        setForgotState({ ...forgotState, showForgotEmailError: true });
      }
    } else if (stepNumber === 2 && resetIdRef.current) {
      if (resetIdRef.current.validity.valid && showResetIdError) {
        setForgotState({ ...forgotState, showResetIdError: false });
      } else if (resetId !== "" && !resetIdRef.current.validity.valid && !showResetIdError) {
        setForgotState({ ...forgotState, showResetIdError: true });
      }
    } else if (stepNumber === 3 && newPasswordRef.current && confirmNewPasswordRef.current) {
      if (newPasswordRef.current.validity.valid && showNewPasswordError) {
        setForgotState({ ...forgotState, showNewPasswordError: false });
      } else if (!newPasswordRef.current.validity.valid && !showNewPasswordError) {
        setForgotState({ ...forgotState, showNewPasswordError: true });
      }
      if (confirmNewPasswordRef.current.validity.valid && showConfirmPasswordError) {
        setForgotState({ ...forgotState, showConfirmPasswordError: false });
      } else if (!confirmNewPasswordRef.current.validity.valid && !showConfirmPasswordError) {
        setForgotState({ ...forgotState, showConfirmPasswordError: true });
      }
      if (newPasswordRef.current.validity.valid && confirmNewPasswordRef.current.validity.valid) {
        if (!showError) {
          if (newPasswordRef.current.value !== confirmNewPasswordRef.current.value) {
            onShowError(true);
          }
        } else {
          if (newPasswordRef.current.value === confirmNewPasswordRef.current.value) {
            onShowError(false);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    forgotEmail,
    resetId,
    newPassword,
    confirmNewPassword,
    stepNumber,
    showForgotEmailError,
    forgotState,
    showResetIdError,
    showNewPasswordError,
    showConfirmPasswordError,
    showError
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForgotState({ ...forgotState, [name]: value });
  };

  const onForgotEmailError = (show) => {
    if (show) {
      setForgotState({
        ...forgotState,
        showForgotEmailError: true,
        forgotEmailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`
      });
      forgotEmailRef.current.classList.add("highlightClassInForgot");
      forgotEmailRef.current.focus();
      return;
    }
    setForgotState({
      ...forgotState,
      showForgotEmailError: false
    });
    forgotEmailRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  const onEnterKeyPressOnEmail = (event) => {
    if (event.key === "Enter" && forgotEmail === "") {
      onForgotEmailError(true);
    } else if (event.key === "Enter" && forgotEmailRef.current.validity.typeMismatch) {
      onForgotEmailError(true);
    } else if (event.key === "Enter" && !forgotEmailRef.current.validity.typeMismatch) {
      onForgotEmailError(false);
      onSubmitForgotStep1();
    }
  };

  const onResetIdError = (show) => {
    if (show) {
      setForgotState({
        ...forgotState,
        showResetIdError: true,
        resetIdErrorMessage: "Reset Id is a required field"
      });
      resetIdRef.current.classList.add("highlightClassInForgot");
      resetIdRef.current.focus();
      return;
    }
    setForgotState({ ...forgotState, showResetIdError: false });
    resetIdRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  const onEnterKeyPressOnResetId = (event) => {
    if (event.key === "Enter" && resetId === "") {
      onResetIdError(true);
    } else if (event.key === "Enter" && resetId !== "") {
      onResetIdError(false);
      onSubmitResetId();
    }
  };

  const onPasswordError = (show) => {
    if (show) {
      setForgotState({
        ...forgotState,
        showNewPasswordError: true,
        newPasswordErrorMessage: "Password is a required field and must be between 8 - 10 characters."
      });
      newPasswordRef.current.classList.add("highlightClassInForgot");
      newPasswordRef.current.focus();
      return;
    }
    setForgotState({ ...forgotState, showNewPasswordError: false });
    newPasswordRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  const onEnterKeyPressOnPassword = (event) => {
    if (event.key === "Enter" && newPassword.length < 8) {
      onPasswordError(true);
    } else if (event.key === "Enter" && !newPasswordRef.current.validity.valid) {
      onPasswordError(true);
    } else if (event.key === "Enter" && newPassword.length >= 8) {
      onPasswordError(false);
      if (confirmNewPassword === "") {
        confirmNewPasswordRef.current.focus();
      } else {
        onPasswordReset();
      }
    }
  };

  const onConfirmPasswordError = (show) => {
    if (show) {
      setForgotState({
        ...forgotState,
        showConfirmPasswordError: true,
        confirmPasswordErrorMessage: `Confirm New Password is a required field and must be between 8 - 10 characters`
      });
      confirmNewPasswordRef.current.classList.add("highlightClassInForgot");
      confirmNewPasswordRef.current.focus();
      return;
    }
    setForgotState({ ...forgotState, showConfirmPasswordError: false });
    confirmNewPasswordRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  const onEnterKeyPressOnConfirmPassword = (event) => {
    if (event.key === "Enter" && confirmNewPasswordRef.current.value.length < 8) {
      onConfirmPasswordError(true);
      return;
    } else if (event.key === "Enter" && !confirmNewPasswordRef.current.validity.valid) {
      onConfirmPasswordError(true);
      return;
    } else if (event.key === "Enter" && confirmNewPasswordRef.current.value.length >= 8) {
      onConfirmPasswordError(false);
      if (newPassword === "") {
        newPasswordRef.current.focus();
      } else {
        onPasswordReset();
      }
    }
  };

  const onSubmitForgotStep1 = () => {
    if (forgotEmail === "" || forgotEmailRef.current.validity.typeMismatch) {
      onForgotEmailError(true);
    } else {
      onForgotEmailError(false);
      setForgotState({ ...forgotState, showSpinner: true });
      fetch(`/api/forgot`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourEmail: forgotEmail
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setForgotState({
            ...forgotState,
            showSpinner: false,
            stepNumber: 2,
            showStep2Status: true,
            step2StatusMessage: data
          });
        })
        .catch((err) => {
          if (err) {
            setForgotState({
              ...forgotState,
              forgotEmailErrorMessage: true,
              showSpinner: false
            });
          }
        });
    }
  };

  const onSubmitResetId = () => {
    if (resetId === "" || !resetIdRef?.current?.validity.valid) {
      onResetIdError(true);
    } else {
      setForgotState({
        ...forgotState,
        showStep2Status: false,
        showSpinner: true
      });
      fetch(`/api/reset`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetId: resetId,
          yourEmail: forgotEmail
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === "Reset Id matches") {
            setForgotState({
              ...forgotState,
              showSpinner: false,
              stepNumber: 3,
              proceed: true,
              showResetIdError: false
            });
          } else if (data === "Reset Id did not match") {
            setForgotState({
              ...forgotState,
              showSpinner: false,
              stepNumber: 2,
              proceed: false,
              resetIdErrorMessage: `${data}`,
              showResetIdError: true
            });
          }
        })
        .catch(() =>
          setForgotState({
            ...forgotState,
            showSpinner: false,
            stepNumber: 2,
            proceed: false,
            showResetIdError: true
          })
        );
    }
  };

  const onShowError = (show) => {
    if (show) {
      setForgotState({
        ...forgotState,
        showError: true,
        errorMessage: `Passwords must match`
      });
      newPasswordRef.current.classList.add("passwordsDontMatchClass");
      confirmNewPasswordRef.current.classList.add("passwordsDontMatchClass");
      confirmNewPasswordRef.current.focus();
      return;
    }
    setForgotState({ ...forgotState, showError: false });
    newPasswordRef.current.classList.remove("passwordsDontMatchClass");
    confirmNewPasswordRef.current.classList.remove("passwordsDontMatchClass");
    return;
  };

  const onPasswordReset = () => {
    if (newPassword === "" && confirmNewPassword === "") {
      onPasswordError(true);
      onConfirmPasswordError(true);
      return;
    } else if (!newPasswordRef.current.validity.valid) {
      onPasswordError(true);
      return;
    } else if (!confirmNewPasswordRef.current.validity.valid) {
      onConfirmPasswordError(true);
      return;
    } else if (newPasswordRef?.current?.value !== confirmNewPasswordRef.current.value) {
      onShowError(true);
      return;
    } else {
      onPasswordError(false);
      onConfirmPasswordError(false);
      setForgotState({ ...forgotState, showSpinner: true });
      fetch(`/api/update-new-password`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourEmail: forgotEmail,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword
        })
      })
        .then((response) => response.json())
        .then((data) => {
          setForgotState({ ...forgotState, showSpinner: false });
          if (data === "Password reset complete.") {
            setForgotState({
              ...forgotState,
              showStep3Status: true,
              step3StatusMessage: `Password was successfully updated. Now taking you back to the sign in page.`
            });
            setTimeout(() => navigate("signin"), 3000);
          } else {
            setForgotState({
              ...forgotState,
              showSpinner: false,
              stepNumber: 3,
              showStep3Status: true,
              step3StatusMessage: "Something went wrong. Please retry."
            });
          }
        })
        .catch(() => {
          setForgotState({
            ...forgotState,
            showSpinner: false,
            stepNumber: 3,
            showStep3Status: true,
            step3StatusMessage: "Something went wrong. Please retry."
          });
        });
    }
  };

  return (
    <article className="forgotArticle">
      <main className="forgotMain">
        <div className="forgotMeasure">
          <fieldset
            id="forgot"
            className="forgotFieldset">
            <legend className="forgotLegend">Reset Password</legend>
            <h4 className="steps">{`Step ${stepNumber} of 3`}</h4>
            {showStep2Status && <p className="forgotErrorDisplay">{step2StatusMessage}</p>}
            {showSpinner === null && proceed === false ? (
              <div className="belowLegendDivInForgot">
                <label
                  className="belowLegendLabelInForgot"
                  htmlFor="forgotEmail">
                  Email
                </label>
                <input
                  className="belowLegendInputInForgot"
                  type="email"
                  name="forgotEmail"
                  id="forgotEmail"
                  required
                  ref={forgotEmailRef}
                  onChange={handleChange}
                  onKeyDown={onEnterKeyPressOnEmail}
                />
                {showForgotEmailError && forgotEmailErrorMessage !== "" && (
                  <p className="forgotErrorDisplay">{forgotEmailErrorMessage}</p>
                )}
                <input
                  onClick={onSubmitForgotStep1}
                  className="forgotButtonInForgot"
                  type="button"
                  value="Send Email"
                />
              </div>
            ) : (
              showSpinner === false &&
              proceed === false && (
                <div className="belowLegendDivInForgot">
                  <label
                    className="belowLegendLabelInForgot"
                    htmlFor="resetId">
                    Reset ID
                  </label>
                  <input
                    className="belowLegendInputInForgot"
                    type="text"
                    name="resetId"
                    id="resetId"
                    required
                    ref={resetIdRef}
                    onChange={handleChange}
                    onKeyDown={onEnterKeyPressOnResetId}
                  />
                  {showResetIdError && resetIdErrorMessage !== "" && (
                    <p className="forgotErrorDisplay">{resetIdErrorMessage}</p>
                  )}
                  <input
                    onClick={onSubmitResetId}
                    className="forgotButtonInForgot"
                    type="button"
                    value="Submit Code"
                  />
                </div>
              )
            )}
            {proceed && (
              <div className="belowLegendDivInForgot">
                <label
                  className="belowLegendLabelInForgot"
                  htmlFor="newPassword">
                  New Password
                </label>
                <input
                  className="belowLegendInputInForgot"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  minLength={8}
                  maxLength={10}
                  ref={newPasswordRef}
                  onChange={handleChange}
                  onKeyDown={onEnterKeyPressOnPassword}
                />
                {showNewPasswordError && newPasswordErrorMessage !== "" && (
                  <p className="forgotErrorDisplay">{newPasswordErrorMessage}</p>
                )}
                {showError && <p className="forgotErrorDisplay forgotFieldsError">{errorMessage}</p>}
              </div>
            )}
            {proceed && (
              <div className="belowLegendDivInForgot">
                <label
                  className="belowLegendLabelInForgot"
                  htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  className="belowLegendInputInForgot"
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  required
                  minLength={8}
                  maxLength={10}
                  ref={confirmNewPasswordRef}
                  onChange={handleChange}
                  onKeyDown={onEnterKeyPressOnConfirmPassword}
                />
                {showConfirmPasswordError && confirmPasswordErrorMessage !== "" && (
                  <p className="forgotErrorDisplay">{confirmPasswordErrorMessage}</p>
                )}
                {showError && <p className="forgotErrorDisplay forgotFieldsError">{errorMessage}</p>}
                {showStep3Status && <p className="forgotErrorDisplay forgotFieldsError">{step3StatusMessage}</p>}
              </div>
            )}
            {proceed && (
              <div>
                <input
                  onClick={onPasswordReset}
                  className="forgotButtonInForgot"
                  type="button"
                  value="Reset Password"
                />
              </div>
            )}
          </fieldset>
          <Spinner showSpinner={showSpinner} />
          <div className="belowForgotButtonDiv">
            <p
              onClick={() => navigate("/signin")}
              className="registerLinkInForgot">
              Go Back to Sign In
            </p>
            <p
              onClick={() => navigate("/register")}
              className="registerLinkInForgot">
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Forgot;
