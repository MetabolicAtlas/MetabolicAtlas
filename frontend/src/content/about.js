export default [
  // { name: 'Our impact', link: '/about/impact', routeName: 'about-impact' },
  {
    name: 'Platform',
    icon: 'fas fa-external-link-alt',
    link: '/about/platform',
    routeName: 'about-platform',
    subsections: [
      { name: 'Introduction', link: '/about/platform#introduction' },
      { name: 'Citation', link: '/about/platform#citation' },
      { name: 'Advisory Board', link: '/about/platform#advisory-board' },
      { name: 'Development', link: '/about/platform#development' },
      { name: 'Contact us', link: '/about/platform#contact-us' },
    ],
  },
  { name: 'News', icon: 'far fa-newspaper', link: '/about/news', routeName: 'about-news' },
  {
    name: 'Terms of use',
    icon: 'fas fa-shield-alt',
    link: '/about/terms',
    routeName: 'about-terms',
    subsections: [
      { name: 'Privacy policy', link: '/about/terms#privacy-policy' },
      { name: 'License and disclaimer', link: '/about/terms#license' },
    ],
  },
  { name: 'ELIXIR', icon: 'fa-asterisk', link: '/about/elixir', routeName: 'about-elixir' },
  {
    name: 'Related resources',
    icon: 'fas fa-external-link-alt',
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
