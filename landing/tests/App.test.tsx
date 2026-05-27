import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import App from "../src/App";

const expectedSections = [
  "Navigation",
  "Hero",
  "See HyperPersona in Action",
  "How It Works",
  "Core Features",
  "Recommendation Types",
  "Integrations",
  "Ready to Make Every Recommendation Count?",
  "Footer",
];

describe("HyperPersona landing page", () => {
  test("uses the apps/web editorial commerce theme instead of a dark SaaS shell", () => {
    const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf8");

    expect(css).toContain("--canvas: #f7f1e8");
    expect(css).toContain("--hero-canvas: #f5f2ed");
    expect(css).toContain("--surface-strong: #fffdf9");
    expect(css).toContain("--ink: #221c17");
    expect(css).toContain("--accent: #b86f4d");
    expect(css).toContain("--success: #5e6f62");
    expect(css).not.toContain("--canvas: #11100e");
    expect(css).not.toContain("linear-gradient(180deg, #11100e");
  });

  test("renders the required sections in the requested order", () => {
    render(<App />);

    const markers = expectedSections.map((name) => screen.getByTestId(`section-${name}`));
    const markerNames = Array.from(document.querySelectorAll("[data-testid^='section-']")).map((element) =>
      element.getAttribute("data-testid")?.replace("section-", ""),
    );

    expect(markers).toHaveLength(expectedSections.length);
    expect(markerNames).toEqual(expectedSections);
    for (let index = 0; index < markers.length - 1; index += 1) {
      expect(markers[index].compareDocumentPosition(markers[index + 1])).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });

  test("includes every required feature card with product-specific copy", () => {
    render(<App />);

    const featureSection = screen.getByTestId("section-Core Features");
    for (const title of [
      "Hyper-Personalised Recommendations",
      "User-Preference-First Search",
      "Pair-Up Recommendations",
      "MCP Server",
      "Traces",
      "Real-Time Learning",
    ]) {
      expect(within(featureSection).getByRole("heading", { name: title })).toBeVisible();
    }

    const signalWidget = within(featureSection).getByRole("region", {
      name: /real-time learning signal widget/i,
    });
    expect(within(signalWidget).getByText("live events")).toBeVisible();
    expect(within(signalWidget).getByText("view_item")).toBeVisible();
    expect(within(signalWidget).getByText("search")).toBeVisible();
    expect(within(signalWidget).getByText("add_to_cart")).toBeVisible();
  });

  test("exposes the hero product preview and ranking to assistive technology", () => {
    render(<App />);

    expect(screen.getByRole("img", { name: /editorial storefront product/i })).toBeVisible();

    const ranking = screen.getByRole("list", { name: /preference-first recommendation ranking/i });
    expect(within(ranking).getAllByRole("listitem")).toHaveLength(3);
    expect(within(ranking).getByText("Linen Overshirt")).toBeVisible();
  });

  test("keeps navigation links honest and removes repetitive proof copy", () => {
    render(<App />);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) continue;
      expect(document.querySelector(href)).not.toBeNull();
    }

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Anamika1608/Hyperpersona",
    );
    expect(screen.queryByText(/under 10 minutes/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("section-Built for modern e-commerce stacks")).not.toBeInTheDocument();
    expect(screen.queryByText("Built for modern e-commerce stacks")).not.toBeInTheDocument();
    expect(screen.queryByText("Product catalog")).not.toBeInTheDocument();
    expect(screen.queryByText("Storefront rails")).not.toBeInTheDocument();
    expect(screen.queryByText("REST events")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified recommendation copy")).not.toBeInTheDocument();
    expect(screen.queryByText("Facts + behavior + session memory")).not.toBeInTheDocument();
    expect(screen.queryByText(/shopify-ready/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/woocommerce-ready/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("section-Pricing")).not.toBeInTheDocument();
  });

  test("keeps the landing page copy lean around visual sections", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /see hyperpersona in action/i })).toBeVisible();
    expect(screen.queryByText(/A clean walkthrough from shopper signal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Keep the store you already ship/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Keep your frontend, checkout, catalog, and auth/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Join the first commerce teams/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No credit card required/i)).not.toBeInTheDocument();
  });

  test("opens and closes the video dialog with keyboard support", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playButton = screen.getByRole("button", { name: /play hyperpersona demo/i });

    await user.click(playButton);
    expect(screen.getByRole("dialog", { name: /hyperpersona product demo/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /close video dialog/i })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /hyperpersona product demo/i })).not.toBeInTheDocument();
    expect(playButton).toHaveFocus();
  });

  test("renders the real demo video in the preview and dialog player", async () => {
    const user = userEvent.setup();
    render(<App />);

    const demoSection = screen.getByTestId("section-See HyperPersona in Action");
    const previewVideo = within(demoSection).getByLabelText(/hyperpersona demo preview/i);
    const previewSource = previewVideo.querySelector("source");

    expect(previewSource).toHaveAttribute("src", "/media/hyperpersona-demo.mp4");
    expect(previewVideo).toHaveAttribute("preload", "metadata");
    expect(previewVideo).toHaveAttribute("playsinline");
    expect(previewVideo).not.toHaveAttribute("autoplay");
    expect(previewVideo).not.toHaveAttribute("loop");
    expect(previewVideo).not.toHaveAttribute("controls");
    expect((previewVideo as HTMLVideoElement).muted).toBe(true);

    await user.click(screen.getByRole("button", { name: /play hyperpersona demo/i }));
    const dialog = screen.getByRole("dialog", { name: /hyperpersona product demo/i });
    const dialogVideo = within(dialog).getByText(/your browser does not support the video tag/i).closest("video");

    expect(dialogVideo?.querySelector("source")).toHaveAttribute("src", "/media/hyperpersona-demo.mp4");
  });

  test("keeps keyboard focus inside the open video dialog", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /play hyperpersona demo/i }));
    const closeButton = screen.getByRole("button", { name: /close video dialog/i });
    const video = screen.getByText(/your browser does not support the video tag/i).closest("video");

    expect(video).toBeInTheDocument();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(video).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(video).toHaveFocus();
  });

  test("captures waitlist email locally without a network dependency", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/work email/i), "founder@example.com");
    await user.click(screen.getByRole("button", { name: /^get early access$/i }));

    expect(screen.getByText(/You're on the early access list/i)).toBeVisible();
  });
});
