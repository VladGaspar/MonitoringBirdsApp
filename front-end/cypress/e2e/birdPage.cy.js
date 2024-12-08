import {appRoutes} from "../../src/routes/appRoutes";

describe('Observation Page', () => {
  beforeEach(() => {
    cy.visit(appRoutes.observations);
  });

  it('should display the filter section and tabs correctly', () => {

    cy.get('h1').should('contain', 'Filtrare');
    cy.get('button').contains('Hartă').should('exist');
    cy.get('button').contains('Grafic').should('exist');
    cy.get('button').contains('Observații pe luni').should('exist');
  });

  it('should switch to map tab and display RomaniaMap component', () => {
    cy.get('button').contains('Hartă').click();
    cy.get('.rounded-lg').within(() => {
      cy.get('.flex-grow.overflow-hidden').should('exist');
    });
  });

  it('should switch to chart tab and display ObservationChart component', () => {
    cy.get('button').contains('Grafic').click();
    cy.get('select').select('3_DAYS');
    cy.get('select').should('have.value', '3_DAYS');
    cy.get('select').select('1_WEEK');
    cy.get('select').should('have.value', '1_WEEK');
    cy.get('.rounded-lg').within(() => {
      cy.get('.flex-grow.overflow-hidden').should('exist');
    });
  });

  it('should switch to mapChart tab and display RomaniaMapSlideshow component', () => {
    cy.get('button').contains('Observații pe luni').click();
    cy.get('.rounded-lg').within(() => {
      cy.get('.overflow-hidden').should('exist');
    });
  });

  it('should submit filter and reset filter correctly', () => {
    cy.get('button').contains('Șterge').click();
    // Add specific assertions based on your filter reset functionality
    cy.get('button').contains('Aplică').click();
    // Add specific assertions based on your filter submit functionality
  });

});
