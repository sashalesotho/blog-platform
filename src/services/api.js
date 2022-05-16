const apiBase = 'https://kata.academy:8021/api/';

const getArticles = async (page = 1, token = null) => {
  const offset = page * 5 - 5;
  const res = await fetch(`${apiBase}articles?offset=${offset}&limit=${5}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch articles, received ${res.status}`);
  }
  const body = await res.json();
  return body;
};

const getOneArticle = async (slug, token = null) => {
  const res = await fetch(`${apiBase}articles/${slug}`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch article, received ${res.status}`);
  }
  const body = await res.json();
  return body;
};

const login = async (data) => {
  const bodyPost = {
    user: {
      email: data.email,
      password: data.password,
    },
  };
  const res = await fetch(`${apiBase}users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyPost),
  });
  const body = await res.json();
  if (res.status === 422) {
	  const warn = { responseError: body, message: 'Email or password is invalid.' };
    throw warn;
  }
  if (!res.ok) {
	  const err = { responseError: body, message: 'Something went wrong.' };
    throw err;
  }
  return body;
};

const postNewArticle = async (data, token) => {
  const bodyPost = {
    article: data,
  };

  const res = await fetch(`${apiBase}articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(bodyPost),
  });
  if (res.status === 500) {
    throw new Error('Internal Server Error.');
  }
  if (!res.ok) {
    console.log(res.status);
    throw new Error('Something went wrong.');
  }
  const body = await res.json();
  return body;
};

const putEditArticle = async (data, token, slug) => {
  const bodyPost = {
    article: data,
  };
  const res = await fetch(`${apiBase}articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(bodyPost),
  });
  if (!res.ok) {
    throw new Error('Something went wrong.');
  }
  const body = await res.json();
  return body;
};

const postNewUser = async (data) => {
  const bodyPost = {
    user: {
      username: data.username,
      email: data.email,
      password: data.password,
    },
  };

  const res = await fetch(`${apiBase}users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyPost),
  });
  const body = await res.json();
  if (res.status === 422) {
	  const warn = { responseError: body, message: 'The username or login is already employed.' };
    throw warn;
  }
  if (!res.ok) {
	  const err = { responseError: body, message: 'Something went wrong.' };
    throw err;
  }
  return body;
};

const putEditUser = async (data, token) => {
  const changeData = {};
  for (const key in data) {
    if (data[key]) {
      changeData[key] = data[key];
    }
  }
  const bodyPost = {
    user: changeData,
  };

  const res = await fetch(`${apiBase}user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(bodyPost),
  });
  const body = await res.json();
  if (res.status === 422) {
	  const warn = { responseError: body, message: 'The username or login is already employed.' };
    throw warn;
  }
  if (!res.ok) {
	  const err = { responseError: body, message: 'Something went wrong.' };
    throw err;
  }
  return body;
};

const deleteArticle = async (slug, token) => {
  await fetch(`${apiBase}articles/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${token}`,
    },
  });
};

const setInfoFavorite = async (slug, token, method = 'POST') => {
  const res = await fetch(`${apiBase}articles/${slug}/favorite`, {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Something went wrong.');
  }
  const body = await res.json();

  return body;
};

export {
  deleteArticle,
  getArticles,
  getOneArticle,
  login,
  postNewArticle,
  postNewUser,
  putEditArticle,
  putEditUser,
  setInfoFavorite,
};
