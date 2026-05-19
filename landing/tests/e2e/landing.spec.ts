import { expect, test } from "@playwright/test";

test.describe("HyperPersona landing page", () => {
  test("desktop page renders the conversion path and video dialog", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /recommendations that know what each shopper wants next/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get early access/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /see hyperpersona in action/i })).toBeVisible();

    await page.getByRole("button", { name: /play hyperpersona demo/i }).click();
    await expect(page.getByRole("dialog", { name: /hyperpersona product demo/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /hyperpersona product demo/i })).toHaveCount(0);
  });

  test("mobile page has no horizontal overflow and keeps the final CTA usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);

    await page.getByLabel("Work email").fill("mobile@example.com");
    await page.getByRole("button", { name: /^get early access$/i }).click();
    await expect(page.getByText(/You're on the early access list/i)).toBeVisible();
  });
});
