/// <reference types="Cypress" />

context('Homepage', () => {

  describe('Basic', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Hide loading screen', () => {
      cy.get('#init-loading').should('not.exist')
    })
    it('Standard charset', () => {
      cy.get('head > meta[charset]').should('have.length', 1).should('have.attr', 'charset', 'utf-8')
    })
    it('Cookie policy', () => {
      Cypress.Cookies.debug(true)
      cy.get('#cookies').should('be.visible')
      cy.get('#cookies').find('.button').click()
      cy.get('#cookies').should('not.exist')
    })
  })

  describe('Navbar', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('Works in all screen sizes', () => {
      cy.viewport('macbook-15')
      cy.get('.navbar-menu .is-active').should('not.exist')
      cy.get('.navbar-burger').should('be.hidden')
      cy.viewport('iphone-5')
      cy.get('.navbar-burger').should('be.visible')
      cy.get('.navbar-burger').click()
      cy.get('.navbar-burger .is-active').should('not.exist')
      cy.get('.navbar-end').children().should('have.length', 6)
      cy.get('.navbar-end .navbar-item').first().click()
    })
  })

  describe('DataOverlay', () => {
    const targets = [
      {
        url: '/explore/Human-GEM/map-viewer/acyl_coa_hydrolysis?dim=2d&panel=1&sel=&search=&coords=-3034.36,-3215.63,0.25,0,0,500&dataTypes=gene&dataSources=hpaRna.tsv&dataSets=adipose%20tissue',
        indicator: 'gene'
      },
      {
        url: '/explore/Human-GEM/map-viewer/acyl_coa_hydrolysis?dim=2d&panel=1&sel=&search=&coords=-3034.36,-3215.63,0.25,0,0,500&dataTypes=reaction&dataSources=HPA_single-cell_reactions.tsv&dataSets=adipose%20tissue_adipocytes_11',
        indicator: 'reaction'
      }
    ]
    for (const {url, indicator} of targets) {
      it(`It has the ${indicator} indicator`, () => {
        cy.visit(url)
        cy.get('.map-indicators .indicator-id').contains(indicator)
      })
    }
  })
})
