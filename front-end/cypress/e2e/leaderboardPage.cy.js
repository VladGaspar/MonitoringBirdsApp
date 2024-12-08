import {appRoutes} from "../../src/routes/appRoutes";

describe('Leaderboard Page', () => {
    beforeEach(() => {
        cy.visit(appRoutes.observations);
    });

    it('should display the leaderboard', () => {

        cy.get('h1').should('contain', 'Filtrare');
        cy.get('button').contains('Hartă').should('exist');
        cy.get('button').contains('Grafic').should('exist');
        cy.get('button').contains('Observații pe luni').should('exist');
    });

    it('should highlight logged user username', () => {
        cy.get('button').contains('Hartă').click();
        cy.get('.rounded-lg').within(() => {
            cy.get('.flex-grow.overflow-hidden').should('exist');
        });
    });

});
