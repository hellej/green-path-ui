describe('Page load', () => {
  it('opens the page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#set-lang-en-button').click({ force: true })
    cy.contains('Welcome')
  })

  it('closes welcome info', () => {
    cy.get('#hide-welcome-button').contains('OK').click()
  })
})

describe('Language', () => {
  it('changes language from info panel (FI -> SV ->  EN)', () => {
    cy.get('#show-info-button').click()
    cy.get('#set-lang-fi-button').contains('FI').click()
    cy.contains('Tervetuloa')
    cy.get('#set-lang-sv-button').contains('SV').click()
    cy.contains('Välkommen')
    cy.get('#set-lang-en-button').contains('EN').click()
    cy.contains('Welcome')
    cy.get('#hide-welcome-button').contains('OK').click()
  })

  it('changes language from top panel (-> FI -> SV -> EN)', () => {
    cy.get('#toggle-lang-button').within(() => {
      cy.contains('FI').click()
      cy.contains('SV').click()
      cy.contains('EN').click()
      cy.contains('FI')
    })
  })

  it('saves language selection as a cookie (gp-lang)', () => {
    cy.get('#toggle-lang-button').within(() => {
      cy.contains('FI').click()
    })
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'fi')
    cy.get('#toggle-lang-button').click()
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'sv')
    cy.get('#toggle-lang-button').click()
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'en')
  })
})

describe('Select origin and destination', () => {
  it('shows "use current location" option in origin input dropdown', () => {
    cy.get('#reset-origin-button').click()
    cy.get('#origin-input-container').within(() => {
      cy.get('#origin-input').click()
      cy.contains('Use current location')
    })
  })

  it('sets origin by typing address', () => {
    cy.intercept(
      {
        url: 'geocoding',
        search: {
          text: '/Voi/',
        },
      },
      { fixture: 'geocode_voimala.json' },
    )
    cy.get('#origin-input-container').within(() => {
      cy.get('#origin-input').type('Voimalamuseo')
      cy.get('ul').within(() => {
        cy.contains('Voimalamuseo').click()
      })
      cy.get('#origin-input').should('have.value', 'Voimalamuseo')
    })
  })

  it('sets destination by typing address', () => {
    cy.intercept(
      {
        url: 'geocoding',
        search: {
          text: '/Kes/',
        },
      },
      { fixture: 'geocode_kahvila.json' },
    )
    cy.get('#reset-destination-button').click()
    cy.get('#destination-input-container').within(() => {
      cy.get('#destination-input').click()
      cy.get('#destination-input').type('Kesäkahvila Kumpu')
      cy.get('ul').within(() => {
        cy.contains('Kesäkahvila Kumpu').click()
      })
      cy.get('#destination-input').should('have.value', 'Kesäkahvila Kumpu')
    })
  })
})

describe('Pathfinding', () => {
  it('finds quiet paths', () => {
    cy.contains('Find quiet paths').click()
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 2)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=green-path-box').its('length').should('be.gte', 1)
    cy.get('#reset-paths-container').click()
  })

  it('suggests and selects previously selected O/D as origin', () => {
    cy.get('#origin-input-container').within(() => {
      cy.get('#origin-input').should('have.value', 'Voimalamuseo')
      cy.get('#origin-input').clear()
      cy.get('ul').within(() => {
        cy.contains('Kesäkahvila Kumpu').click()
      })
      cy.get('#origin-input').should('have.value', 'Kesäkahvila Kumpu')
    })
  })

  it('suggests and selects previously selected O/D as destination', () => {
    cy.get('#destination-input-container').within(() => {
      cy.get('#destination-input').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('#destination-input').clear()
      cy.get('ul').within(() => {
        cy.contains('Voimalamuseo').click()
      })
      cy.get('#destination-input').should('have.value', 'Voimalamuseo')
    })
  })

  it('finds quiet paths with previously selected O/D', () => {
    cy.contains('Find quiet paths').click()
    cy.get('#od-container').within(() => {
      cy.get('#origin-input').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('#destination-input').should('have.value', 'Voimalamuseo')
    })
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 2)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=green-path-box').its('length').should('be.gte', 1)
    cy.get('#reset-paths-container').click()
  })
})
