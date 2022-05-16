import { useForm } from 'react-hook-form';
import { React, useState, useEffect } from 'react';
import { Alert } from 'antd';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postNewArticle, putEditArticle, getOneArticle } from '../../services/api';

import classes from './ArticleCreate.module.scss';

const ArticleCreate = ({ userData, slug }) => {
  const [tagList, setTagList] = useState(['']);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { title: '', description: '', body: '' } });

  useEffect(() => {
    if (slug) {
      getOneArticle(slug).then((res) => {
        const newDefaultValues = {
          title: res.article.title,
          description: res.article.description,
          body: res.article.body,
        };
        setTagList(res.article.tagList);
        reset(newDefaultValues);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* 
 useEffect(() => {
    console.log('update');
  });
  */

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const addTag = () => {
    const newTagList = [...tagList, ''];
    setTagList(newTagList);
  };

  const deleteTag = (index) => {
    const newTagList = [...tagList.slice(0, index), ...tagList.slice(index + 1)];
    setTagList(newTagList);
  };

  const changeTag = (index, event) => {
    const newTagList = [...tagList.slice(0, index), event.target.value, ...tagList.slice(index + 1)];
    setTagList(newTagList);
  };

  const cleanTagList = () => {
    const newSet = new Set();
    tagList.forEach((el) => newSet.add(el));
    const newTagList = Array.from(newSet.values()).filter((el) => el);
    setTagList(newTagList);
    return newTagList;
  };

  let variableKey = 1;
  const keys = () => (variableKey += 1);

  const navigate = useNavigate();
  const onSubmitRedirect = () => {
    navigate('/');
  };

  const onSubmit = (data) => {
    const newData = data;
    const newTagList = cleanTagList();
    if (newTagList) {
      newData.tagList = newTagList;
    }
    const submitFunction = slug ? putEditArticle : postNewArticle;
    submitFunction(newData, userData.token, slug)
      .then(() => {
        setErrorMessage(null);
        setSuccessMessage(
          <Alert
            message={slug ? 'The article was successfully edited!' : 'The article was successfully created!'}
            type="success"
          />
        );
        setTimeout(onSubmitRedirect, 2000, null);
      })
      .catch((error) => {
        setErrorMessage(<Alert message={error.message} type="error" />);
        setSuccessMessage(null);
        setTimeout(setErrorMessage, 5000, null);
      });
  };
  return (
    <section className={classes.article} onSubmit={handleSubmit(onSubmit)}>
      <form className={classes.form}>
        {errorMessage}
        {successMessage}
        <h1 className={classes.egend}>{slug ? 'Edit article' : 'Create new article'}</h1>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Title</span>
          <input
            className={[classes['article-input'], errors?.title && classes['article-input-red']].join(' ')}
            tabIndex="-5"
            placeholder="Title"
            {...register('title', {
              required: 'Thats field is required',
            })}
          />
          {errors?.title && (
            <span className={[classes['caption-input'], classes['caption-input-red']].join(' ')}>
              {errors?.title?.message || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Short description</span>
          <input
            className={[classes['article-input'], errors?.description && classes['article-input-red']].join(' ')}
            tabIndex="-5"
            placeholder="Description"
            {...register('description', {
              required: 'Thats field is required',
            })}
          />
          {errors?.description && (
            <span className={[classes['caption-input'], classes['caption-input-red']].join(' ')}>
              {errors?.description?.message || 'ERROR'}
            </span>
          )}
        </label>
        <label className={classes['label-input']}>
          <span className={classes['caption-input']}>Text</span>
          <textarea
            className={[
              classes['article-input'],
              classes['article-textarea'],
              errors?.body && classes['article-textarea-red'],
            ].join(' ')}
            tabIndex="-5"
            placeholder="Text"
            {...register('body', {
              required: 'Thats field is required',
            })}
          />
          {errors?.body && (
            <span className={[classes['caption-input'], classes['caption-input-red']].join(' ')}>
              {errors?.body?.message || 'ERROR'}
            </span>
          )}
        </label>
        <div className={classes['tag-list']}>
          <span className={classes['caption-input']}>Tags</span>
          {tagList.length
            ? tagList.map((tag, index) => {
                const addBtn =
                  tagList.length - 1 === index ? (
                    <button
                      className={[classes['tag-btn'], classes['tag-btn-blue']].join(' ')}
                      tabIndex="-4"
                      type="button"
                      onClick={addTag}
                    >
                      Add tag
                    </button>
                  ) : null;
                return (
                  <div key={keys()} className={classes['tag-wrapper']}>
                    <label className={[classes['label-input'], classes['tag-label']].join(' ')}>
                      <input
                        className={[classes['article-input'], classes['new-tag-input']].join(' ')}
                        tabIndex="-5"
                        placeholder="Tag"
                        onChange={(e) => changeTag(index, e)}
                        value={tag}
                        name={tag}
                      />
                    </label>
                    <button
                      className={[classes['tag-btn'], classes['tag-btn-red']].join(' ')}
                      tabIndex="-3"
                      type="button"
                      onClick={() => deleteTag(index)}
                    >
                      Delete
                    </button>
                    {addBtn}
                  </div>
                );
              })
            : null}
        </div>
        <button className={classes.submit} tabIndex="0" type="submit">
          Send
        </button>
      </form>
    </section>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(ArticleCreate);
