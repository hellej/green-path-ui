describe('Page load', () => {

  it('opens the page', () => {
    cy.visit('http://localhost:5000/')
    cy.get('#set-lang-en-button').click({ force: true })
    cy.contains('Welcome')
  })

  it('closes welcome info', () => {
    cy.get('#hide-welcome-button').contains('OK').click()
  })
})


describe('Select language', () => {

  it('changes language from info panel (FI -> EN)', () => {
    cy.get('#show-info-button').click()
    cy.get('#set-lang-fi-button').contains('FI').click()
    cy.contains('Tervetuloa')
    cy.get('#toggle-lang-button').contains('SV')
    cy.get('#set-lang-en-button').within(() => {
      cy.contains('EN').click()
    })
    cy.get('#toggle-lang-button').contains('FI')
    cy.get('#hide-welcome-button').contains('OK').click()
  })
  
})
