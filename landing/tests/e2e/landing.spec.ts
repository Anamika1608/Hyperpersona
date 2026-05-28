import { expect, test } from "@playwright/test";

test.describe("HyperPersona landing page", () => {
  test("desktop page renders the conversion path and video dialog", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /product rails that feel like mind reading/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contact us/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact us/i }).first()).toHaveAttribute(
      "href",
      /mailto:anamikaagg18@gmail\.com\?subject=HyperPersona%20demo%20request&body=Hi%2C%0A%0AI%20would%20love/,
    );
    await expect(page.getByRole("heading", { name: /see hyperpersona in action/i })).toBeVisible();
    await expect(page.getByText(/A clean walkthrough from shopper signal/i)).toHaveCount(0);
    await expect(page.getByText(/Built for modern e-commerce stacks/i)).toHaveCount(0);
    const previewVideo = page.getByLabel(/hyperpersona demo preview/i);
    await expect(previewVideo).toHaveAttribute("preload", "metadata");
    await expect(previewVideo).not.toHaveAttribute("autoplay");
    await expect(previewVideo).not.toHaveAttribute("loop");
    await expect.poll(() => previewVideo.evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);

    await page.getByRole("button", { name: /play hyperpersona demo/i }).click();
    const dialog = page.getByRole("dialog", { name: /hyperpersona product demo/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: /hyperpersona product demo/i })).toHaveCount(0);
    await expect(dialog.locator("video source")).toHaveAttribute("src", "/media/hyperpersona-demo.mp4");
    const dialogBox = await dialog.boundingBox();
    const videoBox = await dialog.locator("video").boundingBox();
    const expectedRatio = 3328 / 2160;

    expect(dialogBox?.width && dialogBox?.height ? dialogBox.width / dialogBox.height : 0).toBeCloseTo(
      expectedRatio,
      1,
    );
    expect(videoBox?.width && videoBox?.height ? videoBox.width / videoBox.height : 0).toBeCloseTo(
      expectedRatio,
      1,
    );
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /hyperpersona product demo/i })).toHaveCount(0);
  });

  test("mobile page has no horizontal overflow and keeps the final CTA usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);

    const contactLinks = page.getByRole("link", { name: /contact us/i });
    await expect(contactLinks).toHaveCount(3);
    await expect(contactLinks.last()).toBeVisible();
    await expect(contactLinks.last()).toHaveAttribute("href", /body=Hi%2C%0A%0AI%20would%20love/);
    await expect(page.getByLabel("Email address")).toHaveCount(0);
    await expect(page.getByText(/You're on the early access list/i)).toHaveCount(0);
  });

  test("mobile demo video preview stays inside the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const demoSection = page.getByTestId("section-See HyperPersona in Action");
    await demoSection.scrollIntoViewIfNeeded();

    const headingBox = await demoSection.getByRole("heading", { name: /see hyperpersona in action/i }).boundingBox();
    const frameBox = await demoSection.locator(".video-frame").boundingBox();
    const previewBox = await page.getByLabel(/hyperpersona demo preview/i).boundingBox();

    expect(headingBox?.x).toBeGreaterThanOrEqual(0);
    expect((headingBox?.x ?? 0) + (headingBox?.width ?? 0)).toBeLessThanOrEqual(375);
    expect(frameBox?.x).toBeGreaterThanOrEqual(0);
    expect((frameBox?.x ?? 0) + (frameBox?.width ?? 0)).toBeLessThanOrEqual(375);
    expect(previewBox?.x).toBeGreaterThanOrEqual(0);
    expect((previewBox?.x ?? 0) + (previewBox?.width ?? 0)).toBeLessThanOrEqual(375);
  });

  test("navbar Demo link scrolls to the demo section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await page.getByRole("navigation", { name: /primary navigation/i }).getByRole("link", { name: "Demo" }).click();

    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#demo");
    await expect
      .poll(() =>
        page.evaluate(() => {
          const demo = document.querySelector("#demo");
          return demo ? Math.abs(demo.getBoundingClientRect().top) : Number.POSITIVE_INFINITY;
        }),
      )
      .toBeLessThan(160);
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
      const primaryCta = hero.getByRole("link", { name: /^contact us$/i });
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

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ]) {
    test(`core features bento is balanced at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const featureSection = page.getByTestId("section-Core Features");
      await featureSection.scrollIntoViewIfNeeded();

      await expect(page.getByRole("heading", { name: /the personalization layer/i })).toBeVisible();
      const signalWidget = page.getByRole("region", { name: /real-time learning signal widget/i });
      await expect(signalWidget).toBeVisible();
      await expect(signalWidget.getByText("live events")).toBeVisible();
      await expect(signalWidget.getByText("add_to_cart")).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);

      const cards = await featureSection.locator(".feature-card").evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
          };
        }),
      );

      expect(cards).toHaveLength(6);
      for (const card of cards) {
        expect(card.height).toBeGreaterThan(viewport.width < 640 ? 220 : 260);
        expect(card.left).toBeGreaterThanOrEqual(0);
        expect(card.right).toBeLessThanOrEqual(viewport.width);
      }

      const sorted = [...cards].sort((a, b) => a.top - b.top || a.left - b.left);
      for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1];
        const current = sorted[index];
        const overlapsVertically = current.top < previous.bottom - 1;
        const overlapsHorizontally = current.left < previous.right - 1 && previous.left < current.right - 1;
        expect(overlapsVertically && overlapsHorizontally).toBe(false);
      }
    });
  }

  test("waitlist card heading stays proportional to the CTA card", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const waitlist = page.getByTestId("section-Ready to Make Every Recommendation Count?");
    await waitlist.scrollIntoViewIfNeeded();

    const cardBox = await waitlist.locator(".waitlist-card").boundingBox();
    const heading = waitlist.getByRole("heading", { name: /ready to make every recommendation count/i });
    const headingBox = await heading.boundingBox();
    const fontSize = await heading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

    expect(fontSize).toBeLessThanOrEqual(56);
    expect(headingBox?.width ?? 0).toBeLessThanOrEqual((cardBox?.width ?? 0) - 96);
  });

  test("footer byline sits below the footer links and aligns with Docs", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const footer = page.getByTestId("section-Footer");
    await footer.scrollIntoViewIfNeeded();

    const footerNavBox = await footer.getByRole("navigation", { name: "Footer" }).boundingBox();
    const bylineBox = await footer.getByText("Built with love by the HyperPersona team.").boundingBox();

    expect(bylineBox?.x ?? 0).toBeCloseTo(footerNavBox?.x ?? 0, 0);
    expect(bylineBox?.y ?? 0).toBeGreaterThan((footerNavBox?.y ?? 0) + (footerNavBox?.height ?? 0) + 4);
  });
});
