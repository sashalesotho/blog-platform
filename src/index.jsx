import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import 'antd/dist/antd.css';
import 'normalize.css';
import './index.css';
import reducer from './redux/reducers';
import App from './components/App/App';
import { getUserData } from './redux/actions';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

const localData = JSON.parse(localStorage.getItem('user'));
if (localData) {
  store.dispatch(getUserData(localData));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);
