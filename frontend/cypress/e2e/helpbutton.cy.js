describe('HelpButton', () => {
  it('should redirect to the global search docs on click', () => {
    cy.visit('/search');
    cy.wait(2000);
    cy.get('#search-table').find('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#global-search');
  });
  it('should redirect to the quick search docs on click', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.get('#searchToggle').click();
    cy.wait(2000);
    cy.get('#gem-search-wrapper').find('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#quick-search');
  });
  it('should redirect to the data overley docs on click', () => {
    cy.visit(
      '/explore/Human-GEM/map-viewer/golgi_apparatus?dim=2d&panel=0&sel=&search=&coords=-4012.67,-15817.92,0.2,0,0,500&dataTypes=None&dataSources=None&dataSets=None'
    );
    cy.wait(2000);
    cy.get('#dataOverlayBar').click();
    cy.wait(2000);
    cy.get('#dataOverlayBox').find('.helpCircleButton').click();
    cy.location('pathname').should('eq', '/documentation');
    cy.location('hash').should('eq', '#data-overlay');
  });
});
