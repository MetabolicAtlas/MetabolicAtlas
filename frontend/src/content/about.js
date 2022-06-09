export default [
  {
    name: 'Introduction',
    link: '/about/introduction',
    routeName: 'about-introduction',
  },
  // { name: 'Our impact', link: '/about/impact', routeName: 'about-impact' },
  { name: 'News', icon: 'fa-newspaper-o', link: '/about/news', routeName: 'about-news' },
  {
    name: 'Advisory Board',
    icon: 'fa-compass',
    link: '/about/advisory',
    routeName: 'about-advisory',
  },
  { name: 'Team', icon: 'fa-users', link: '/about/team', routeName: 'about-team' },
  { name: 'Citation', icon: 'fa-quote-left', link: '/about/citation', routeName: 'about-citation' },
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
      { name: 'Tools', link: '#tools' },
      { name: 'Databases', link: '#databases' },
      { name: 'APIs', link: '#apis' },
      { name: 'Cross-references', link: '#cross-references' },
    ],
  },
];
