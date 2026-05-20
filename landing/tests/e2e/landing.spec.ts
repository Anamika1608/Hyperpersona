import { expect, test } from "@playwright/test";

test.describe("HyperPersona landing page", () => {
  test("desktop page renders the conversion path and video dialog", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /the personalization engine for startup stores/i }),
    ).toBeVisible();
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

  test("narrow mobile keeps hero CTAs before the SaaS workflow preview", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    const hero = page.getByTestId("section-Hero");
    const primaryCta = hero.getByRole("link", { name: /^get early access$/i });
    const workflowPreview = page.getByRole("region", { name: /hyperpersona recommendation workflow preview/i });
    await expect(primaryCta).toBeVisible();
    await expect(workflowPreview).toBeVisible();
    await expect(workflowPreview.getByText("Personalization engine")).toBeVisible();
    await expect(page.getByText("Linen Overshirt")).toHaveCount(0);

    const ctaBox = await primaryCta.boundingBox();
    const box = await workflowPreview.boundingBox();
    expect(ctaBox?.y).toBeLessThan(620);
    expect(box?.y).toBeGreaterThan(ctaBox?.y ?? 0);
    expect(box?.y).toBeLessThan(760);

    const canvas = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim(),
    );
    expect(canvas).toBe("#f7f1e8");
  });

  test("tablet breakpoint keeps the SaaS hero readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);

    await expect(page.getByRole("heading", { name: /the personalization engine for startup stores/i })).toBeVisible();
    await expect(page.getByRole("region", { name: /hyperpersona recommendation workflow preview/i })).toBeVisible();
    await expect(page.getByTestId("section-Hero").getByRole("link", { name: /^get early access$/i })).toBeVisible();
  });
});
