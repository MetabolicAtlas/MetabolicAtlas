describe('HelpButton', () => {
  it('should redirect to the global search docs on click', () => {
    cy.visit('/search');
    cy.get('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#pepe');
  });
  it('should redirect to the quick search docs on click', () => {
    cy.visit('/search');
    cy.get('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#pepe');
  });
  it('should redirect to the data overley docs on click', () => {
    cy.visit('/search');
    cy.get('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#pepe');
  });
});
