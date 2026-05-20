/*
Internal implementation plan summary:
- Codebase: HyperPersona is a three-plane personalization system: FastAPI REST server, Python worker/agent pipeline, and MCP server. Events become DynamoDB jobs, Redis hot session state, OpenSearch vector memories, recommendation cache entries, and traceable agent runs.
- Product: /recommend creates verified personalized rails from customer facts, behavior embeddings, session summaries, ACE ranking, and verifier status. /recommend/complement powers pair-up/cart add-on recommendations. MCP exposes ingest_event, get_recommendation, update_consent, delete_customer_data, and get_recommendation_trace.
- Traces: recommendation observability captures job_id, agent_name, step, input, output, duration_ms, timestamp, and status, then can be queried for explanation and debugging.
- Design references: apps/web/design-inspo and apps/web UI use oversized Playfair Display editorial type, Inter utility text, warm ivory/parchment grounds, charcoal-brown ink, terracotta accents, moss support tones, pill controls, hairline borders, still-life product staging, and slow opacity/transform motion.
- Landing approach: keep the root-level Vite app in landing/, but rebuild it as the same light editorial commerce system as apps/web rather than a dark generic SaaS shell. Product visuals, recommendation diagrams, MCP copy, traces, and integration snippets stay grounded in the implementation docs.
*/

import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Mail,
  MousePointer2,
  Search,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { HeroVideoDialog } from "./components/HeroVideoDialog";
import { SectionReveal } from "./components/SectionReveal";
import {
  features,
  footerLinks,
  howItWorks,
  integrationBadges,
  mcpSnippet,
  proofPoints,
  restSnippet,
  trustItems,
} from "./content";

const heroRecommendations = [
  ["view_item", "SKU_1042", "category, price, session intent"],
  ["search", "query=summer layers", "text intent plus profile memory"],
  ["add_to_cart", "cart_item", "pair-up context and affinity"],
];

const heroProof = ["REST API", "MCP Server", "Real-time signals", "Traceable decisions"];

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="icon-badge" aria-hidden>
      <Icon size={17} />
    </span>
  );
}

function Navbar() {
  return (
    <header className="site-nav" data-testid="section-Navigation" aria-label="Navigation">
      <a href="#hero" className="wordmark" aria-label="HyperPersona home">
        hyperpersona
      </a>
      <nav aria-label="Primary navigation">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#integrations">Integrations</a>
      </nav>
      <a className="nav-cta" href="#waitlist">
        Get Early Access
      </a>
    </header>
  );
}

