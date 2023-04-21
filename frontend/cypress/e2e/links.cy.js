/// <reference types="Cypress" />

context('Links on site', () => {
  const routes = [
    "/",
    "explore/Human-GEM/gem-browser",
    "/explore/Human-GEM/gem-browser/metabolite/MAM01282c",
    "/explore/Human-GEM/map-viewer/golgi_apparatus?dim=2d&panel=0&sel=&search=&coords=-4012.67,-15817.92,0.2,0,0,500&dataTypes=None&dataSources=None&dataSets=None",
    "/explore/Human-GEM/interaction-partners",
    "/explore/Human-GEM/interaction-partners/MAM01632e",
    "/gems/repository",
    "/gems/repository/Fruitfly-GEM",
    "/documentation",
    "/about/platform",
    "/about/news",
    "/about/terms",
    "/about/terms",
    "/about/elixir",
    "/about/resources",
    "/gotenzymes",
    "/gems/comparison?models=FruitflyGem-1.2.0&models=HumanGem-1.12.0"
  ];
  const manualIgnore = '*[data-cy="ignore-links"] a'
  const citationPopupLink = '.altmetric_container a, .altmetric-embed a'
  const linksToIgnore = [
    'a[href^="mailto:"]',
    'a[href^="ftp://"]',
    'a[href="/api/v2/data-overlay/reactions/example"]',
    'a[href="/api/v2/data-overlay/genes/example"]',
    manualIgnore,
    citationPopupLink
  ].join(",")
  const externalLinks = 'a[href^="http://"], a[href^="https://"]';
  for (const route of routes) {
    describe(`For route: "${route}"`, () => {
      beforeEach(() => {
        cy.visit(route)
      })
      it('each external link should open in new window', () => {
        cy.get(externalLinks).not(linksToIgnore).each(($el) => {
          cy.wrap($el).should('have.attr', 'target', '_blank')
        })
      })
      it('each local link should open in same window', () => {
        cy.get('a:any-link').not(externalLinks).not(linksToIgnore).each(($el) => {
          cy.wrap($el).should('not.have.attr', 'target', '_blank')
        })
      })
    })
  }
})
  