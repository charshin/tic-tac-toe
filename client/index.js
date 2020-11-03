/* eslint-disable no-underscore-dangle */
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import App from '$app';

Loadable.preloadReady().then(() => {
  const renderOrHydrate =
    process.env.NODE_ENV === 'development' ? ReactDOM.render : ReactDOM.hydrate;
  renderOrHydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root'),
  );
});