function HeroVisual() {
  return (
    <SectionReveal className="hero-stage" delay={0.08}>
      <section className="hero-workflow" aria-label="HyperPersona recommendation workflow preview">
        <div className="workflow-topbar">
          <span>HyperPersona Cloud</span>
          <strong>live personalization</strong>
        </div>
        <div className="workflow-grid">
          <div className="workflow-panel">
            <p className="mini-label">Incoming signals</p>
            <ol className="workflow-list" aria-label="Incoming commerce events">
              {heroRecommendations.map(([event, value, context]) => (
                <li key={event}>
                  <span>{event}</span>
                  <strong>{value}</strong>
                  <em>{context}</em>
                </li>
              ))}
            </ol>
          </div>

          <div className="workflow-panel workflow-panel-featured">
            <p className="mini-label">Personalization engine</p>
            <div className="engine-core" aria-hidden>
              <Sparkles size={22} />
            </div>
            <ul className="engine-list" aria-label="Personalization engine steps">
              <li>Preference memory</li>
              <li>Real-time ranker</li>
              <li>Pair-up affinity</li>
              <li>Verifier + traces</li>
            </ul>
          </div>

          <div className="workflow-panel">
            <p className="mini-label">Storefront outputs</p>
            <div className="output-stack">
              <code>/recommend</code>
              <code>/recommend/complement</code>
              <code>trace_id: hp_run_4271</code>
            </div>
            <p className="workflow-note">Ranked results return with reasons, confidence, and observable decisions.</p>
          </div>
        </div>
        <p className="agent-line">
          <Sparkles size={16} aria-hidden />
          Decision trace ready · consent-aware · no batch lag
        </p>
      </section>
    </SectionReveal>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero section-shell" data-testid="section-Hero" aria-labelledby="hero-title">
      <SectionReveal className="hero-copy">
        <p className="eyebrow">Agentic ecommerce personalization</p>
        <h1 id="hero-title">
          <span>The personalization</span>{" "}
          <span>engine for</span>{" "}
          <span>startup stores.</span>
        </h1>
        <p className="hero-subtitle">
          HyperPersona gives e-commerce startups hyper-personalized search, browse, product page, and cart
          recommendations in real time without building an ML team.
        </p>
      </SectionReveal>
      <HeroVisual />
      <SectionReveal className="hero-actions" delay={0.12}>
        <div className="hero-button-row">
          <a className="button primary" href="#waitlist">
            Get Early Access <ArrowRight size={17} />
          </a>
          <a className="button secondary" href="#demo">
            See Demo <ArrowDown size={17} />
          </a>
        </div>
        <ul className="hero-proof-row" aria-label="Hero platform capabilities">
          {heroProof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  );
}

function VideoSection() {
  return (
    <section id="demo" className="section-shell video-section" data-testid="section-See HyperPersona in Action">
      <SectionReveal className="section-heading centered">
        <p className="eyebrow">Product demo</p>
        <h2>See HyperPersona in Action</h2>
        <p>
          A clean walkthrough from shopper signal to ranked result, verified copy, and a trace your team can inspect.
        </p>
      </SectionReveal>
      <SectionReveal delay={0.08}>
        <HeroVideoDialog videoSrc="/media/hyperpersona-design-motion.mp4" />
      </SectionReveal>
    </section>
  );
}

function TrustBar() {
  return (
    <section id="trust" className="trust-bar" data-testid="section-Built for modern e-commerce stacks">
      <p>Built for modern e-commerce stacks</p>
      <ul>
        {trustItems.map(({ icon: Icon, label }) => (
          <li key={label}>
            <Icon size={15} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-shell how-section"
      data-testid="section-How It Works"
      aria-labelledby="how-title"
    >
      <SectionReveal className="section-heading split-heading">
        <div>
          <p className="eyebrow">How It Works</p>
          <h2 id="how-title">Three moves from raw events to personal commerce.</h2>
        </div>
        <p>
          Keep the store you already ship. HyperPersona sits beside it as a recommendation, memory, consent, and
          observability layer.
        </p>
      </SectionReveal>
      <div className="step-grid">
        {howItWorks.map((step, index) => (
          <SectionReveal className="step-card" delay={index * 0.06} key={step.title}>
            <IconBadge icon={step.icon} />
            <span className="step-index">{step.eyebrow}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section
      id="features"
      className="features-section"
      data-testid="section-Core Features"
      aria-labelledby="features-title"
    >
      <div className="section-shell">
        <SectionReveal className="section-heading centered">
          <p className="eyebrow">Core Features</p>
          <h2 id="features-title">The personalization layer your store should not have to build.</h2>
        </SectionReveal>
        <div className="bento-grid">
          {features.map((feature, index) => (
            <SectionReveal
              className={`feature-card ${index === 0 || index === 3 ? "feature-card-wide" : ""}`}
              delay={(index % 3) * 0.05}
              key={feature.title}
            >
              <IconBadge icon={feature.icon} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendationDeepDive() {
  return (
    <section
      className="section-shell deep-dive"
      data-testid="section-Recommendation Types"
      aria-labelledby="types-title"
    >
      <SectionReveal className="section-heading centered">
        <p className="eyebrow">Recommendation Types</p>
        <h2 id="types-title">Two modes, one shopper memory.</h2>
      </SectionReveal>

      <div className="deep-grid">
        <SectionReveal className="mode-card">
          <div className="mode-copy">
            <span className="mode-number">Type 1</span>
            <h3>Preference-First Search Results</h3>
            <p>
              When a shopper searches, HyperPersona reranks the result set so their preferred items rise to the
              top. Not alphabetical. Not generic popularity. Their order.
            </p>
          </div>
          <div className="search-visual" aria-label="Preference-first search result diagram">
            <div className="search-box">
              <Search size={15} aria-hidden />
              <span>query="summer layers"</span>
            </div>
            {[
              ["#1", "sku_1042", "profile preference match"],
              ["#2", "sku_2088", "session intent match"],
              ["#3", "sku_3190", "price sensitivity match"],
            ].map(([rank, item, reason], index) => (
              <div className={`result-row ${index === 0 ? "active" : ""}`} key={item}>
                <b>{rank}</b>
                <span>{item}</span>
                <em>{reason}</em>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="mode-card" delay={0.08}>
          <div className="mode-copy">
            <span className="mode-number">Type 2</span>
            <h3>Pair-Up Recommendations</h3>
            <p>
              Based on views, carts, and purchases, HyperPersona recommends products that pair naturally with what
              the shopper already cares about.
            </p>
          </div>
          <div className="pair-visual" aria-label="Pair-up recommendation diagram">
            <div className="product-slab">
              <ShoppingBag size={17} aria-hidden />
              <span>Cart anchor</span>
              <strong>cart_item</strong>
            </div>
            <div className="pair-list">
              {["sku_4410", "sku_1187", "sku_7724"].map((item, index) => (
                <div key={item}>
                  <MousePointer2 size={14} aria-hidden />
                  <span>{item}</span>
                  <em>{index === 0 ? "complete the fit" : index === 1 ? "frequent bundle" : "weather affinity"}</em>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

function IntegrationSection() {
  return (
    <section
      id="integrations"
      className="section-shell integrations"
      data-testid="section-Integrations"
      aria-labelledby="integrations-title"
    >
      <SectionReveal className="integration-copy">
        <p className="eyebrow">For startup ecommerce teams</p>
        <h2 id="integrations-title">Plug Into Your Store Without Rebuilding It</h2>
        <p>
          Keep your frontend, checkout, catalog, and auth. Add a thin server-side client that streams consented
          events and asks HyperPersona for ranked rails, complements, traces, and LLM-ready explanations.
        </p>
        <ul className="badge-list" aria-label="Integration capabilities">
          {integrationBadges.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={14} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <a href="#waitlist" className="button primary">
          Start Integrating <ChevronRight size={17} />
        </a>
      </SectionReveal>

      <SectionReveal className="code-stage" delay={0.08}>
        <div className="code-tabs" aria-label="Integration examples">
          <span>REST API</span>
          <span>MCP Server</span>
          <span>Webhook-friendly</span>
        </div>
        <pre aria-label="REST integration code snippet" tabIndex={0}>
          <code>{restSnippet}</code>
        </pre>
        <pre aria-label="MCP integration code snippet" tabIndex={0}>
          <code>{mcpSnippet}</code>
        </pre>
      </SectionReveal>
    </section>
  );
}

function ProofStrip() {
  return (
    <div className="proof-strip" role="list" aria-label="Platform proof points">
      {proofPoints.map(({ icon: Icon, label }) => (
        <div key={label} role="listitem">
          <Icon size={15} aria-hidden />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function WaitlistSection() {
  const [submittedEmail, setSubmittedEmail] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!email) return;
    setSubmittedEmail(email);
    event.currentTarget.reset();
  }

  return (
    <section
      id="waitlist"
      className="waitlist"
      data-testid="section-Ready to Make Every Recommendation Count?"
      aria-labelledby="waitlist-title"
    >
      <SectionReveal className="section-shell waitlist-card">
        <p className="eyebrow">Early access</p>
        <h2 id="waitlist-title">Ready to Make Every Recommendation Count?</h2>
        <p>
          Join the first commerce teams using agentic personalization without building ranking, memory, consent,
          and observability infrastructure from scratch.
        </p>
        <form onSubmit={onSubmit} className="waitlist-form">
          <label htmlFor="waitlist-email">Work email</label>
          <div>
            <Mail size={17} aria-hidden />
            <input id="waitlist-email" name="email" type="email" placeholder="founder@store.com" required />
            <button type="submit">Get Early Access</button>
          </div>
        </form>
        {submittedEmail ? (
          <p className="form-success" role="status">
            You're on the early access list, {submittedEmail}.
          </p>
        ) : null}
        <span className="trust-line">No credit card required for early access requests.</span>
      </SectionReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" data-testid="section-Footer">
      <div>
        <a href="#hero" className="wordmark">
          hyperpersona
        </a>
        <p>Agentic recommendations for modern ecommerce.</p>
      </div>
      <nav aria-label="Footer">
        {footerLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <p>Built with love by the HyperPersona team.</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <TrustBar />
        <HowItWorks />
        <FeatureGrid />
        <RecommendationDeepDive />
        <IntegrationSection />
        <ProofStrip />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
