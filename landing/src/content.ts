import {
  Activity,
  Blend,
  Boxes,
  Braces,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Eye,
  GitBranch,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PackageCheck,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
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

export type TrustItem = {
  icon: LucideIcon;
  label: string;
};

export const trustItems: TrustItem[] = [
  { icon: PackageCheck, label: "Product catalog" },
  { icon: Boxes, label: "Storefront rails" },
  { icon: Braces, label: "REST events" },
  { icon: ServerCog, label: "MCP Server" },
  { icon: Workflow, label: "Consent-aware flows" },
];

export const howItWorks: Step[] = [
  {
    icon: ServerCog,
    eyebrow: "01",
    title: "Integrate via MCP or API",
    description:
      "Send consented events through REST, or let MCP-aware agents call HyperPersona tools directly from your commerce workflow.",
  },
  {
    icon: Activity,
    eyebrow: "02",
    title: "Learn behavior in real time",
    description:
      "Page views, searches, carts, purchases, and returns become customer facts, behavior embeddings, and session summaries.",
  },
  {
    icon: Sparkles,
    eyebrow: "03",
    title: "Personalize every surface",
    description:
      "Search, browse, PDP, cart, and checkout rails return ranked products with verifier status and observable reasoning.",
  },
];

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Hyper-Personalised Recommendations",
    description:
      "Surfaces what each shopper is actually signaling right now, not the same popular products everyone else sees.",
  },
  {
    icon: Search,
    title: "User-Preference-First Search",
    description:
      "Search and browse surfaces can be reranked by consented customer facts, hot session state, and recent intent.",
  },
  {
    icon: Blend,
    title: "Pair-Up Recommendations",
    description:
      "Cart and PDP contexts use item affinity plus customer behavior to suggest natural add-ons and complete-the-look bundles.",
  },
  {
    icon: ServerCog,
    title: "MCP Server",
    description:
      "Expose ingest, recommendation, consent, erasure, and trace tools to Claude Desktop, Bedrock agents, and any MCP-aware client.",
  },
  {
    icon: Eye,
    title: "Traces",
    description:
      "Inspect every recommendation step: agent, input, output, latency, timestamp, status, verifier path, and source context.",
  },
  {
    icon: Zap,
    title: "Real-Time Learning",
    description:
      "Events flow into hot Redis state, DynamoDB jobs, vector memory, and cache-aware recommendations without nightly batch lag.",
  },
];

export const integrationBadges = [
  { icon: Braces, label: "REST" },
  { icon: ServerCog, label: "MCP" },
  { icon: DatabaseZap, label: "DynamoDB" },
  { icon: ShieldCheck, label: "Consent controls" },
  { icon: LockKeyhole, label: "JWT" },
  { icon: ChartNoAxesCombined, label: "Traces" },
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

export const proofPoints = [
  { icon: CheckCircle2, label: "Verified recommendation copy" },
  { icon: Clock3, label: "5 minute cache freshness" },
  { icon: GitBranch, label: "Traceable agent pipeline" },
  { icon: Layers3, label: "Facts + behavior + session memory" },
  { icon: MessageSquareText, label: "LLM-ready explanations" },
];
