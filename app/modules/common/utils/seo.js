import { Helmet } from 'react-helmet';

const renderSEO = (
  title,
  description,
  image,
  url,
  { keywords = 'Snaphunt', siteName = 'Snaphunt', author = 'Snaphunt' } = {},
) => (
  <Helmet>
    {/* Browser */}
    <title>{title}</title>
    <link rel="canonical" href={url} />
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />

    {/* Social Media Sharing Meta Tags */}
    {/* https://css-tricks.com/essential-meta-tags-social-media */}

    {/* Essential Meta Tags */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta name="twitter:card" content="summary" />

    {/* Non-Essential, But Recommended */}
    <meta property="og:site_name" content={siteName} />
    {/* <meta name="twitter:image:alt" content="Alt text for image" /> */}

    {/* Non-Essential, But Required for Analytics */}
    {/* <meta property="fb:app_id" content="your_app_id" /> */}
    {/* <meta name="twitter:site" content="@website-username" /> */}
  </Helmet>
);

export default renderSEO;
