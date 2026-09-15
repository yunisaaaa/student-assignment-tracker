describe('Student Assignment Tracker', () => {
  it('loads the home page with the tracker UI', () => {
    cy.visit('/home')
    cy.contains('Student Assignment Tracker').should('be.visible')
    cy.contains('h1', 'Assignments').should('be.visible')
    cy.contains('ion-card-title', 'New assignment').should('be.visible')
  })
})