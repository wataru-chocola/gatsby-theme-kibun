module.exports = {
  siteMetadata: {
    siteUrl: `https://mytest.exmaple.com/`,
    title: `My Testsite`,
    description: `My testsite here`,
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
      resolve: `gatsby-theme-kibun`,
      options: {
        markdownDir: `${__dirname}/src/markdowns`,
        //sectionMenu: [
        //  { category: 'Category', menu: [{ text: 'Item1' }, { text: 'link', to: '/path1/' }] },
        //  { category: 'Category2', menu: [{ text: 'Item1' }, { text: 'link', to: '/path1/' }] },
        //],
        //githubRepository: {
        //  project: 'wataru-chocola/test-sitemd',
        //  branch: 'main',
        //  rootDir: 'markdowns/',
        //},
      },
    },
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
  ],
};
