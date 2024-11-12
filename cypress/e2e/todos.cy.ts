/// <reference types="cypress" />

describe("Todo App", () => {
  const email = `test${Date.now()}@example.com`;
  const password = "password123";
  const name = "Test User";

  before(() => {
    // Register a new user
    cy.visit("/register");
    cy.get("input#formName").type(name);
    cy.get("input#formEmail").type(email);
    cy.get("input#formPassword").type(password);
    cy.get('button[type="submit"]').contains("Register").click();
  });

  beforeEach(() => {
    // Log in before each test
    cy.visit("/login");
    cy.get("input#formEmail").type(email);
    cy.get("input#formPassword").type(password);
    cy.get('button[type="submit"]').contains("Login").click();
    cy.url().should("include", "/todos");
  });

  it("should create a new todo item", () => {
    cy.get("button").contains("Add").click();
    cy.get("input#formTitle").type("New Todo");
    cy.get("input#formDescription").type("New Todo Description");
    cy.get('button[type="submit"]').contains("Create").click();

    cy.contains("New Todo").should("exist");
    cy.contains("New Todo Description").should("exist");
  });

  it("should edit an existing todo item", () => {
    cy.contains("New Todo")
      .closest(".list-group-item")
      .find('button[aria-label="Edit"]')
      .click();
    cy.get("input#formTitle").clear().type("Updated Todo");
    cy.get("input#formDescription").clear().type("Updated Todo Description");
    cy.get('button[type="submit"]').contains("Save").click();

    cy.contains("Updated Todo").should("exist");
    cy.contains("Updated Todo Description").should("exist");
  });

  it("should delete a todo item", () => {
    cy.contains("Updated Todo")
      .closest(".list-group-item")
      .find('button[aria-label="Delete"]')
      .click();
    cy.contains("Updated Todo").should("not.exist");
    cy.contains("Updated Todo Description").should("not.exist");
  });
});
