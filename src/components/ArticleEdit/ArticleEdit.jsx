import React from 'react';
import { useParams } from 'react-router-dom';

import ArticleCreate from '../ArticleCreate';

const ArticleEdit = () => {
  const { slug } = useParams();
  return <ArticleCreate slug={slug} />;
};

export default ArticleEdit;
