import React, { createRef } from 'react';
import Spinner from '../Spinner/Spinner';
import './Signin.css';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      errorMessage: `Something went wrong. 
              Please try again.`,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      showEmailError: false,
      showPasswordError: false,
      showError: false,
      showSpinner: false,
    }
    this.emailRef = createRef()
    this.passwordRef = createRef()
  }

  componentDidMount() {
    this.emailRef.current.focus()
  }

  componentDidUpdate() {
    if (this.emailRef.current.validity.valid === true && this.state.showEmailError === true) {
      this.setState({ showEmailError: false })
    } else if (this.emailRef.current.validity.valid === false && this.state.showEmailError === false) {
      this.setState({ showEmailError: true })
    }
    if (this.passwordRef.current.validity.valid === true && this.state.showPasswordError === true) {
      this.setState({ showPasswordError: false })
    } else if (this.passwordRef.current.validity.valid === false && this.state.showPasswordError === false) {
      this.setState({ showPasswordError: true })
    }
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value })
  }

  onEmailError = (show) => {
    if (show) {
      this.setState({ showEmailError: true, emailErrorMessage: `Email is a required field and must include a proper email address. Example: abc@gmail.com` })
      this.emailRef.current.classList.add('highlightClassInSignIn')
      this.emailRef.current.focus()
      return
    }
    this.setState({ showEmailError: false })
    this.emailRef.current.classList.remove('highlightClassInSignIn')
    return
  }

  onEnterKeyPressOnEmail = (event) => {
    if (event.key === 'Enter' && this.state.signInEmail === '') {
      this.onEmailError(true)
    } else if (event.key === 'Enter' && this.emailRef.current.validity.typeMismatch) {
      this.onEmailError(true)
    } else if (event.key === 'Enter' && !this.emailRef.current.validity.typeMismatch) {
      this.onEmailError(false)
      if (this.state.signInPassword === '') {
        this.passwordRef.current.focus()
      } else {
        this.onSubmitSignIn()
      }
    }
  }

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value })
  }

  onPasswordError = (showPasswordError) => {
    if (showPasswordError) {
      this.setState({ showPasswordError: true, passwordErrorMessage: 'Password is a required field and must be between 8 - 10 characters.' })
      this.passwordRef.current.classList.add('highlightClassInSignIn')
      this.passwordRef.current.focus()
      return
    }
    this.setState({ showPasswordError: false })
    this.passwordRef.current.classList.remove('highlightClassInSignIn')
    return
  }

  onEnterKeyPressOnPassword = (event) => {
    if (event.key === 'Enter' && this.state.signInPassword.length < 8) {
      this.onPasswordError(true)
    } else if (event.key === 'Enter' && !this.passwordRef.current.validity.valid) {
      this.onPasswordError(true)
    } else if (event.key === 'Enter' && this.state.signInPassword.length >= 8) {
      this.onPasswordError(false)
      if (this.state.signInEmail === '') {
        this.emailRef.current.focus()
      } else {
        this.onSubmitSignIn()
      }
    }
  }

  onSubmitForm = (event) => {
    event.preventDefault()
  }

  onSubmitSignIn = () => {
    if (this.passwordRef.current.value.length < 8) {
      this.onPasswordError(true)
    } else {
      this.onPasswordError(false)
    }
    if (this.state.signInEmail === '' || this.emailRef.current.validity.typeMismatch) {
      this.onEmailError(true)
    } else {
      this.onEmailError(false)
    }
    if (!this.state.showEmailError && !this.state.showPasswordError && this.state.signInEmail !== '' && this.state.signInPassword !== '') {
      this.setState({ showSpinner: true })
      fetch(`/signin`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.signInEmail,
          password: this.state.signInPassword
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.success === "true") {
            this.props.saveAuthTokenInSession(data.token)
            this.props.loadUser(data.user)
            this.props.onRouteChange('home');
          } else {
            throw Error();
          }
        })
        .catch(err => {
          if (err) {
            this.setState({
              showError: true,
              errorMessage: `Something went wrong. Please try again.`,
              showSpinner: false
            })
          }
        })
    }
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="signinArticle">
        <main className="signinMain">
          <div className="signinMeasure">
            <fieldset id="sign_up" className="signinFieldset">
              <legend className="signinLegend">Sign In</legend>
              {
                this.state.showError &&
                <p className="signinErrorDisplay">{this.state.errorMessage}</p>
              }
              <div className="belowLegendDivInSignin" onSubmit={this.onSubmitForm}>
                <label className="belowLegendLabelInSignin" htmlFor="email-address">Email</label>
                <input
                  className="belowLegendInputInSignin"
                  type="email"
                  name="email-address"
                  required
                  ref={this.emailRef}
                  onChange={this.onEmailChange}
                  onKeyDown={this.onEnterKeyPressOnEmail}
                />
                {
                  this.state.showEmailError &&
                  <p className="signinErrorDisplay signinFieldsError">{this.state.emailErrorMessage}</p>
                }
              </div>
              <div className="belowLegendDivInSignin" onSubmit={this.onSubmitForm}>
                <label className="belowLegendLabelInSignin" htmlFor="password">Password</label>
                <input
                  className="belowLegendInputInSignin"
                  type="password"
                  name="password"
                  required
                  ref={this.passwordRef}
                  minLength={8}
                  maxLength={10}
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onEnterKeyPressOnPassword}
                />
                {
                  this.state.showPasswordError === true &&
                  <p className="signinErrorDisplay signinFieldsError">{this.state.passwordErrorMessage}</p>
                }
              </div>
            </fieldset>
            <Spinner showSpinner={this.state.showSpinner} />
            <input
              onClick={this.onSubmitSignIn}
              className="signinButtonInSignin"
              type="submit"
              value="Sign in"
            />
            <div className="belowSigninButtonDiv">
              <p onClick={() => onRouteChange('forgot')} className="registerLinkInSignin">Forgot Password</p>
              <p onClick={() => onRouteChange('register')} className="registerLinkInSignin">Register</p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;