import {appRoutes} from "../../src/routes/appRoutes";

describe('Login Page', () => {
    beforeEach(() => {
        cy.visit(appRoutes.observations);
    });

    it('should login user', () => {

        cy.get('h1').should('contain', 'Filtrare');
        cy.get('button').contains('Hartă').should('exist');
        cy.get('button').contains('Grafic').should('exist');
        cy.get('button').contains('Observații pe luni').should('exist');
    });

});
