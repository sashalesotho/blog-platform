import { Pagination, Spin } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { React, useEffect, useState } from 'react';
import { getArticles, setInfoFavorite } from '../../services/api';

import * as actions from '../../redux/actions';
import classes from './ArticlesList.module.scss';

const ArticlesList = ({ pageData, userData, changePage }) => {
  const [articlesData, setArticlesData] = useState(null);

  useEffect(() => {
    getArticles(pageData, userData.token).then((res) => {
      setArticlesData(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangePage = (page) => {
    getArticles(page, userData.token).then((res) => {
      setArticlesData(res);
      changePage(page);
    });
  };

  const articles = articlesData?.articles;

  const onToggleLike = (slug, favorited) => {
    if (!favorited) {
      setInfoFavorite(slug, userData.token).then(() => {
        getArticles(pageData, userData.token).then((res) => {
          setArticlesData(res);
        });
      });
    }
    if (favorited) {
      setInfoFavorite(slug, userData.token, 'DELETE').then(() => {
        getArticles(pageData, userData.token).then((res) => {
          setArticlesData(res);
        });
      });
    }
  };

  let tagKey = 1;
  return articles ? (
    <div className={classes['articles-list']}>
      {articles.map((article) => {
        const heart = article.favorited ? (
          <HeartFilled style={{ fontSize: 16, padding: 4, color: '#FF0707' }} className={classes.heart} />
        ) : (
          <HeartOutlined style={{ fontSize: 16, padding: 4 }} className={classes.heart} />
        );

        return (
          <div key={article.slug} className={classes.article}>
            <div className={classes.content}>
              <div className={classes['title-wrapper']}>
                <Link to={`/articles/${article.slug}`} className={classes.title}>
                  {article.title}
                </Link>
                <button
                  type="button"
                  className={classes['title-btn']}
                  disabled={!userData.token}
                  onClick={() => onToggleLike(article.slug, article.favorited)}
                >
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
          </div>
        );
      })}
      <Pagination
        onChange={(page) => onChangePage(page)}
        defaultCurrent={pageData}
        total={articlesData.articlesCount}
        showSizeChanger={false}
        defaultPageSize={5}
      />
    </div>
  ) : (
    <div className={classes['articles-list']}>
      <Spin size="large" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  pageData: state.pageData.page,
  userData: state.userData,
});

export default connect(mapStateToProps, actions)(ArticlesList);
