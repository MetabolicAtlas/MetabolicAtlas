export default [
  // { name: 'Our impact', link: '/about/impact', routeName: 'about-impact' },
  {
    name: 'About',
    icon: 'fa-external-link',
    link: '/about/platform',
    routeName: 'about-platform',
    subsections: [
      { name: 'Introduction', link: '/about/platform#introduction' },
      { name: 'Citation', link: '/about/platform#citation' },
      { name: 'Advisory Board', link: '/about/platform#advisory-board' },
      { name: 'Development', link: '/about/platform#development' },
    ],
  },
  { name: 'News', icon: 'fa-newspaper-o', link: '/about/news', routeName: 'about-news' },
  { name: 'Contact us', icon: 'fa-envelope-o', link: '/about/contact', routeName: 'about-contact' },
  { name: 'Privacy policy', icon: 'fa-shield', link: '/about/privacy', routeName: 'about-privacy' },
  {
    name: 'License and Disclaimer',
    icon: 'fa-book',
    link: '/about/license',
    routeName: 'about-license',
  },
  { name: 'ELIXIR', icon: 'fa-asterisk', link: '/about/elixir', routeName: 'about-elixir' },
  {
    name: 'Related resources',
    icon: 'fa-external-link',
    link: '/about/resources',
    routeName: 'about-resources',
    subsections: [
      { name: 'Tools', link: '/about/resources#tools' },
      { name: 'Databases', link: '/about/resources#databases' },
      { name: 'APIs', link: '/about/resources#apis' },
      { name: 'Cross-references', link: '/about/resources#cross-references' },
    ],
  },
];
