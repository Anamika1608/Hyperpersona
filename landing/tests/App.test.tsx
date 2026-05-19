import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import App from "../src/App";

const expectedSections = [
  "Navigation",
  "Hero",
  "See HyperPersona in Action",
  "Built for modern e-commerce stacks",
  "How It Works",
  "Core Features",
  "Recommendation Types",
  "Integrations",
  "Ready to Make Every Recommendation Count?",
  "Footer",
];

describe("HyperPersona landing page", () => {
  test("renders the required sections in the requested order", () => {
    render(<App />);

    const markers = expectedSections.map((name) => screen.getByTestId(`section-${name}`));
    const positions = markers.map((element) => element.compareDocumentPosition(document.body));

    expect(markers).toHaveLength(expectedSections.length);
    for (let index = 0; index < markers.length - 1; index += 1) {
      expect(markers[index].compareDocumentPosition(markers[index + 1])).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
    expect(positions.every((position) => position === Node.DOCUMENT_POSITION_CONTAINS)).toBe(false);
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
  });

  test("opens and closes the video dialog with keyboard support", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /play hyperpersona demo/i }));
    expect(screen.getByRole("dialog", { name: /hyperpersona product demo/i })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /hyperpersona product demo/i })).not.toBeInTheDocument();
  });

  test("captures waitlist email locally without a network dependency", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/work email/i), "founder@example.com");
    await user.click(screen.getByRole("button", { name: /^get early access$/i }));

    expect(screen.getByText(/You're on the early access list/i)).toBeVisible();
  });
});
