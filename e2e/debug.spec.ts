import { test, expect } from "@playwright/test";

test.describe("Debug Tests", () => {
  test("debug navigation and see what loads", async ({ page }) => {
    console.log("Starting test...");

    // Try navigating to homepage first
    console.log("Navigating to homepage...");
    await page.goto("/");
    console.log("Homepage URL:", page.url());
    await page.screenshot({ path: "homepage.png" });

    // Check if homepage loaded correctly
    const title = await page.title();
    console.log("Page title:", title);

    // Try to find common elements
    const bodyText = await page.locator("body").innerText();
    console.log("Body text (first 200 chars):", bodyText.substring(0, 200));

    // Now try the /add route
    console.log("Navigating to /add...");
    try {
      await page.goto("/add");
      console.log("Add page URL:", page.url());
      await page.screenshot({ path: "add-page.png" });

      const addPageTitle = await page.title();
      console.log("Add page title:", addPageTitle);

      // Check if form exists
      const formExists = await page.locator("form").count();
      console.log("Number of forms found:", formExists);

      if (formExists > 0) {
        console.log("✅ Form found! Test should work.");
      } else {
        console.log("❌ No form found. Check your route or form selector.");
      }
    } catch (error) {
      console.log("❌ Error navigating to /add:", error);

      // Let's see what routes might exist
      console.log("Checking common routes...");
      const commonRoutes = [
        "/employees/add",
        "/add-employee",
        "/employee/add",
        "/create-employee",
      ];

      for (const route of commonRoutes) {
        try {
          await page.goto(route);
          const currentUrl = page.url();
          if (
            !currentUrl.includes("404") &&
            !currentUrl.includes("not-found")
          ) {
            console.log(`✅ Found working route: ${route}`);
            await page.screenshot({
              path: `route-${route.replace(/\//g, "-")}.png`,
            });
          }
        } catch (e: any) {
          console.log(`❌ Route ${route} failed:`, e.message);
        }
      }
    }
  });
});
