import { useForm } from 'react-hook-form';
import { React, useState } from 'react';
import { Alert } from 'antd';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './Profile.module.scss';
import { putEditUser } from '../../services/api';
import * as actions from '../../redux/actions';

const Profile = ({ userData, getUserData }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate();
  const onSubmitRedirect = () => {
    navigate('/');
  };
  const onSubmit = (data) => {
    putEditUser(data, userData.token)
      .then((res) => {
        getUserData(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        setErrorMessage(null);
        setSuccessMessage(<Alert message="Profile has been successfully edited!" type="success" />);
        setTimeout(onSubmitRedirect, 2000, null);
      })
      .catch((error) => {
        setServerError(error.responseError);
        setErrorMessage(<Alert message={error.message} type="error" />);
        setSuccessMessage(null);
        setTimeout(setErrorMessage, 5000, null);
        setTimeout(setServerError, 8000, null);
      });
  };
  const regExpEmail =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regExpUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!]))?/;
  return (
    <section className={classes.user} onSubmit={handleSubmit(onSubmit)}>
      <form className={classes.form}>
        {errorMessage}
        {successMessage}
        <h1 className={classes.title}>Edit Profile</h1>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Username</span>
          <input
            className={[
              classes.input,
              (errors?.username || serverError?.errors?.username) && classes['input-error'],
            ].join(' ')}
            tabIndex="-5"
            placeholder="Username"
            defaultValue={userData.username}
            {...register('username', {
              required: 'Thats field is required',
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
            defaultValue={userData.email}
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
          {serverError?.errors?.email && (
            <span className={[classes['caption-input'], serverError?.errors?.email && classes['error-text']].join(' ')}>
              {serverError?.errors?.email || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>New password</span>
          <input
            className={[classes.input, errors?.password && classes['input-error']].join(' ')}
            tabIndex="-3"
            type="password"
            placeholder="New password"
            {...register('password', {
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
          <span className={classes['caption-input']}>Avatar image (url)</span>
          <input
            className={[classes.input, errors?.image && classes['input-error']].join(' ')}
            tabIndex="-2"
            placeholder="Avatar image"
            {...register('image', {
              validate: (val) => {
                if (val) {
                  return regExpUrl.test(val) || 'Image address will be correct';
                }
              },
            })}
          />
          {errors?.image && (
            <span className={[classes['caption-input'], errors?.image && classes['error-text']].join(' ')}>
              {errors?.image?.message || 'ERROR'}
            </span>
          )}
        </label>
        <button className={classes.submit} tabIndex="0" type="submit">
          Save
        </button>
      </form>
    </section>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, actions)(Profile);
