import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT')
        return { value: action.val, isValid: action.val.includes('@') };

    if (action.type === 'INPUT_BLUR')
        return { value: state.value, isValid: state.value.includes('@') };

    return { value: '', isValid: false };
};

const passReducer = (state, action) => {
    if (action.type === 'USER_INPUT')
        return { value: action.val, isValid: action.val.trim().length > 6 };

    if (action.type === 'USER_BLUR')
        return { value: state.value, isValid: state.value.trim().length > 6 };

    return { value: '', isValid: false };
};

const Login = props => {
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: '',
        isValid: null
    });

    const [passState, dispatchPass] = useReducer(passReducer, {
        value: '',
        isValid: null
    });

    const ctx = useContext(AuthContext);

    const { isValid: emailIsValid } = emailState;
    const { isValid: passIsValid } = passState;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFormIsValid(emailIsValid && passIsValid);
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [emailIsValid, passIsValid]);

    const emailChangeHandler = event => {
        dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const passwordChangeHandler = event => {
        dispatchPass({ type: 'USER_INPUT', val: event.target.value });
    };

    const validatePasswordHandler = () => {
        dispatchPass({ type: 'USER_BLUR' });
    };

    const submitHandler = event => {
        event.preventDefault();
        ctx.onLogin(emailState.value, passState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        emailState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${
                        passState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className={classes.actions}>
                    <Button
                        type="submit"
                        className={classes.btn}
                        disabled={!formIsValid}
                    >
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
