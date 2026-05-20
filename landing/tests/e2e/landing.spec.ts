import { expect, test } from "@playwright/test";

test.describe("HyperPersona landing page", () => {
  test("desktop page renders the conversion path and video dialog", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /product rails that feel like mind reading/i })).toBeVisible();
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

  test("narrow mobile keeps the editorial product preview in the first viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    const productPreview = page.locator(".hero-product-card");
    await expect(page.getByRole("img", { name: /editorial storefront product/i })).toBeVisible();
    await expect(productPreview).toBeVisible();

    const box = await productPreview.boundingBox();
    expect(box?.y).toBeLessThan(620);

    const canvas = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim(),
    );
    expect(canvas).toBe("#f7f1e8");
  });

  for (const viewport of [
    { width: 320, height: 812 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 900 },
    { width: 1280, height: 900 },
  ]) {
    test(`product-image hero is responsive at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);

      const hero = page.getByTestId("section-Hero");
      const subtitle = hero.locator(".hero-subtitle");
      const primaryCta = hero.getByRole("link", { name: /^get early access$/i });
      const productCard = page.locator(".hero-product-card");
      const productImage = page.getByRole("img", { name: /editorial storefront product/i });
      const rankingPanel = page.getByLabel("Preference-first recommendation ranking");

      await expect(primaryCta).toBeVisible();
      await expect(subtitle).toBeVisible();
      await expect(productCard).toBeVisible();
      await expect(productImage).toBeVisible();
      await expect(rankingPanel).toBeVisible();

      const viewportWidth = viewport.width;
      const subtitleBox = await subtitle.boundingBox();
      const ctaBox = await primaryCta.boundingBox();
      const cardBox = await productCard.boundingBox();
      const imageBox = await productImage.boundingBox();
      const panelBox = await rankingPanel.boundingBox();

      expect(ctaBox?.y).toBeGreaterThan((subtitleBox?.y ?? 0) + (subtitleBox?.height ?? 0) + 12);
      expect(ctaBox?.y).toBeLessThan(viewport.height * 0.9);
      expect(imageBox?.width).toBeGreaterThan(viewportWidth < 640 ? 180 : 260);
      expect(panelBox?.x).toBeGreaterThanOrEqual(0);
      expect((panelBox?.x ?? 0) + (panelBox?.width ?? 0)).toBeLessThanOrEqual(viewportWidth);

      if (viewportWidth < 980) {
        expect(panelBox?.y).toBeGreaterThan((cardBox?.y ?? 0) + (cardBox?.height ?? 0) + 8);
      }
    });
  }
});
