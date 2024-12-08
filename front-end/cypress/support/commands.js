// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { appRoutes } from '../../src/routes/appRoutes';
import authMock from '../utils/authMock';

Cypress.Commands.add('mockLogin', (authMockKey) => {
    const mock = authMock[authMockKey];
    cy.session([authMockKey], () => {
        cy.visit(appRoutes.account.login);
        cy.interceptLogin(mock.token);
        cy.get('input[name=username]').type(mock.username);
        cy.get('input[name=password]').type(mock.password);
        cy.get('button[type=submit]').click();

        cy.url().should('include', '/');
        cy.get('h1').should('contain', mock.username);
    });
});
