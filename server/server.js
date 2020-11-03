/* eslint-disable no-console */
import express from 'express';
import compression from 'compression';
import Loadable from 'react-loadable';
import getClientEnvironment from '../config/env';
import { appBuild, servedPath } from '../config/paths';
import ssr from './ssr';

const PORT = 7000;

const publicUrl =
  process.env.NODE_ENV === 'production' ? servedPath.slice(0, -1) : '';
const env = getClientEnvironment(publicUrl);
process.env = env.raw;

const app = express();
app
  .disable('x-powered-by')
  .use(compression())
  .get('/health', (req, res) => {
    res.send('Healthy');
  })
  .get(/^\/(build|version)$/, (req, res) => {
    // * COMMIT_HASH is only available on test or production, passed by AWS Codebuild into Dockerfile
    const buildInfo = `🛠 ${process.env.NODE_ENV}${
      process.env.NODE_ENV !== 'development'
        ? `-${process.env.APP_VERSION}-${process.env.COMMIT_HASH?.substring(
            0,
            7,
          )}`
        : ''
    }`;
    res.send(buildInfo);
  })
  .use(express.static(appBuild, { maxAge: '30d', index: false }))
  .use(ssr)
  // ? This will never happen, but we serve the built index.html as the last resort
  .use((req, res) => {
    res.sendFile(`${appBuild}/index.html`);
  });

console.log('Preloading rendered async chunks...');
Loadable.preloadAll().then(() => {
  console.log('Successfuly.');
  if (process.env.CI) {
    console.log('CI detected. Simply exit.');
  } else {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  }
});
