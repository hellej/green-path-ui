describe('Page load', () => {
  it('opens the page', () => {
    cy.visit('/', {
      onBeforeLoad: () => {
        localStorage.setItem('gp-lang', 'en')
      },
    })
  })

  it('shows welcome info modal', () => {
    cy.get('[data-cy=welcome-info-content]').within(() => {
      cy.contains('Welcome to Green Paths')
      cy.contains('Problem')
      cy.contains('Solution')
    })
  })

  it('shows logos of the sponsors', () => {
    cy.get('[data-cy=sponsor-logos]').children().first().children().should('have.length', 4)
    cy.get('[data-cy=sponsor-logos]').should('have.css', 'position', 'sticky')
  })

  it('hides logos of the sponsors on scroll', () => {
    cy.get('[data-cy=welcome-info-content').scrollTo(0, 20)
    cy.get('[data-cy=sponsor-logos]').should('have.css', 'position', 'static')
  })

  it('closes welcome info', () => {
    cy.get('[data-cy=hide-welcome-button]').contains('OK').click()
  })

  it('shows logos of the sponsors after re-opening the info', () => {
    cy.get('[data-cy=show-info-button]').click()
    cy.get('[data-cy=sponsor-logos]').children().first().children().should('have.length', 4)
    cy.get('[data-cy=sponsor-logos]').should('have.css', 'position', 'sticky')
    cy.get('[data-cy=hide-welcome-button]').contains('OK').click()
  })
})

describe('Language', () => {
  it('changes language from info panel (FI -> SV ->  EN)', () => {
    cy.get('[data-cy=show-info-button]').click()
    cy.get('[data-cy=set-lang-fi-button]').contains('FI').click()
    cy.contains('Tervetuloa')
    cy.get('[data-cy=set-lang-sv-button]').contains('SV').click()
    cy.contains('Välkommen')
    cy.get('[data-cy=set-lang-en-button]').contains('EN').click()
    cy.contains('Welcome')
    cy.get('[data-cy=hide-welcome-button]').contains('OK').click()
  })

  it('changes language from top panel (-> FI -> SV -> EN)', () => {
    cy.get('[data-cy=toggle-lang-button]').within(() => {
      cy.contains('FI').click()
      cy.contains('SV').click()
      cy.contains('EN').click()
      cy.contains('FI')
    })
  })

  it('saves language selection as a cookie (gp-lang)', () => {
    cy.get('[data-cy=toggle-lang-button]').within(() => {
      cy.contains('FI').click()
    })
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'fi')
    cy.get('[data-cy=toggle-lang-button]').click()
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'sv')
    cy.get('[data-cy=toggle-lang-button]').click()
    cy.getCookie('gp-lang').should('exist').should('have.property', 'value', 'en')
  })
})

describe('Select origin and destination', () => {
  it('shows "use current location" option in origin input dropdown', () => {
    cy.get('[data-cy=reset-origin-button]').click()
    cy.get('[data-cy=origin-input-container]').within(() => {
      cy.get('[data-cy=origin-input]').click()
      cy.contains('Use current location')
    })
  })

  it('sets origin by typing address', () => {
    cy.intercept(
      {
        url: 'geocoding',
      },
      { fixture: 'geocode_voimala.json' },
    )
    cy.get('[data-cy=origin-input-container]').within(() => {
      cy.get('[data-cy=origin-input]').type('Voimalamuseo')
      cy.get('[data-cy=origin-input]').should('have.value', 'Voimalamuseo')
      cy.get('ul').within(() => {
        cy.contains('Voimalamuseo').click()
      })
      cy.get('[data-cy=origin-input]').should('have.value', 'Voimalamuseo')
    })
  })

  it('sets destination by typing address', () => {
    cy.intercept(
      {
        url: 'geocoding',
      },
      { fixture: 'geocode_kahvila.json' },
    )
    cy.get('[data-cy=reset-destination-button]').click()
    cy.get('[data-cy=destination-input-container]').within(() => {
      cy.get('[data-cy=destination-input]').click()
      cy.get('[data-cy=destination-input]').type('Kesäkahvila Kumpu')
      cy.get('[data-cy=destination-input]').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('ul').within(() => {
        cy.contains('Kesäkahvila Kumpu').click()
      })
      cy.get('[data-cy=destination-input]').should('have.value', 'Kesäkahvila Kumpu')
    })
  })
})

