import React, { createRef } from "react";
import Spinner from "../Spinner/Spinner";
import "./Forgot.css";
import { withRouter } from "react-router-dom";

class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      passwordsMatch: false,
      showStep2Status: false,
      showStep3Status: false,
      stepNumber: 1,
    };
    this.forgotEmailRef = createRef();
    this.resetIdRef = createRef();
    this.newPasswordRef = createRef();
    this.confirmNewPasswordRef = createRef();
  }

  componentDidMount() {
    this.forgotEmailRef.current.focus();
  }

  componentDidUpdate() {
    if (this.state.stepNumber === 1 && this.forgotEmailRef.current) {
      if (
        this.forgotEmailRef.current.validity.valid === true &&
        this.state.showForgotEmailError === true
      ) {
        this.setState({ showForgotEmailError: false });
      } else if (
        this.forgotEmailRef.current.validity.valid === false &&
        this.state.showForgotEmailError === false
      ) {
        this.setState({ showForgotEmailError: true });
      }
    } else if (this.state.stepNumber === 2 && this.resetIdRef.current) {
      if (
        this.resetIdRef.current.validity.valid &&
        this.state.showResetIdError
      ) {
        this.setState({ showResetIdError: false });
      } else if (
        this.state.resetId !== "" &&
        !this.resetIdRef.current.validity.valid &&
        !this.state.showResetIdError
      ) {
        this.setState({ showResetIdError: true });
      }
    } else if (
      this.state.stepNumber === 3 &&
      this.newPasswordRef.current &&
      this.confirmNewPasswordRef.current
    ) {
      if (
        this.newPasswordRef.current.validity.valid &&
        this.state.showNewPasswordError
      ) {
        this.setState({ showNewPasswordError: false });
      } else if (
        !this.newPasswordRef.current.validity.valid &&
        !this.state.showNewPasswordError
      ) {
        this.setState({ showNewPasswordError: true });
      }
      if (
        this.confirmNewPasswordRef.current.validity.valid &&
        this.state.showConfirmPasswordError
      ) {
        this.setState({ showConfirmPasswordError: false });
      } else if (
        !this.confirmNewPasswordRef.current.validity.valid &&
        !this.state.showConfirmPasswordError
      ) {
        this.setState({ showConfirmPasswordError: true });
      }
      if (
        this.newPasswordRef.current.validity.valid &&
        this.confirmNewPasswordRef.current.validity.valid
      ) {
        if (!this.state.showError) {
          if (
            this.newPasswordRef.current.value !==
            this.confirmNewPasswordRef.current.value
          ) {
            this.onShowError(true);
          }
        } else {
          if (
            this.newPasswordRef.current.value ===
            this.confirmNewPasswordRef.current.value
          ) {
            this.onShowError(false);
          }
        }
      }
    }
  }

  onEmailChange = (event) => {
    this.setState({ forgotEmail: event.target.value });
  };

  onForgotEmailError = (show) => {
    if (show) {
      this.setState({
        showForgotEmailError: true,
        forgotEmailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`,
      });
      this.forgotEmailRef.current.classList.add("highlightClassInForgot");
      this.forgotEmailRef.current.focus();
      return;
    }
    this.setState({ showForgotEmailError: false });
    this.forgotEmailRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  onEnterKeyPressOnEmail = (event) => {
    if (event.key === "Enter" && this.state.forgotEmail === "") {
      this.onForgotEmailError(true);
    } else if (
      event.key === "Enter" &&
      this.forgotEmailRef.current.validity.typeMismatch
    ) {
      this.onForgotEmailError(true);
    } else if (
      event.key === "Enter" &&
      !this.forgotEmailRef.current.validity.typeMismatch
    ) {
      this.onForgotEmailError(false);
      this.onSubmitForgotStep1();
    }
  };

  onResetIdChange = (event) => {
    this.setState({ resetId: event.target.value });
  };

  onResetIdError = (show) => {
    if (show) {
      this.setState({
        showResetIdError: true,
        resetIdErrorMessage: "Reset Id is a required field",
      });
      this.resetIdRef.current.classList.add("highlightClassInForgot");
      this.resetIdRef.current.focus();
      return;
    }
    this.setState({ showResetIdError: false });
    this.resetIdRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  onEnterKeyPressOnResetId = (event) => {
    if (event.key === "Enter" && this.state.resetId === "") {
      this.onResetIdError(true);
    } else if (event.key === "Enter" && this.state.resetId !== "") {
      this.onResetIdError(false);
      this.onSubmitResetId();
    }
  };

  onNewPasswordChange = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  onPasswordError = (show) => {
    if (show) {
      this.setState({
        showNewPasswordError: true,
        newPasswordErrorMessage:
          "Password is a required field and must be between 8 - 10 characters.",
      });
      this.newPasswordRef.current.classList.add("highlightClassInForgot");
      this.newPasswordRef.current.focus();
      return;
    }
    this.setState({ showNewPasswordError: false });
    this.newPasswordRef.current.classList.remove("highlightClassInForgot");
    return;
  };

  onEnterKeyPressOnPassword = (event) => {
    if (event.key === "Enter" && this.state.newPassword.length < 8) {
      this.onPasswordError(true);
    } else if (
      event.key === "Enter" &&
      !this.newPasswordRef.current.validity.valid
    ) {
      this.onPasswordError(true);
    } else if (event.key === "Enter" && this.state.newPassword.length >= 8) {
      this.onPasswordError(false);
      if (this.state.confirmNewPassword === "") {
        this.confirmNewPasswordRef.current.focus();
      } else {
        this.onPasswordReset();
      }
    }
  };

  onConfirmNewPasswordChange = (event) => {
    this.setState({ confirmNewPassword: event.target.value });
  };

  onConfirmPasswordError = (show) => {
    if (show) {
      this.setState({
        showConfirmPasswordError: true,
        confirmPasswordErrorMessage: `Confirm New Password is a required field and must be between 8 - 10 characters`,
      });
      this.confirmNewPasswordRef.current.classList.add(
        "highlightClassInForgot"
      );
      this.confirmNewPasswordRef.current.focus();
      return;
    }
    this.setState({ showConfirmPasswordError: false });
    this.confirmNewPasswordRef.current.classList.remove(
      "highlightClassInForgot"
    );
    return;
  };

  onEnterKeyPressOnConfirmPassword = (event) => {
    if (
      event.key === "Enter" &&
      this.confirmNewPasswordRef.current.value.length < 8
    ) {
      this.onConfirmPasswordError(true);
      return;
    } else if (
      event.key === "Enter" &&
      !this.confirmNewPasswordRef.current.validity.valid
    ) {
      this.onConfirmPasswordError(true);
      return;
    } else if (
      event.key === "Enter" &&
      this.confirmNewPasswordRef.current.value.length >= 8
    ) {
      this.onConfirmPasswordError(false);
      if (this.state.newPassword === "") {
        this.newPasswordRef.current.focus();
      } else {
        this.onPasswordReset();
      }
    }
  };

  onSubmitForgotStep1 = () => {
    if (
      this.state.forgotEmail === "" ||
      this.forgotEmailRef.current.validity.typeMismatch
    ) {
      this.onForgotEmailError(true);
    } else {
      this.onForgotEmailError(false);
      this.setState({ showSpinner: true });
      fetch(`/forgot`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourEmail: this.state.forgotEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            showSpinner: false,
            stepNumber: 2,
            showStep2Status: true,
            step2StatusMessage: data,
          });
        })
        .catch((err) => {
          if (err) {
            this.setState({
              forgotEmailErrorMessage: true,
              showSpinner: false,
            });
          }
        });
    }
  };

  onSubmitResetId = () => {
    if (this.state.resetId === "" || !this.resetIdRef.current.validity.valid) {
      this.onResetIdError(true);
    } else {
      this.setState({ showStep2Status: false, showSpinner: true });
      fetch(`/reset`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetId: this.state.resetId,
          yourEmail: this.state.forgotEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === "Reset Id matches") {
            this.setState({
              showSpinner: false,
              stepNumber: 3,
              proceed: true,
              showResetIdError: false,
            });
          } else if (data === "Reset Id did not match") {
            this.setState({
              showSpinner: false,
              stepNumber: 2,
              proceed: false,
              resetIdErrorMessage: `${data}`,
              showResetIdError: true,
            });
          }
        })
        .catch((err) =>
          this.setState({
            showSpinner: false,
            stepNumber: 2,
            proceed: false,
            showResetIdError: true,
          })
        );
    }
  };

  onShowError = (show) => {
    if (show) {
      this.setState({ showError: true, errorMessage: `Passwords must match` });
      this.newPasswordRef.current.classList.add("passwordsDontMatchClass");
      this.confirmNewPasswordRef.current.classList.add(
        "passwordsDontMatchClass"
      );
      this.confirmNewPasswordRef.current.focus();
      return;
    }
    this.setState({ showError: false });
    this.newPasswordRef.current.classList.remove("passwordsDontMatchClass");
    this.confirmNewPasswordRef.current.classList.remove(
      "passwordsDontMatchClass"
    );
    return;
  };

  onPasswordReset = () => {
    if (this.state.newPassword === "" && this.state.confirmNewPassword === "") {
      this.onPasswordError(true);
      this.onConfirmPasswordError(true);
      return;
    } else if (!this.newPasswordRef.current.validity.valid) {
      this.onPasswordError(true);
      return;
    } else if (!this.confirmNewPasswordRef.current.validity.valid) {
      this.onConfirmPasswordError(true);
      return;
    } else if (
      this.newPasswordRef.current.value !==
      this.confirmNewPasswordRef.current.value
    ) {
      this.onShowError(true);
      return;
    } else {
      this.onPasswordError(false);
      this.onConfirmPasswordError(false);
      this.setState({ showSpinner: true });
      fetch(`/update-new-password`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yourEmail: this.state.forgotEmail,
          newPassword: this.state.newPassword,
          confirmNewPassword: this.state.confirmNewPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ showSpinner: false });
          if (data === "Password reset complete.") {
            this.setState({
              showStep3Status: true,
              step3StatusMessage: `Password was successfully updated. Now taking you back to the sign in page.`,
            });
            setTimeout(() => this.props.history.push("signin"), 3000);
          } else {
            this.setState({
              showSpinner: false,
              stepNumber: 3,
              showStep3Status: true,
              step3StatusMessage: "Something went wrong. Please retry.",
            });
          }
        })
        .catch((err) => {
          this.setState({
            showSpinner: false,
            stepNumber: 3,
            showStep3Status: true,
            step3StatusMessage: "Something went wrong. Please retry.",
          });
        });
    }
  };

  render() {
    return (
      <article className="forgotArticle">
        <main className="forgotMain">
          <div className="forgotMeasure">
            <fieldset id="forgot" className="forgotFieldset">
              <legend className="forgotLegend">Reset Password</legend>
              <h4 className="steps">{`Step ${this.state.stepNumber} of 3`}</h4>
              {this.state.showStep2Status && (
                <p className="forgotErrorDisplay">
                  {this.state.step2StatusMessage}
                </p>
              )}
              {this.state.showSpinner === null &&
              this.state.proceed === false ? (
                <div className="belowLegendDivInForgot">
                  <label
                    className="belowLegendLabelInForgot"
                    htmlFor="forgot-email-address"
                  >
                    Email
                  </label>
                  <input
                    className="belowLegendInputInForgot"
                    type="email"
                    name="email-address"
                    id="forgot-email-address"
                    required
                    ref={this.forgotEmailRef}
                    onChange={this.onEmailChange}
                    onKeyDown={this.onEnterKeyPressOnEmail}
                  />
                  {this.state.showForgotEmailError &&
                    this.state.forgotEmailErrorMessage !== "" && (
                      <p className="forgotErrorDisplay">
                        {this.state.forgotEmailErrorMessage}
                      </p>
                    )}
                  <input
                    onClick={this.onSubmitForgotStep1}
                    className="forgotButtonInForgot"
                    type="button"
                    value="Send Email"
                  />
                </div>
              ) : (
                this.state.showSpinner === false &&
                this.state.proceed === false && (
                  <div className="belowLegendDivInForgot">
                    <label
                      className="belowLegendLabelInForgot"
                      htmlFor="reset-id"
                    >
                      Reset ID
                    </label>
                    <input
                      className="belowLegendInputInForgot"
                      type="text"
                      name="reset-id"
                      id="reset-id"
                      required
                      ref={this.resetIdRef}
                      onChange={this.onResetIdChange}
                      onKeyDown={this.onEnterKeyPressOnResetId}
                    />
                    {this.state.showResetIdError &&
                      this.state.resetIdErrorMessage !== "" && (
                        <p className="forgotErrorDisplay">
                          {this.state.resetIdErrorMessage}
                        </p>
                      )}
                    <input
                      onClick={this.onSubmitResetId}
                      className="forgotButtonInForgot"
                      type="button"
                      value="Submit Code"
                    />
                  </div>
                )
              )}
              {this.state.proceed && (
                <div className="belowLegendDivInForgot">
                  <label
                    className="belowLegendLabelInForgot"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <input
                    className="belowLegendInputInForgot"
                    type="password"
                    name="new-password"
                    id="new-password"
                    required
                    minLength={8}
                    maxLength={10}
                    ref={this.newPasswordRef}
                    onChange={this.onNewPasswordChange}
                    onKeyDown={this.onEnterKeyPressOnPassword}
                  />
                  {this.state.showNewPasswordError &&
                    this.state.newPasswordErrorMessage !== "" && (
                      <p className="forgotErrorDisplay">
                        {this.state.newPasswordErrorMessage}
                      </p>
                    )}
                  {this.state.showError && (
                    <p className="forgotErrorDisplay forgotFieldsError">
                      {this.state.errorMessage}
                    </p>
                  )}
                </div>
              )}
              {this.state.proceed && (
                <div className="belowLegendDivInForgot">
                  <label
                    className="belowLegendLabelInForgot"
                    htmlFor="confirm-new-password"
                  >
                    Confirm New Password
                  </label>
                  <input
                    className="belowLegendInputInForgot"
                    type="password"
                    name="confirm-new-password"
                    id="confirm-new-password"
                    required
                    minLength={8}
                    maxLength={10}
                    ref={this.confirmNewPasswordRef}
                    onChange={this.onConfirmNewPasswordChange}
                    onKeyDown={this.onEnterKeyPressOnConfirmPassword}
                  />
                  {this.state.showConfirmPasswordError &&
                    this.state.confirmPasswordErrorMessage !== "" && (
                      <p className="forgotErrorDisplay">
                        {this.state.confirmPasswordErrorMessage}
                      </p>
                    )}
                  {this.state.showError && (
                    <p className="forgotErrorDisplay forgotFieldsError">
                      {this.state.errorMessage}
                    </p>
                  )}
                  {this.state.showStep3Status && (
                    <p className="forgotErrorDisplay forgotFieldsError">
                      {this.state.step3StatusMessage}
                    </p>
                  )}
                </div>
              )}
              {this.state.proceed && (
                <div>
                  <input
                    onClick={this.onPasswordReset}
                    className="forgotButtonInForgot"
                    type="button"
                    value="Reset Password"
                  />
                </div>
              )}
            </fieldset>
            <Spinner showSpinner={this.state.showSpinner} />
            <div className="belowForgotButtonDiv">
              <p
                onClick={() => this.props.history.push("signin")}
                className="registerLinkInForgot"
              >
                Go Back to Sign In
              </p>
              <p
                onClick={() => this.props.history.push("register")}
                className="registerLinkInForgot"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default withRouter(Forgot);
