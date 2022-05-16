import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Alert } from 'antd';
import { React, useState } from 'react';

import classes from '../Profile/Profile.module.scss';
import { postNewUser } from '../../services/api';

const SignUp = () => {
  const regExpEmail =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate();
  const onSubmitRedirect = () => {
    navigate('/sign-in');
  };

  const onSubmit = (data) => {
    postNewUser(data)
      .then(() => {
        setErrorMessage(null);
        reset();
        setSuccessMessage(<Alert message="Registration was successful!" type="success" />);
        setTimeout(onSubmitRedirect, 2000);
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
        <h1 className={classes.title}>Create new account</h1>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Username</span>
          <input
            className={[
              classes.input,
              (errors?.username || serverError?.errors?.username) && classes['input-error'],
            ].join(' ')}
            tabIndex="-5"
            placeholder="Username"
            {...register('username', {
              required: 'Thats feild is required',
              minLength: {
                value: 3,
                message: 'Your username needs to be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Your username must consist of no more than 20 characters.',
              },
            })}
          />
          {errors?.username && (
            <span className={[classes['caption-input'], errors?.username && classes['error-text']].join(' ')}>
              {errors?.username?.message || 'ERROR'}
            </span>
          )}
          {serverError?.errors?.username && (
            <span
              className={[classes['caption-input'], serverError?.errors?.username && classes['error-text']].join(' ')}
            >
              {serverError?.errors?.username || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Email address</span>
          <input
            className={[classes.input, (errors?.email || serverError?.errors?.email) && classes['input-error']].join(
              ' '
            )}
            tabIndex="-4"
            placeholder="Email address"
            {...register('email', {
              required: 'Thats feild is required',
              validate: (val) => regExpEmail.test(val) || 'Email address will be correct',
            })}
          />
          {errors?.email && (
            <span className={[classes['caption-input'], errors?.email && classes['error-text']].join(' ')}>
              {errors?.email?.message || 'ERROR'}
            </span>
          )}
          {serverError?.errors?.email && (
            <span className={[classes['caption-input'], serverError?.errors?.email && classes['error-text']].join(' ')}>
              {serverError?.errors?.email || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Password</span>
          <input
            className={[classes.input, errors?.password && classes['input-error']].join(' ')}
            tabIndex="-3"
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Thats feild is required',
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
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Repeat Password</span>
          <input
            className={[classes.input, errors?.repeatPassword && classes['input-error']].join(' ')}
            tabIndex="-2"
            type="password"
            placeholder="Password"
            {...register('repeatPassword', {
              required: 'Thats feild is required',
              validate: (value) => value === watch('password') || 'Passwords must match',
            })}
          />
          {errors?.repeatPassword && (
            <span className={[classes['caption-input'], errors?.repeatPassword && classes['error-text']].join(' ')}>
              {errors?.repeatPassword?.message || 'ERROR'}
            </span>
          )}
        </label>
        <label>
          <div className={classes.agreement}>
            <input
              className={classes['agreement-checkbox']}
              tabIndex="-1"
              type="checkbox"
              defaultChecked
              {...register('agree', {
                required: 'You will be agree with that',
              })}
            />
            <span className={classes['agreement-span']}>I agree to the processing of my personal information</span>
          </div>
          {errors?.agree && (
            <span className={[classes['caption-input'], errors?.agree && classes['error-text']].join(' ')}>
              {errors?.agree?.message || 'ERROR'}
            </span>
          )}
        </label>
        <button className={classes.submit} tabIndex="0" type="submit">
          Create
        </button>
        <span className={classes.redirection}>
          Already have an account?
          <Link to="/sign-in"> Sign In</Link>.
        </span>
      </form>
    </section>
  );
};

export default SignUp;
