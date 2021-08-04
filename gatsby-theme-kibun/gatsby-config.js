module.exports = {
  siteMetadata: {
    title: `My Testsite`,
    description: `My testsite here`,
    siteUrl: `https://mytest.exmaple.com/`,
    sectionMenu: [
      { category: 'Category', menu: [{ text: 'Item1' }, { text: 'link', to: '/path1/' }] },
      { category: 'Category2', menu: [{ text: 'Item1' }, { text: 'link', to: '/path1/' }] },
    ],
    githubRepository: {
      project: 'wataru-chocola/test-sitemd',
      branch: 'main',
      rootDir: 'markdowns/',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: true,
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
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
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        emitSchema: {
          'src/__generated__/gatsby-schema.graphql': true,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdowns`,
        path: `${__dirname}/src/markdowns`,
      },
    },

    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [require('tailwindcss')],
      },
    },
  ],
};
