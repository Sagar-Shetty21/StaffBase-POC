import { test, expect } from "@playwright/test";

test.describe("Employee Form", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to your form page
        await page.goto("/employees/new");
    });

    test("should create a new employee successfully", async ({ page }) => {
        // Fill out the form
        await page.fill('[data-testid="employee-name"]', "John Doe");
        await page.fill(
            '[data-testid="employee-email"]',
            "john.doe@company.com"
        );
        await page.fill(
            '[data-testid="employee-position"]',
            "Software Developer"
        );
        await page.selectOption(
            '[data-testid="employee-department"]',
            "Engineering"
        );

        // Submit the form
        await page.click('[data-testid="submit-button"]');

        // Wait for success message or redirect
        await expect(
            page.locator('[data-testid="success-message"]')
        ).toBeVisible();

        // Verify the employee appears in the list (if redirected to list page)
        await expect(page.locator("text=John Doe")).toBeVisible();
    });

    test("should show validation errors for empty required fields", async ({
        page,
    }) => {
        // Try to submit empty form
        await page.click('[data-testid="submit-button"]');

        // Check for validation errors
        await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
        await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    });

    test("should show error for invalid email format", async ({ page }) => {
        await page.fill('[data-testid="employee-name"]', "John Doe");
        await page.fill('[data-testid="employee-email"]', "invalid-email");
        await page.click('[data-testid="submit-button"]');

        await expect(page.locator('[data-testid="email-error"]')).toContainText(
            "Invalid email"
        );
    });
});

test("should handle API errors gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("**/api/employees", (route) => {
        route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Server error" }),
        });
    });

    await page.fill('[data-testid="employee-name"]', "John Doe");
    await page.click('[data-testid="submit-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toContainText(
        "Server error"
    );
});
