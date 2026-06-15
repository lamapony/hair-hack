import path from "node:path";
import { test, expect } from "@playwright/test";

const MOCK_PREVIEW =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test("upload, consent, generate (mocked API), slider visible", async ({
  page,
}) => {
  await page.route("**/api/generate", async (route) => {
    const body = route.request().postDataJSON() as { goal: string };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ image: MOCK_PREVIEW, goal: body.goal }),
    });
  });

  await page.goto("/");

  const fixture = path.join(__dirname, "fixtures", "sample.png");
  await page.locator('input[type="file"]').setInputFiles(fixture);

  const checkboxes = page.getByRole("checkbox");
  await expect(checkboxes).toHaveCount(4);
  for (let i = 0; i < 4; i += 1) {
    await checkboxes.nth(i).check();
  }

  await page.getByRole("button", { name: "Generate AI illustration" }).click();

  await expect(
    page.getByRole("button", { name: "Download illustration" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("img", { name: "AI illustration" })).toBeVisible();
  await expect(page.getByText("Consultation compare")).toBeVisible();
});
