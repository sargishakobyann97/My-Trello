import React from 'react';
import 'antd/dist/antd.css';
import { Input, Button } from 'antd';
import firebase from "firebase"
import fire from './fire';
import { SET_EMAIL, SET_EMAIL_ERROR, SET_HAS_ACCOUNT, SET_PASSWORD, SET_PASSWORD_ERROR } from '../store/actions/actionTypes';
import { connect } from "react-redux"



const Login = (props) => {

    const clearErrors = () => {
        props.setEmailError("");
        props.setPasswordError("");
    }

    const handleLogin = () => {
        clearErrors()
        fire
            .auth()
            .signInWithEmailAndPassword(props.email, props.password)
            .then(response => {
                localStorage.setItem('email', props.email);
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        props.setEmailError(err.message);
                        break;
                    case "auth/wrong-password":
                        props.setPasswordError(err.message);
                        break;
                    default:

                }
            })
    }

    const handleSingup = () => {
        clearErrors()
        fire
            .auth()
            .createUserWithEmailAndPassword(props.email, props.password)
            .catch((err) => {
                switch (err.code) {
                    case "auth/email-already-in-use":
                        break
                    case "auth/invalid-email":
                        props.setEmailError(err.message);
                        break;
                    case "auth/weak-password":
                        props.setPasswordError(err.message);
                        break
                    default:
                }
            })
    }
    return (
        <section className="login">
            <div className="loginContainer">
                <label>E-mail</label>
                <Input
                    type="text"
                    autoFocus
                    required
                    value={props.email}
                    onChange={(e) => props.setEmail(e.target.value)}
                />
                <p className="errorMsg">{props.emailError}</p>
                <label>Password</label>
                <Input
                    type="password"
                    required
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                />
                <p className="errorMsg">{props.passwordError}</p>
                <div className="btnContainer">
                    {props.hasAccount ? (
                        <div>
                            <Button onClick={() => {
                                handleSingup()
                                firebase.firestore().collection(`${props.email}`).doc("beeweb").set({
                                    data: []
                                })
                                localStorage.setItem("email", props.email)
                            }}>Sign up</Button >
                            <p>Have an account ? <span onClick={() => props.setHasAccount(!props.hasAccount)}>Sign in</span></p>
                        </div>
                    ) : (
                        <div>
                            <Button onClick={handleLogin}>Sign in</Button >
                            <p>Don't have an account ? <span onClick={() => props.setHasAccount(!props.hasAccount)}>Sign up</span></p>
                        </div>

                    )

                    }
                </div>
            </div>
        </section >
    )
}

function mapStateToProps(state) {
    return {
        email: state.email,
        password: state.password,
        emailError: state.emailError,
        passwordError: state.passwordError,
        hasAccount: state.hasAccount,
    }
}
function mapDispatchToProps(dispatch) {
    return {

        setEmailError: (message) => dispatch({ type: SET_EMAIL_ERROR, message: message }),
        setPasswordError: (message) => dispatch({ type: SET_PASSWORD_ERROR, message: message }),
        setEmail: (email) => dispatch({ type: SET_EMAIL, email: email }),
        setPassword: (password) => dispatch({ type: SET_PASSWORD, password: password }),
        setHasAccount: (value) => dispatch({ type: SET_HAS_ACCOUNT, value: value })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)