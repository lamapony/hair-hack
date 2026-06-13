import { expect, test } from "@playwright/test";

test.describe("Hair Hack smoke", () => {
  test("clinic home loads with consent gate", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hair Hack" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Generate preview/i }),
    ).toBeDisabled();
    await expect(page.getByText(/Staff attestation/i)).toBeVisible();
  });

  test("DTC try page loads", async ({ page }) => {
    await page.goto("/try");
    await expect(
      page.getByRole("heading", { name: /Personal Preview|Hair Hack/i }),
    ).toBeVisible();
  });
});
