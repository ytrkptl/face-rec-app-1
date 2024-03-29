import React, { createRef } from "react";
import Spinner from "../Spinner/Spinner";
import "./Register.css";
import { withRouter } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
    this.registerNameRef = createRef();
    this.registerEmailRef = createRef();
    this.registerPasswordRef = createRef();
    this.registerConfirmationIdRef = createRef();
    this.signinLinkRef = createRef();
  }

  componentDidMount() {
    this.registerNameRef.current.focus();
  }

  componentDidUpdate() {
    if (this.state.registerStepNum === 1) {
      if (
        this.registerNameRef.current.validity.valid &&
        this.state.showNameError
      ) {
        this.setState({ showNameError: false });
      } else if (
        !this.registerNameRef.current.validity.valid &&
        !this.state.showNameError
      ) {
        this.setState({ showNameError: true });
      }
      if (
        this.registerEmailRef.current.validity.valid === true &&
        this.state.showEmailError === true
      ) {
        this.setState({ showEmailError: false });
      } else if (
        this.registerEmailRef.current.validity.valid === false &&
        this.state.showEmailError === false
      ) {
        this.setState({ showEmailError: true });
      }
      if (
        this.registerPasswordRef.current.validity.valid === true &&
        this.state.showPasswordError === true
      ) {
        this.setState({ showPasswordError: false });
      } else if (
        this.registerPasswordRef.current.validity.valid === false &&
        this.state.showPasswordError === false
      ) {
        this.setState({ showPasswordError: true });
      }
    } else {
      if (
        this.registerConfirmationIdRef.current.validity.valid &&
        this.state.showConfirmationIdError
      ) {
        this.setState({ showConfirmationIdError: false });
      } else if (
        !this.registerConfirmationIdRef.current.validity.valid &&
        !this.state.showConfirmationIdError
      ) {
        this.setState({ showConfirmationIdError: true });
      }
    }

    if (this.state.successData) {
      if (this.state.showError) {
        this.setState({ successData: false });
      }
    }
  }

  onNameChange = (event) => {
    this.setState({ registerName: event.target.value });
  };

  onNameError = (show) => {
    if (show) {
      this.setState({
        showNameError: true,
        nameErrorMessage: "Name is a required field",
      });
      this.registerNameRef.current.classList.add("highlightClassInRegister");
      this.registerNameRef.current.focus();
      return;
    }
    this.setState({ showNameError: false });
    this.registerNameRef.current.classList.remove("highlightClassInRegister");
    return;
  };

  onEnterKeyPressOnName = (event) => {
    if (event.key === "Enter" && this.state.registerName === "") {
      this.onNameError(true);
    } else if (event.key === "Enter" && this.state.registerName !== "") {
      this.onNameError(false);
      if (this.state.registerEmail === "") {
        this.registerEmailRef.current.focus();
      } else if (this.state.registerPassword === "") {
        this.registerPasswordRef.current.focus();
      } else {
        this.onRegisterStep1();
      }
    }
  };

  onEmailChange = (event) => {
    this.setState({ registerEmail: event.target.value });
  };

  onEmailError = (show) => {
    if (show) {
      this.setState({
        showEmailError: true,
        emailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com`,
      });
      this.registerEmailRef.current.classList.add("highlightClassInRegister");
      this.registerEmailRef.current.focus();
      return;
    }
    this.setState({ showEmailError: false });
    this.registerEmailRef.current.classList.remove("highlightClassInRegister");
    return;
  };

  onEnterKeyPressOnEmail = (event) => {
    if (event.key === "Enter" && this.state.registerEmail === "") {
      this.onEmailError(true);
    } else if (
      event.key === "Enter" &&
      this.registerEmailRef.current.validity.typeMismatch
    ) {
      this.onEmailError(true);
    } else if (
      event.key === "Enter" &&
      !this.registerEmailRef.current.validity.typeMismatch
    ) {
      this.onEmailError(false);
      if (this.state.registerName === "") {
        this.registerNameRef.current.focus();
      } else if (this.state.registerPassword === "") {
        this.registerPasswordRef.current.focus();
      } else {
        this.onRegisterStep1();
      }
    }
  };

  onPasswordChange = (event) => {
    this.setState({ registerPassword: event.target.value });
  };

  onPasswordError = (showPasswordError) => {
    if (showPasswordError) {
      this.setState({
        showPasswordError: true,
        passwordErrorMessage:
          "Password is a required field and must be between 8 - 10 characters.",
      });
      this.registerPasswordRef.current.classList.add(
        "highlightClassInRegister"
      );
      this.registerPasswordRef.current.focus();
      return;
    }
    this.setState({ showPasswordError: false });
    this.registerPasswordRef.current.classList.remove(
      "highlightClassInRegister"
    );
    return;
  };

  onEnterKeyPressOnPassword = (event) => {
    if (event.key === "Enter" && this.state.registerPassword.length < 8) {
      this.onPasswordError(true);
    } else if (
      event.key === "Enter" &&
      !this.registerPasswordRef.current.validity.valid
    ) {
      this.onPasswordError(true);
    } else if (
      event.key === "Enter" &&
      this.state.registerPassword.length >= 8
    ) {
      this.onPasswordError(false);
      if (this.state.registerName === "") {
        this.registerNameRef.current.focus();
      } else if (this.state.registerEmail === "") {
        this.registerEmailRef.current.focus();
      } else {
        this.onRegisterStep1();
      }
    }
  };

  onConfirmationIdChange = (event) => {
    this.setState({ registerConfirmationId: event.target.value });
  };

  onConfirmationIdError = (show) => {
    if (show) {
      this.setState({
        showConfirmationIdError: true,
        confirmationIdErrorMessage:
          "Confirmation Id is required and must match the code you received via email",
      });
      this.registerConfirmationIdRef.current.classList.add(
        "highlightClassInRegister"
      );
      this.registerConfirmationIdRef.current.focus();
      return;
    }
    this.setState({ showConfirmationIdError: false });
    this.registerConfirmationIdRef.current.classList.remove(
      "highlightClassInRegister"
    );
    return;
  };

  onEnterKeyPressOnConfirmationId = (event) => {
    if (event.key === "Enter" && this.state.registerConfirmationId === "") {
      this.onConfirmationIdError(true);
    } else if (
      event.key === "Enter" &&
      this.state.registerConfirmationId !== ""
    ) {
      this.onConfirmationIdError(false);
      this.onRegisterStep2();
    }
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  onSubmitForm = (event) => {
    event.preventDefault();
  };

  onRegisterStep1 = async () => {
    if (this.state.registerStepNum === 1) {
      if (this.registerPasswordRef.current.value.length < 8) {
        this.onPasswordError(true);
      } else {
        this.onPasswordError(false);
      }
      if (
        this.state.registerEmail === "" ||
        this.registerEmailRef.current.validity.typeMismatch
      ) {
        this.onEmailError(true);
      } else {
        this.onEmailError(false);
      }
      if (this.state.registerName === "") {
        this.onNameError(true);
      } else {
        this.onNameError(false);
      }
    }
    if (
      !this.state.showNameError &&
      !this.state.showEmailError &&
      !this.state.showPasswordError &&
      this.state.registerName !== "" &&
      this.state.registerEmail !== "" &&
      this.state.registerPassword !== ""
    ) {
      this.setState({ showSpinner: true });
      this.signinLinkRef.current.classList.add("registerStep2");
      const response = await fetch(`/register-step-1`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.registerName,
          email: this.state.registerEmail,
          password: this.state.registerPassword,
        }),
      });
      const data = await response.json();
      if (response.status === 400) {
        this.setState({
          showError: true,
          showSpinner: false,
          registerStepNum: 1,
          errorMessage: `${data}`,
        });
      } else if (response.status === 200) {
        this.setState({
          showError: false,
          showSpinner: false,
          registerStepNum: 2,
          successData: true,
          successMessage: `${data}`,
        });
        this.signinLinkRef.current.classList.remove("step2Link");
      }
    }
    return;
  };

  onRegisterStep2 = async () => {
    try {
      if (this.state.registerConfirmationId === "") {
        this.onConfirmationIdError(true);
        return;
      }
      this.onConfirmationIdError(false);
      this.setState({ showSpinner: true });
      const response = await fetch(`/register-step-2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationId: this.state.registerConfirmationId,
        }),
      });
      const data = await response.json();
      if (data.userId && data.success === 200) {
        this.saveAuthTokenInSession(data.token);
        await this.getProfileAndSignIn(data);
        return;
      } else {
        this.setState({
          showError: true,
          errorMessage: `${data}`,
          showSpinner: false,
        });
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMessage: `Something went wrong. Please try again.`,
        showSpinner: false,
      });
    }
  };

  getProfileAndSignIn = async (data) => {
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
        this.props.loadUser(user);
        this.props.toggleSignIn(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error);
      }
      this.setState({
        showError: true,
        errorMessage: `Something went wrong. Please try again.`,
        showSpinner: false,
      });
    }
  };

  onResendEmail = () => {
    this.setState({ registerStepNum: 2, showSpinner: true });
    this.signinLinkRef.current.classList.add("registerStep2");
    fetch(`/register-step-1`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.registerName,
        email: this.state.registerEmail,
        password: this.state.registerPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          showError: false,
          showSpinner: false,
          registerStepNum: 2,
          successData: true,
          successMessage: `${data}`,
        });
        this.signinLinkRef.current.classList.remove("step2Link");
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(error);
        }
        this.setState({
          showError: true,
          showSpinner: false,
          registerStepNum: 1,
        });
      });
  };

  render() {
    return (
      <article className="registerArticle">
        <main className="registerMain">
          <div className="registerMeasure">
            <fieldset id="sign_up" className="registerFieldset">
              <legend className="registerLegend">Register</legend>
              <h4 className="register-steps">{`Step ${this.state.registerStepNum} of 2`}</h4>
              {this.state.showError && (
                <p className="registerErrorDisplay">
                  {this.state.errorMessage}
                </p>
              )}
              {this.state.successData && (
                <p className="registerErrorDisplay success">
                  {this.state.successMessage}
                </p>
              )}
              <Spinner showSpinner={this.state.showSpinner} />
              {this.state.registerStepNum === 1 ? (
                <div>
                  <div className="belowLegendDiv" onSubmit={this.onSubmitForm}>
                    <label className="belowLegendLabel" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="belowLegendInput"
                      type="text"
                      name="name"
                      id="name"
                      required
                      ref={this.registerNameRef}
                      placeholder="Enter name here"
                      onChange={this.onNameChange}
                      onKeyDown={this.onEnterKeyPressOnName}
                    />
                    {this.state.showNameError && (
                      <p className="registerErrorDisplay registerFieldsError">
                        {this.state.nameErrorMessage}
                      </p>
                    )}
                  </div>
                  <div className="belowLegendDiv" onSubmit={this.onSubmitForm}>
                    <label
                      className="belowLegendLabel"
                      htmlFor="register-email-address"
                    >
                      Email
                    </label>
                    <input
                      className="belowLegendInput"
                      type="email"
                      required
                      name="register-email-address"
                      id="register-email-address"
                      ref={this.registerEmailRef}
                      placeholder="Enter email here"
                      onChange={this.onEmailChange}
                      onKeyDown={this.onEnterKeyPressOnEmail}
                    />
                    {this.state.showEmailError && (
                      <p className="registerErrorDisplay registerFieldsError">
                        {this.state.emailErrorMessage}
                      </p>
                    )}
                  </div>
                  <div className="belowLegendDiv" onSubmit={this.onSubmitForm}>
                    <label
                      className="belowLegendLabel"
                      htmlFor="register-password"
                    >
                      Password
                    </label>
                    <input
                      className="belowLegendInput"
                      type="password"
                      name="register-password"
                      id="register-password"
                      required
                      ref={this.registerPasswordRef}
                      placeholder="sshhh"
                      minLength={8}
                      maxLength={10}
                      onChange={this.onPasswordChange}
                      onKeyDown={this.onEnterKeyPressOnPassword}
                    />
                    {this.state.showPasswordError && (
                      <p className="registerErrorDisplay registerFieldsError">
                        {this.state.passwordErrorMessage}
                      </p>
                    )}
                    <input
                      onClick={this.onRegisterStep1}
                      className="registerButton"
                      type="button"
                      value="Register"
                    />
                  </div>
                </div>
              ) : (
                <div className="belowLegendDiv" onSubmit={this.onSubmitForm}>
                  <label className="belowLegendLabel" htmlFor="confirmation-id">
                    Confirmation Id
                  </label>
                  <input
                    className="belowLegendInput"
                    type="text"
                    name="confirmation-id"
                    id="confirmation-id"
                    required
                    ref={this.registerConfirmationIdRef}
                    placeholder="Paste code here"
                    autoFocus
                    onChange={this.onConfirmationIdChange}
                    onKeyDown={this.onEnterKeyPressOnConfirmationId}
                  />
                  {this.state.showConfirmationIdError && (
                    <p className="registerErrorDisplay registerFieldsError">
                      {this.state.confirmationIdErrorMessage}
                    </p>
                  )}
                  <input
                    onClick={this.onRegisterStep2}
                    className="registerButton"
                    type="submit"
                    value="Create Account"
                  />
                  <input
                    onClick={this.onResendEmail}
                    className="registerButton"
                    type="submit"
                    value="Resend Email"
                  />
                </div>
              )}
            </fieldset>
            <div className="belowRegisterButtonDiv">
              {this.state.registerStepNum === 2 && (
                <span className="belowRegisterButtonSpan1">
                  Or, if you already have an account, go back to
                </span>
              )}
              <span
                ref={this.signinLinkRef}
                onClick={() => this.props.history.push("signin")}
                className="signinLinkInRegister"
              >
                Sign In
              </span>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default withRouter(Register);
