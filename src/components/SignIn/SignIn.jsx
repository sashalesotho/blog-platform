import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Alert } from 'antd';
import { React, useState } from 'react';
import { connect } from 'react-redux';
import classes from '../Profile/Profile.module.scss';
import { login } from '../../services/api';
import * as actions from '../../redux/actions';

const SignIn = ({ getUserData }) => {
  const regExpEmail =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate();
  const onSubmitRedirect = () => {
    navigate('/');
  };

  const onSubmit = (data) => {
    login(data)
      .then((res) => {
        getUserData(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        setErrorMessage(null);
        reset();
        setSuccessMessage(<Alert message="Login was successful!" type="success" />);
        setTimeout(onSubmitRedirect, 1000);
      })
      .catch((error) => {
        setServerError(error.responseError);
        setErrorMessage(<Alert message={error.message} type="error" />);
        setSuccessMessage(null);
        setTimeout(setErrorMessage, 5000, null);
        setTimeout(setServerError, 8000, null);
      });
  };
  return (
    <section className={classes.user} onSubmit={handleSubmit(onSubmit)}>
      <form className={classes.form}>
        {errorMessage}
        {successMessage}
        <h1 className={classes.title}>Sign In</h1>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Email address</span>
          <input
            className={[
              classes.input,
              (errors?.email || serverError?.errors['email or password']) && classes['input-error'],
            ].join(' ')}
            tabIndex="2"
            placeholder="Email address"
            {...register('email', {
              required: 'Thats field is required',
              validate: (val) => regExpEmail.test(val) || 'Email address will be correct',
            })}
          />
          {errors?.email && (
            <span className={[classes['caption-input'], errors?.email && classes['error-text']].join(' ')}>
              {errors?.email?.message || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Password</span>
          <input
            className={[
              classes.input,
              (errors?.password || serverError?.errors['email or password']) && classes['input-error'],
            ].join(' ')}
            tabIndex="3"
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Thats field is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your password must consist of no more than 40 characters.',
              },
            })}
          />
          {errors?.password && (
            <span className={[classes['caption-input'], errors?.password && classes['error-text']].join(' ')}>
              {errors?.password?.message || 'ERROR'}
            </span>
          )}
        </label>
        <button className={classes.submit} tabIndex="6" type="submit">
          Login
        </button>
        <span className={classes.redirection}>
          Already have an account?
          <Link to="/sign-up"> Sign Up</Link>.
        </span>
      </form>
    </section>
  );
};

const mapStateToProps = (state) => ({
  data: state.userData,
});

export default connect(mapStateToProps, actions)(SignIn);
