import MapControls from './MapControls.vue';

describe('MapControls', () => {
  it('emits enterFullscreen on toggleFullscreen click if fullscreen is false ', () => {
    const doNothing = () => {};
    cy.mount(MapControls, {
      props: {
        fullscreen: false,
        disableFullscreen: false,
        zoomIn: doNothing,
        zoomOut: doNothing,
      },
    });
    cy.get('#toggle-fullscreen-button').click();
    cy.get('@vue').should(wrapper => {
      expect(wrapper.emitted('enterFullscreen').length).to.equal(1);
    });
  });
  it('emits exitFullscreen on toggleFullscreen click if fullscreen is true ', () => {
    const doNothing = () => {};
    cy.mount(MapControls, {
      props: {
        fullscreen: true,
        disableFullscreen: false,
        zoomIn: doNothing,
        zoomOut: doNothing,
      },
    });
    cy.get('#toggle-fullscreen-button').click();
    cy.get('@vue').should(wrapper => {
      expect(wrapper.emitted('exitFullscreen').length).to.equal(1);
    });
  });
});
