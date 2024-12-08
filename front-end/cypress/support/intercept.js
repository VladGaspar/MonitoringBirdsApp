import fixtures from '../utils/fixtures';
import { getExactPath } from '../utils/testPathUtils';

Cypress.Commands.add("interceptLogin", (token) => {
    cy.intercept('POST', getExactPath('/login'), req => {
        req.reply({
            statusCode: 200,
            fixture: fixtures.loginResponse,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    });
});

