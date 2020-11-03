import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { StaticRouter, matchPath } from 'react-router-dom';
import { getBundles } from 'react-loadable/webpack';
import { Helmet } from 'react-helmet';
import App from '$app';
import { appBuild } from '../config/paths';
import Html from './Html';
import SEORoutes from './seo';

export default (req, res) => {
  const render = (initialData = {}) => {
    const modules = [];
    const context = { initialData };

    const appHtml = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Loadable.Capture>,
    );

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      return res.redirect(301, context.url);
    }

    const helmet = Helmet.renderStatic();

    // eslint-disable-next-line
    const stats = require(`${appBuild}/react-loadable.json`);
    const bundles = getBundles(stats, modules);
    const cssFiles = bundles
      .filter(({ file }) => file.endsWith('.css'))
      .map(({ file }) => file);
    const jsChunks = bundles
      .filter(({ file }) => file.endsWith('.js'))
      .map(({ file }) => file);

    return res.send(`
      <!doctype html>
      ${ReactDOMServer.renderToString(
        <Html
          helmet={helmet}
          appHtml={appHtml}
          initialData={initialData}
          cssFiles={cssFiles}
          jsChunks={jsChunks}
        />,
      )}
    `);
  };

  // * Prefetch data, then SSR
  const promises = (SEORoutes || []).map(route => {
    const match = matchPath(req.url, route);
    return match
      ? (async () => ({
          subdomain: req.subdomain,
          ...(await route.component?.fetchInitialData({ req, match })),
        }))()
      : null;
  });
  Promise.all(promises)
    .then(data => {
      const initialData = {};
      data.forEach((initData, idx) => {
        initialData[SEORoutes[idx].name] = initData;
      });
      return initialData;
    })
    .then(render)
    .catch(error => {
      // TODO Use better log mechanism, i.e. winston
      // TODO This catch is misleading since it also captures exception from render --> split out
      // eslint-disable-next-line no-console
      console.log('Error in prefetching data for SSR', error);
      // ? We continue to render anyway
      // ? so that client will have something to render
      render();
    });
};
