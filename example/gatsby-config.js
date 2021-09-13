module.exports = {
  siteMetadata: {
    siteUrl: `https://mytest.exmaple.com/`,
    title: `My Testsite`,
    description: `My testsite here`,
  },
  plugins: [
    {
      resolve: `gatsby-theme-kibun`,
      options: {
        markdownDir: `${__dirname}/markdowns`,
        githubRepository: {
          project: 'wataru-chocola/test-sitemd',
          rootDir: 'markdowns/',
        },
      },
    },
    `gatsby-plugin-sitemap`,
    //{
    //  resolve: `gatsby-plugin-manifest`,
    //  options: {
    //    name: `gatsby-starter-default`,
    //    short_name: `starter`,
    //    start_url: `/`,
    //    background_color: `#663399`,
    //    theme_color: `#663399`,
    //    display: `minimal-ui`,
    //    icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    //  },
    //},
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        //disable: false,
        disable: true,
      },
    },
  ],
};
