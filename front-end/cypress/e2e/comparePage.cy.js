import {appRoutes} from "../../src/routes/appRoutes";

describe('Compare Page', () => {
    beforeEach(() => {
        cy.visit(appRoutes.observations);
    });

    it('should display the form to search for the user', () => {

        cy.get('h1').should('contain', 'Filtrare');
        cy.get('button').contains('Hartă').should('exist');
        cy.get('button').contains('Grafic').should('exist');
        cy.get('button').contains('Observații pe luni').should('exist');
    });

    it('should subbmit the form ', () => {

        cy.get('h1').should('contain', 'Filtrare');
        cy.get('button').contains('Hartă').should('exist');
        cy.get('button').contains('Grafic').should('exist');
        cy.get('button').contains('Observații pe luni').should('exist');
    });

    it('should display the graph and birds list of logged user', () => {
        cy.get('button').contains('Hartă').click();
        cy.get('.rounded-lg').within(() => {
            cy.get('.flex-grow.overflow-hidden').should('exist');
        });
    });

    it('should display the graph and birds list of compared user', () => {
        cy.get('button').contains('Grafic').click();
        cy.get('select').select('3_DAYS');
        cy.get('select').should('have.value', '3_DAYS');
        cy.get('select').select('1_WEEK');
        cy.get('select').should('have.value', '1_WEEK');
        cy.get('.rounded-lg').within(() => {
            cy.get('.flex-grow.overflow-hidden').should('exist');
        });
    });

});
