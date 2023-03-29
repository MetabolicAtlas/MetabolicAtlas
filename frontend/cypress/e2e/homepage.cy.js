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

})
