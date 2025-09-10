import { test, expect } from "@playwright/test";

test.describe("Employee Form E2E Tests", () => {
  test("should fill employee form, submit, and verify redirect with correct data", async ({
    page,
  }) => {
    // Navigate to the add employee page
    await page.goto("/add");

    // Wait for the form to load
    await expect(page.locator("form")).toBeVisible();

    // Test data
    const employeeData = {
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      designation: "Senior Software Engineer",
      joiningDate: "2024-01-15",
      employmentType: "Full-time",
      birthDate: "1990-05-20",
      emergencyContact: "+1 (555) 123-4567",
      linkedinProfile: "https://linkedin.com/in/johndoe",
      workLocation: "New York Office",
      preferredWorkingHours: "09:00",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      performanceRating: 8,
      bio: "Experienced software engineer with a passion for building scalable web applications.",
      preferredCommunication: "slack",
    };

    // Fill Personal Information Section
    await page.fill('[data-testid="employee-name"]', employeeData.name);
    await page.fill("#email", employeeData.email);
    await page.fill("#date_of_birth", employeeData.birthDate);
    await page.fill("#emergency_contact", employeeData.emergencyContact);
    await page.fill("#linkedin_profile", employeeData.linkedinProfile);

    // Fill Professional Information Section
    await page.selectOption("#department", employeeData.department);
    await page.fill("#designation", employeeData.designation);
    await page.fill("#joining_date", employeeData.joiningDate);

    // Select employment type radio button
    await page.check(
      `input[name="employment_type"][value="${employeeData.employmentType}"]`
    );

    // Fill Work Preferences Section
    await page.selectOption("#work_location", employeeData.workLocation);
    await page.check("#is_remote", { force: true }); // Force check in case of overlay
    await page.fill(
      "#preferred_working_hours",
      employeeData.preferredWorkingHours
    );

    // Select preferred communication method
    await page.check(
      `input[name="preferred_communication"][value="${employeeData.preferredCommunication}"]`,
      { force: true }
    );

    // Fill Skills Section
    for (const skill of employeeData.skills) {
      await page.fill("#new_skill_temp", skill);
      await page.click('button:has-text("+")');
      // Wait for skill to be added
      await expect(
        page.locator('[data-testid="skills-container"] span', {
          hasText: skill,
        })
      ).toBeVisible();
    }

    // Set performance rating
    await page.fill(
      "#performance_rating",
      employeeData.performanceRating.toString()
    );

    // Fill Additional Information Section
    await page.fill("#bio", employeeData.bio);

    // Select notification preferences
    // Find checkboxes by their label text
    await page.click(
      'label:has-text("Email Notifications") input[type="checkbox"]',
      { force: true }
    );
    await page.click(
      'label:has-text("Push Notifications") input[type="checkbox"]',
      { force: true }
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // For server-side redirects, wait for the page to load completely
    // await page.waitForLoadState("networkidle");

    // Instead of waiting for URL, wait for employee page content to load
    await expect(
      page.locator(`input[value="${employeeData.name}"]`)
    ).toBeVisible({ timeout: 15000 });

    // Check the final URL after redirect
    const currentUrl = page.url();

    // Verify we're on the employee detail page
    expect(currentUrl).toMatch(/\/employee\/[\w-]+$/);

    // Extract employee ID from URL
    const employeeId = currentUrl.match(/\/employee\/([\w-]+)$/)?.[1];
    expect(employeeId).toBeDefined();

    // Verify employee details are displayed correctly
    await expect(
      page.locator(`input[value="${employeeData.email}"]`)
    ).toBeVisible();
    await expect(
      page.locator(`input[value="${employeeData.designation}"]`)
    ).toBeVisible();
    await expect(page.getByText(employeeData.department)).toBeVisible();

    // Verify skills are displayed
    for (const skill of employeeData.skills) {
      await expect(page.getByText(skill)).toBeVisible();
    }

    // // Verify other details
    // await expect(page.getByText(employeeData.workLocation)).toBeVisible();
    // await expect(page.getByText("Remote Work: Available")).toBeVisible();

    // Verify bio is displayed
    await expect(page.getByText(employeeData.bio)).toBeVisible();
  });

  test("should show validation errors for required fields", async ({
    page,
  }) => {
    await page.goto("/add");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors on required fields
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Department is required")).toBeVisible();
    await expect(page.getByText("Job title is required")).toBeVisible();
    await expect(page.getByText("Joining date is required")).toBeVisible();
  });

  test("should handle contract employment type with end date", async ({
    page,
  }) => {
    await page.goto("/add");

    // Fill required fields first
    await page.fill('[data-testid="employee-name"]', "Jane Contract");
    await page.fill("#email", "jane.contract@company.com");
    await page.selectOption("#department", "Engineering");
    await page.fill("#designation", "Contract Developer");
    await page.fill("#joining_date", "2024-01-01");

    // Select Contract employment type
    await page.check('input[name="employment_type"][value="Contract"]');

    // Contract end date field should now be visible
    await expect(page.locator("#contract_end_date")).toBeVisible();
    await page.fill("#contract_end_date", "2024-12-31");

    // Submit form
    await page.click('button[type="submit"]');

    // Verify successful submission and redirect
    await page.waitForURL(/\/employee\/\d+/);
    await expect(page.getByText("Jane Contract")).toBeVisible();
  });

  test("should prevent adding duplicate skills", async ({ page }) => {
    await page.goto("/add");

    const skillName = "JavaScript";

    // Add a skill
    await page.fill("#new_skill_temp", skillName);
    await page.click('button:has-text("+")');
    await expect(
      page.locator(".skillTag", { hasText: skillName })
    ).toBeVisible();

    // Try to add the same skill again
    await page.fill("#new_skill_temp", skillName);
    await page.click('button:has-text("+")');

    // Should show validation error
    await expect(page.getByText("This skill already exists")).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.goto("/add");

    // Enter invalid email
    await page.fill("#email", "invalid-email");
    await page.fill('[data-testid="employee-name"]', "Test User"); // Focus on another field to trigger validation

    // Check for email validation error
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("should update performance rating display", async ({ page }) => {
    await page.goto("/add");

    // Change performance rating
    await page.fill("#performance_rating", "7");

    // Verify the rating display updates
    await expect(page.getByText("7/10")).toBeVisible();
  });

  test("should handle notification preferences selection", async ({ page }) => {
    await page.goto("/add");

    // Initially no preferences selected
    await expect(page.getByText("(0 selected)")).toBeVisible();

    // Select some preferences
    await page.check('input[type="checkbox"][value="email_notifications"]');
    await page.check('input[type="checkbox"][value="sms_notifications"]');

    // Count should update
    await expect(page.getByText("(2 selected)")).toBeVisible();

    // Deselect one
    await page.uncheck('input[type="checkbox"][value="sms_notifications"]');
    await expect(page.getByText("(1 selected)")).toBeVisible();
  });

  test("should handle form submission loading state", async ({ page }) => {
    await page.goto("/add");

    // Fill minimum required fields
    await page.fill('[data-testid="employee-name"]', "Loading Test");
    await page.fill("#email", "loading@test.com");
    await page.selectOption("#department", "Engineering");
    await page.fill("#designation", "Test Engineer");
    await page.fill("#joining_date", "2024-01-01");

    // Submit form and check loading state
    await page.click('button[type="submit"]');

    // Should show loading state briefly
    await expect(page.getByText("Adding Employee...")).toBeVisible();

    // Then should redirect
    await page.waitForURL(/\/employee\/\d+/);
  });
});

// Helper test for data-testid additions (once you add them)
test.describe("Form Field Data Test IDs", () => {
  test("should have data-testid attributes on form fields", async ({
    page,
  }) => {
    await page.goto("/add");

    // Verify data-testid attributes exist (add these to your form)
    await expect(page.locator('[data-testid="employee-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="employee-email"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="employee-department"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="employee-designation"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="employee-joining-date"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="employee-bio"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });
});