describe('Find quiet paths', () => {
  it('finds quiet paths (1 shortest + quiet paths)', () => {
    cy.contains('Find quiet paths').click()
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 3)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=env-optimized-path-box').its('length').should('be.gte', 1)
    cy.get('[data-cy=reset-paths-container]').click()
  })

  it('suggests and selects previously selected O/D as origin', () => {
    cy.get('[data-cy=origin-input-container]').within(() => {
      cy.get('[data-cy=origin-input]').should('have.value', 'Voimalamuseo')
      cy.get('[data-cy=origin-input]').clear()
      cy.get('ul').within(() => {
        cy.contains('Kesäkahvila Kumpu').click()
      })
      cy.get('[data-cy=origin-input]').should('have.value', 'Kesäkahvila Kumpu')
    })
  })

  it('suggests and selects previously selected O/D as destination', () => {
    cy.get('[data-cy=destination-input-container]').within(() => {
      cy.get('[data-cy=destination-input]').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('[data-cy=destination-input]').clear()
      cy.get('ul').within(() => {
        cy.contains('Voimalamuseo').click()
      })
      cy.get('[data-cy=destination-input]').should('have.value', 'Voimalamuseo')
    })
  })

  it('finds quiet paths with previously selected O/D', () => {
    cy.contains('Find quiet paths').click()
    cy.get('[data-cy=od-container]').within(() => {
      cy.get('[data-cy=origin-input]').should('have.value', 'Kesäkahvila Kumpu')
      cy.get('[data-cy=destination-input]').should('have.value', 'Voimalamuseo')
    })
    cy.contains('Typical daily traffic noise (dB)')
    cy.get('[data-cy=path-panel-container]').children().its('length').should('be.gte', 3)
    cy.get('[data-cy=shortest-path-box').should('have.length', 1)
    cy.get('[data-cy=env-optimized-path-box').its('length').should('be.gte', 1)
    cy.get('[data-cy=reset-paths-container]').click()
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
    cy.get('[data-cy=reset-paths-container]').click()
  })

  it('sets origin', () => {
    cy.intercept('geocoding', { fixture: 'geocode_kellomaki.json' })
    cy.get('[data-cy=reset-origin-button]').click()
    cy.get('[data-cy=origin-input-container]').within(() => {
      cy.get('[data-cy=origin-input]').click()
      cy.get('[data-cy=origin-input]').type('Kellomäki')
      cy.get('li').contains('Kellomäki').first().click()
    })
  })

  it('sets destination', () => {
    cy.intercept('geocoding', { fixture: 'geocode_physicum.json' })
    cy.get('[data-cy=reset-destination-button]').click()
    cy.get('[data-cy=destination-input-container]').within(() => {
      cy.get('[data-cy=destination-input]').click()
      cy.get('[data-cy=destination-input]').type('Physicum')
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

describe('Toggle routing mode: walk -> bike -> walk', () => {
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

describe('Open path exposure info', () => {
  it('shows quiet path exposure info for the shortest path', () => {
    cy.get('[data-cy=path-panel-container]')
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains('Shares of different traffic noise levels on the selected (shortest) path:')
    cy.get('[data-cy=close-path-button]').click()
  })

  it('shows quiet path exposure info for a quiet path', () => {
    cy.get('[data-cy=path-panel-container]')
      .children()
      .next()
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains(
      'Shares of different traffic noise levels on the selected (1) and the shortest (2) path:',
    )
    cy.get('[data-cy=close-path-button]').click()
  })

  it('shows fresh air path exposure info for the shortest path', () => {
    cy.get('[data-cy=toggle-paths-exposure]').click()
    cy.contains('Air quality')

    cy.get('[data-cy=path-panel-container]')
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains('Shares of different air quality classes on the selected (shortest) path:')
    cy.get('[data-cy=close-path-button]').click()
  })

  it('shows fresh air path exposure info for a fresh air path', () => {
    cy.get('[data-cy=path-panel-container]')
      .children()
      .next()
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains(
      'Shares of different air quality classes on the selected (1) and the shortest (2) path:',
    )
    cy.get('[data-cy=close-path-button]').click()
  })

  it('shows green path exposure info for the shortest path', () => {
    cy.get('[data-cy=toggle-paths-exposure]').click()
    cy.contains('Greenery (vegetation)')

    cy.get('[data-cy=path-panel-container]')
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains('Shares of green vegetation views (%) on the selected (shortest) path:')
    cy.get('[data-cy=close-path-button]').click()
  })

  it('selects the opened shortest path', () => {
    cy.get('[data-cy=path-panel-container]').within(() => {
      cy.get('[data-cy=path-box-selected-true]').within(() => {
        cy.contains('22 min')
        cy.contains('1.7 km')
      })
    })
  })

  it('shows green path exposure info for a green path', () => {
    cy.get('[data-cy=path-panel-container]')
      .children()
      .next()
      .children()
      .first()
      .within(() => {
        cy.get('[data-cy=open-path-button]').click()
      })
    cy.contains(
      'Shares of green vegetation views (%) on the selected (1) and the shortest (2) path:',
    )
    cy.get('[data-cy=close-path-button]').click()
  })

  it('selects the opened env optimized path', () => {
    cy.get('[data-cy=path-panel-container]').within(() => {
      cy.get('[data-cy=path-box-selected-true]').within(() => {
        cy.contains('23 min')
        cy.contains('1.8 km')
      })
    })
  })
})
