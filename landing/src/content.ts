import {
  Activity,
  Blend,
  Eye,
  Search,
  ServerCog,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Step = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
};

export const howItWorks: Step[] = [
  {
    icon: ServerCog,
    eyebrow: "01",
    title: "Integrate via MCP or API",
    description: "Connect consented events through REST or MCP-aware agents.",
  },
  {
    icon: Activity,
    eyebrow: "02",
    title: "Learn behavior in real time",
    description: "Turn shopper actions into live preference memory.",
  },
  {
    icon: Sparkles,
    eyebrow: "03",
    title: "Personalize every surface",
    description: "Return ranked products across search, browse, PDP, and cart.",
  },
];

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Hyper-Personalised Recommendations",
    description: "Personalized rails based on current shopper intent.",
  },
  {
    icon: Search,
    title: "User-Preference-First Search",
    description: "Rerank search and browse by each shopper's preferences.",
  },
  {
    icon: Blend,
    title: "Pair-Up Recommendations",
    description: "Suggest natural add-ons from item affinity and behavior.",
  },
  {
    icon: ServerCog,
    title: "MCP Server",
    description: "Expose recommendations, consent, erasure, and traces to MCP-aware clients.",
  },
  {
    icon: Eye,
    title: "Traces",
    description: "Inspect each recommendation step, status, source, and latency.",
  },
  {
    icon: Zap,
    title: "Real-Time Learning",
    description: "Use hot session state and cache-aware memory without batch lag.",
  },
];

export const restSnippet = `await fetch("https://api.hyperpersona.dev/events", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${shopperToken}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    event_type: "add_to_cart",
    payload: {
      product_id: "linen-overshirt",
      category: "apparel",
      price: 128,
    },
    consent_scope: ["analytics", "personalization"],
  }),
});

const rec = await fetch(
  "https://api.hyperpersona.dev/recommend?context=search:linen-layering",
  { headers: { Authorization: \`Bearer \${shopperToken}\` } },
).then((res) => res.json());`;

export const mcpSnippet = `await session.call_tool("get_recommendation", {
  context: "shopper is comparing breathable summer layers",
  limit: 5,
});

await session.call_tool("get_recommendation_trace", {
  job_id: rec.job_id,
});`;

export const footerLinks = [
  { label: "Docs", href: "#integrations" },
  { label: "GitHub", href: "https://github.com/Anamika1608/Hyperpersona" },
  { label: "Demo", href: "#demo" },
];
