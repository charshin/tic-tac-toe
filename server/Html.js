/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { appBuild } from '../config/paths';

const Html = ({ helmet, appHtml, initialData, cssFiles, jsChunks }) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();
  const title = helmet.title.toComponent();
  const meta = helmet.meta.toComponent();
  const link = helmet.link.toComponent();
  const script = helmet.script.toComponent();
  const assetManifest = require(`${appBuild}/asset-manifest.json`).files;

  return (
    <html lang="en" {...htmlAttrs}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {title}
        {meta}
        {link}
        {script}
        <link
          rel="shortcut icon"
          href={`${process.env.PUBLIC_URL}/favicon.ico`}
        />
      </head>
      <body {...bodyAttrs}>
        <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        <div id="modal-root" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__INITIAL_DATA__ = ${serialize(initialData)};
            `,
          }}
        />
        {/* https://flaviocopes.com/javascript-async-defer/#async-and-defer */}
        {/* async chunks & css */}
        {cssFiles.map(file => (
          <link key={file} rel="stylesheet" href={file} />
        ))}
        {jsChunks.map(file => (
          <script key={file} src={file} defer />
        ))}
        {/* initial bundles & css */}
        <link rel="stylesheet" href={assetManifest['main.css']} />
        <script src={assetManifest['main.js']} defer />
        <link rel="stylesheet" href={assetManifest['vendors.css']} />
        <script src={assetManifest['vendors.js']} defer />
      </body>
    </html>
  );
};

Html.propTypes = {
  helmet: PropTypes.object.isRequired,
  appHtml: PropTypes.string.isRequired,
  initialData: PropTypes.object.isRequired,
  cssFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  jsChunks: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Html;
