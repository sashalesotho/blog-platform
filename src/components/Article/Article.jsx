import { React, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { getOneArticle, deleteArticle, setInfoFavorite } from '../../services/api';

import classes from './Article.module.scss';

const Article = ({ userData }) => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getOneArticle(slug, userData.token).then((res) => {
      setArticle(res.article);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const onSubmitRedirect = () => {
    navigate('/');
  };

  const [visibility, setVisibility] = useState(null);

  const onDelete = () => {
    const newVisibility = { ...visibility, delPop: true };
    setVisibility(newVisibility);
  };

  const onYesDelete = () => {
    deleteArticle(slug, userData.token).then(() => {
      setTimeout(onSubmitRedirect, 1000, null);
    });
  };

  const onNoDelete = () => {
    const newVisibility = { ...visibility, delPop: false };
    setVisibility(newVisibility);
  };

  const onToggleLike = () => {
    if (!article?.favorited) {
      setInfoFavorite(slug, userData.token).then((res) => {
        setArticle(res.article);
      });
    }
    if (article?.favorited) {
      setInfoFavorite(slug, userData.token, 'DELETE').then((res) => {
        setArticle(res.article);
      });
    }
  };

  const heart = article?.favorited ? (
    <HeartFilled style={{ fontSize: 16, padding: 4, color: '#FF0707' }} className={classes.heart} />
  ) : (
    <HeartOutlined style={{ fontSize: 16, padding: 4 }} className={classes.heart} />
  );

  let tagKey = 1;
  return article ? (
    <div className={classes.article}>
      <div className={classes.content}>
        <div className={classes['title-wrapper']}>
          <Link to={`/articles/${article.slug}`} className={classes.title}>
            {article.title}
          </Link>
          <button type="button" className={classes['title-btn']} onClick={onToggleLike}>
            {heart}
            <span className={classes['favorites-count']}>{article.favoritesCount}</span>
          </button>
        </div>
        <div className={classes.tags}>
          {article.tagList
            ? article.tagList.map((tag) => (
                <button type="button" key={`${article.slug}-${(tagKey += 1)}`} className={classes['tags-btn']}>
                  {tag}
                </button>
              ))
            : null}
        </div>
        <div className={classes.description}>{article.description}</div>
      </div>
      <div className={classes.info}>
        <h1 className={classes['author-name']}>{article.author.username}</h1>
        <label className={classes.date}>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</label>
        <img className={classes.avatar} src={article.author.image} alt="avatar" />
      </div>
      {article.author.username === userData.username ? (
        <div className={classes['article-btns']}>
          <button
            type="button"
            className={[classes['article-btn'], classes['article-btn-red'], classes['delete-btn']].join(' ')}
            onClick={onDelete}
          >
            <span>Delete</span>
          </button>
          <div className={[classes['delete-popup'], visibility?.delPop && classes['delete-popup-visible']].join(' ')}>
            <div className={classes['delete-arrow']}> </div>
            <div className={classes['delete-confirm']}>
              <div className={classes['delete-warn']}>
                <div className={classes['warn-circle']}>
                  <span>!</span>
                </div>
                <div className={classes['warn-message']}>Are you sure to delete this article?</div>
              </div>
              <div className={classes['warn-btns']}>
                <button
                  type="button"
                  className={[classes['warn-btn'], classes['warn-btn-light']].join(' ')}
                  onClick={onNoDelete}
                >
                  No
                </button>
                <button
                  type="button"
                  className={[classes['warn-btn'], classes['warn-btn-blue']].join(' ')}
                  onClick={onYesDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
          <button type="button" className={[classes['article-btn'], classes['article-btn-green']].join(' ')}>
            <Link className={classes.link} to={`/articles/${slug}/edit`}>
              Edit
            </Link>
          </button>
        </div>
      ) : null}
      <ReactMarkdown className={classes.body}>{article.body}</ReactMarkdown>
    </div>
  ) : (
    <div className={classes.article}>
      <Spin size="large" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(Article);
