import { faker } from '@faker-js/faker';

const doc = {
  get firstArticle() {
    return cy.get('[id^="Articles"]').eq(0);
  },
  get articleName() {
    return doc.firstArticle.find('h2');
  },
  get articleDesc() {
    return doc.firstArticle.find('[class*="textArea"]');
  },
  articleEditBtn(elText: string) {
    return cy.get('[class*="inEditMode"]').contains(elText).siblings(':contains(edit)');
  },
  get doneEditBtn() {
    return cy.get('button').contains('Done');
  },
  get dragTo() {
    return cy.get('.styles_contentDarkMode__Vmpie:eq(1)').parent();
  },
};

const newNameValue = faker.random.words(3);
const newDescValue = faker.random.words(5);

describe('newsletters', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/UserFeedModel/list_newsletter_editions').as('news');
    cy.visit(Cypress.config('baseUrl'));
    cy.wait('@news', { timeout: 20000 }).wait('@news', { timeout: 20000 });
    cy.wait(8000);
  });

  it('when edit article name, expected details to be updated', () => {
    doc.articleName
      .invoke('text')
      .then((articleName) => {
        return articleName;
      })
      .then((artName) => {
        doc.firstArticle.click();
        cy.wait(2000);

        // enter new name and check it
        cy.get('[class*="inEditMode"]').contains(artName).siblings(':contains(edit)').click();
        cy.get('input').type(newNameValue);

        doc.doneEditBtn.click();
        cy.contains(artName + newNameValue).should('exist');

        cy.get('[class*="editLastOptionActions"]').find('button:contains(Done)').click();

        // check final results

        doc.articleName
          .contains(artName + newNameValue)
          .scrollIntoView()
          .should('be.visible');
        cy.contains(new RegExp('^' + artName + '$')).should('not.exist');
      });
  });

  it('when edit article description, expected details to be updated', () => {
    doc.articleDesc.invoke('text').then((description) => {
      const desc = description.trim();
      doc.firstArticle.click();
      cy.wait(2000);

      // enter new desc and check it
      cy.get('[class*="inEditMode"]').find(`div:contains(${desc}):last`).siblings(':contains(edit)').click();
      cy.get('[data-editor]').type(newDescValue);

      doc.doneEditBtn.click();
      cy.contains(desc + newDescValue).should('exist');

      cy.get('[class*="editLastOptionActions"]').find('button:contains(Done)').click();

      // check final results
      doc.articleDesc
        .contains(desc + newDescValue)
        .scrollIntoView()
        .should('be.visible');
      doc.articleDesc;
      cy.contains(new RegExp('^' + desc + '$')).should('not.exist');
    });
  });

  it('when edit article name/description, expected details to be updated on the preview step', () => {
    cy.intercept('POST', '**/api/UserFeedModel/generate_report').as('report');
    doc.articleName
      .invoke('text')
      .then((articleName) => {
        return cy.all<[string, string]>(cy.wrap(articleName), doc.articleDesc.invoke('text'));
      })
      .then(([artName, description]) => {
        const desc = description.trim();
        doc.firstArticle.click();
        cy.wait(2000);

        // enter new name and check it
        cy.get('[class*="inEditMode"]').contains(artName).siblings(':contains(edit)').click();
        cy.get('input').type(newNameValue);

        doc.doneEditBtn.click();

        // enter new desc and check it
        cy.get('[class*="inEditMode"]').find(`div:contains(${desc}):last`).siblings(':contains(edit)').click();
        cy.get('[data-editor]').type(newDescValue);

        doc.doneEditBtn.click();

        cy.get('[class*="editLastOptionActions"]').find('button:contains(Done)').click();

        // check final results
        cy.contains('Send Newsletter').click();
        cy.wait('@report', { timeout: 20000 });

        cy.contains(artName + newNameValue).should('exist');
        cy.contains(desc + newDescValue).should('exist');
      });
  });

  it('when upload new image, expected background to be updated', () => {
    doc.firstArticle.click();
    cy.wait(5000);
    cy.get('button').contains('Upload Image').click();

    cy.get('input[type="file"]').attachFile({
      filePath: 'dino.png',
    });

    cy.wait(3000); //wait for image loading
    cy.get('[class*=inEditMode__VgD4r]')
      .find('[style*=background-image]')
      .invoke('attr', 'style')
      .should('contain', 'dino');

    cy.get('[class*="editLastOptionActions"]').find('button:contains(Done)').click();
    cy.wait(2000); // wait for changes to be saved
    doc.firstArticle.find('[style*=background-image]').invoke('attr', 'style').should('contain', 'dino');
  });

  it("when drag'n'drop element, expected articles to be re-ordered", () => {
    let list: Array<string> = [];
    let updList: Array<string> = [];

    let newIdx: number;
    cy.get('.styles_contentDarkMode__Vmpie')
      .find('.styles_text__Ti7zU')
      .each((el) => list.push(el.text()))
      .then(() => {
        cy.get('.styles_handle__EMNKs:eq(0)').drag('.styles_handle__EMNKs:eq(2)', {
          force: true,
        });
      });

    cy.get('.styles_contentDarkMode__Vmpie')
      .find('.styles_text__Ti7zU')
      .each((el) => updList.push(el.text()))
      .then(() => {
        newIdx = updList.indexOf(list[0]);

        cy.contains(list[0]).should('be.visible'); // element is still on the screen
        expect(list.length).to.be.equal(updList.length); // articles length is not changed
        expect(newIdx).to.not.equal(0); // element is not the 1st one in the list
      });
  });
});
