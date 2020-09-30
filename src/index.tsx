import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './store';
import { Provider } from 'react-redux';
import { SocketProvider } from './contexts/SocketProvider';


import thunk from 'redux-thunk';

const composeEnhancers = (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <SocketProvider>
        <App />
        </SocketProvider>
    </Provider>,
    document.getElementById('root'),
);
