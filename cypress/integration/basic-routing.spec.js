describe('Page load', () => {
  it('opens the page', () => {
    cy.visit('/')
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
        // search: {
        //   text: /Voi/, //the scope of this intercept is anyway just this it
        // },
      },
      { fixture: 'geocode_voimala.json' },
    )
    cy.get('#origin-input-container').within(() => {
      cy.get('#origin-input').type('Voimalamuseo')
      cy.get('#origin-input').should('have.value', 'Voimalamuseo')
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
        // search: {
        //   text: '/Kes/', //the scope of this intercept is anyway just this it
        // },
      },
      { fixture: 'geocode_kahvila.json' },
    )
    cy.get('#reset-destination-button').click()
    cy.get('#destination-input-container').within(() => {
      cy.get('#destination-input').click()
      cy.get('#destination-input').type('Kesäkahvila Kumpu')
      cy.get('#destination-input').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('ul').within(() => {
        cy.contains('Kesäkahvila Kumpu').click()
      })
      cy.get('#destination-input').should('have.value', 'Kesäkahvila Kumpu')
    })
  })
})

describe('Find quiet paths', () => {
  it('finds quiet paths (1 shortest + quiet paths)', () => {
    cy.contains('Find quiet paths').click()
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 3)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=env-optimized-path-box').its('length').should('be.gte', 1)
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
    cy.contains('Typical daily traffic noise (dB)')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 3)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=env-optimized-path-box').its('length').should('be.gte', 1)
    cy.get('#reset-paths-container').click()
  })
})

describe('Find fresh air paths', () => {
  it('finds fresh air paths (only shortest path)', () => {
    cy.intercept('**/paths/walk/clean/60.202413,24.957558/60.21612,24.98068', {
      fixture: 'clean_paths_1.json',
    })
    cy.contains('Find fresh air paths').click()
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 2)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.contains('Air quality')
    cy.get('#reset-paths-container').click()
  })

  it('sets origin', () => {
    cy.intercept('geocoding', { fixture: 'geocode_kellomaki.json' })
    cy.get('#reset-origin-button').click()
    cy.get('#origin-input-container').within(() => {
      cy.get('#origin-input').click()
      cy.get('#origin-input').type('Kellomäki')
      cy.get('li').contains('Kellomäki').first().click()
    })
  })

  it('sets destination', () => {
    cy.intercept('geocoding', { fixture: 'geocode_physicum.json' })
    cy.get('#reset-destination-button').click()
    cy.get('#destination-input-container').within(() => {
      cy.get('#destination-input').click()
      cy.get('#destination-input').type('Physicum')
      cy.get('li').contains('Physicum').first().click()
    })
  })

  it('finds fresh air paths (shortest + 1 fresh air path)', () => {
    cy.intercept('**/paths/walk/clean/60.215723,24.978641/60.205098,24.962761', {
      fixture: 'clean_paths_2.json',
    })
    cy.contains('Find fresh air paths').click()
    cy.contains('Air quality')
    cy.contains('22 min')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 3)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=env-optimized-path-box').its('length').should('be.eq', 1)
  })
})

describe('Toggle routing mode: fresh air -> green -> quiet', () => {
  it('switches to showing green and then quiet paths', () => {
    cy.intercept('**/paths/walk/quiet/60.215723,24.978641/60.205098,24.962761', {
      fixture: 'quiet_paths_1.json',
    })
    cy.intercept('**/paths/walk/green/60.215723,24.978641/60.205098,24.962761', {
      fixture: 'green_paths_1.json',
    })
    // -> green
    cy.get('[data-cy=toggle-paths-exposure]').click()
    cy.contains('Greenery (vegetation)')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 4)
    // -> quiet
    cy.get('[data-cy=toggle-paths-exposure]').click()
    cy.contains('Typical daily traffic noise (dB')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 4)
  })
})

describe('Toggle routing mode: walk -> bike', () => {
  it('switches to showing paths for biking', () => {
    cy.intercept('**/paths/bike/quiet/60.215723,24.978641/60.205098,24.962761', {
      fixture: 'quiet_paths_2.json',
    })
    cy.get('[data-cy=toggle-to-bike-button]').click()
    cy.contains('7 min')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 4)
  })

  it('switches to showing paths for walking', () => {
    cy.intercept('**/paths/walk/quiet/60.215723,24.978641/60.205098,24.962761', {
      fixture: 'quiet_paths_1.json',
    })
    cy.get('[data-cy=toggle-to-walk-button]').click()
    cy.contains('22 min')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.eq', 4)
  })
})
