/**
 * Cypress E2E: Ladder view, game page (timer, answer buttons), feed-pot gasless preview.
 * Run with miniapp dev server: npm run dev, then npm run test:e2e.
 */
describe("Millionaire Arena miniapp", () => {
  it("shows home and navigates to ladder", () => {
    cy.visit("/");
    cy.contains("Millionaire Arena");
    cy.contains("View ladder").click();
    cy.url().should("include", "/ladder");
    cy.contains("15-Question Ladder");
    cy.contains("Safe at Q5 and Q10");
  });

  it("ladder has progress bar and 15 steps", () => {
    cy.visit("/ladder");
    cy.get("[role=progressbar]").should("exist");
    cy.contains("Q1");
    cy.contains("Q15");
    cy.contains("10000x");
  });

  it("game page has timer and answer options", () => {
    cy.visit("/game");
    cy.contains("Round 1");
    cy.contains("Timer:");
    cy.get("[role=group][aria-label='Answer options']").find("button").should("have.length", 4);
    cy.get("[role=group][aria-label='Lifelines']").should("exist");
  });

  it("feed-pot page has preview and gasless button", () => {
    cy.visit("/feed-pot");
    cy.contains("Feed the pot");
    cy.contains("Gasless via Paymaster");
    cy.get("input[placeholder='e.g. round1']").type("round1");
    cy.contains("Preview").click();
    cy.contains("Feed pot (gasless)").should("exist");
  });
});
