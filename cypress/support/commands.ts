/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

require('@4tw/cypress-drag-drop');
import Chainable = Cypress.Chainable;

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to wait for all Chainable
       * @example cy.all(cy.wrap('a'), cy.wrap('b'))
       */
      all<T extends any[]>(...fns: Chainable<any>[]): Chainable<T>;
    }
  }
}

Cypress.Commands.add('all', <T extends any[]>(...fns: Chainable<any>[]): Chainable<T> => {
  const results = [] as unknown as T;

  fns.forEach((fn) => {
    fn.then((result) => results.push(result));
  });

  return cy.wrap(results);
});

export {};
