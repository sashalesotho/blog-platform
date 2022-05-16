import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Header from '../Header';
import ArticlesList from '../ArticlesList';
import Article from '../Article';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import Profile from '../Profile';
import ArticleCreate from '../ArticleCreate';
import ArticleEdit from '../ArticleEdit';

import classes from './App.module.scss';

const App = () => (
  <div className={classes.app}>
    <Header />
    <div className={classes.content}>
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/articles/:slug/edit" element={<ArticleEdit />} />
        <Route path="/new-article" element={<ArticleCreate />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Spin size="large" />} />
      </Routes>
    </div>
  </div>
);

export default App;
