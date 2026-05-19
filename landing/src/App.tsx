/*
Internal implementation plan summary:
- Codebase: HyperPersona is a three-plane personalization system: FastAPI REST server, Python worker/agent pipeline, and MCP server. Events become DynamoDB jobs, Redis hot session state, OpenSearch vector memories, recommendation cache entries, and traceable agent runs.
- Product: /recommend creates verified personalized rails from customer facts, behavior embeddings, session summaries, ACE ranking, and verifier status. /recommend/complement powers pair-up/cart add-on recommendations. MCP exposes ingest_event, get_recommendation, update_consent, delete_customer_data, and get_recommendation_trace.
- Traces: recommendation observability captures job_id, agent_name, step, input, output, duration_ms, timestamp, and status, then can be queried for explanation and debugging.
- Design references: apps/web/design-inspo uses oversized Playfair-style serif headlines, Inter-like quiet UI text, warm ivory surfaces, deep brown ink, terracotta/clay accents, moss support tones, hairline borders, sparse editorial spacing, pill controls, and slow opacity/transform motion.
- Landing approach: build a standalone root-level Vite app in landing/ with dark SaaS contrast layered over the existing editorial warmth; use local diagrams and a placeholder motion asset until real product footage is available.
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

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="icon-badge" aria-hidden>
      <Icon size={18} />
    </span>
  );
}

function Navbar() {
  return (
    <header className="site-nav" data-testid="section-Navigation" aria-label="Navigation">
      <a href="#hero" className="wordmark" aria-label="HyperPersona home">
        <span className="wordmark-mark">H</span>
        <span>HyperPersona</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#integrations">Integrations</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <a className="nav-cta" href="#waitlist">
        Get Early Access
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero section-shell" data-testid="section-Hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden />
      <SectionReveal className="hero-copy">
        <p className="eyebrow">Agentic ecommerce personalization</p>
        <h1 id="hero-title">Recommendations that know what each shopper wants next.</h1>
        <p className="hero-subtitle">
          HyperPersona gives startup commerce teams verified, real-time recommendations across search, browse,
          cart, and LLM agents without hiring an ML platform team.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#waitlist">
            Get Early Access <ArrowRight size={18} />
          </a>
          <a className="button secondary" href="#demo">
            See It In Action <ArrowDown size={18} />
          </a>
        </div>
      </SectionReveal>

      <SectionReveal className="hero-product" delay={0.08}>
        <div className="signal-card signal-card-main">
          <div>
            <span className="mini-label">Live shopper</span>
            <strong>Comparing breathable summer layers</strong>
          </div>
          <span className="status-pill">personalization on</span>
        </div>
        <div className="preference-stack" aria-label="Recommendation preview">
          {[
            ["01", "Linen overshirt", "prefers breathable fabrics", "96"],
            ["02", "Moss travel pant", "saved utility silhouettes", "88"],
            ["03", "Cotton tote", "pairs with current cart", "74"],
          ].map(([rank, product, reason, score]) => (
            <div className="preference-row" key={product}>
              <span>{rank}</span>
              <div>
                <strong>{product}</strong>
                <em>{reason}</em>
              </div>
              <b>{score}%</b>
            </div>
          ))}
        </div>
        <div className="agent-line">
          <Sparkles size={17} />
          <span>Verifier passed · 24 facts checked · trace ready</span>
        </div>
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
          Watch the flow from shopper signal to ranked result, verified copy, and a trace your team can inspect.
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
            <Icon size={16} aria-hidden />
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
      <SectionReveal className="section-heading">
        <p className="eyebrow">How It Works</p>
        <h2 id="how-title">Three moves from raw events to personal commerce.</h2>
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
      className="section-shell features-section"
      data-testid="section-Core Features"
      aria-labelledby="features-title"
    >
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
              When a shopper searches, HyperPersona can rerank the result set so their preferred items rise to
              the top. Not alphabetical. Not generic popularity. Their order.
            </p>
          </div>
          <div className="search-visual" aria-label="Preference-first search result diagram">
            <div className="search-box">
              <Search size={16} />
              <span>summer layers</span>
            </div>
            {[
              ["#1", "Linen overshirt", "breathable fabric match"],
              ["#2", "Utility travel pant", "saved similar silhouette"],
              ["#3", "Cotton camp shirt", "price sensitivity match"],
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
              Based on views, carts, and purchases, HyperPersona recommends products that pair naturally with
              what the shopper already cares about.
            </p>
          </div>
          <div className="pair-visual" aria-label="Pair-up recommendation diagram">
            <div className="product-slab">
              <ShoppingBag size={18} />
              <span>Cart anchor</span>
              <strong>Highland overshirt</strong>
            </div>
            <div className="pair-list">
              {["Moss travel pant", "Cotton utility tote", "Weatherproof cap"].map((item, index) => (
                <div key={item}>
                  <MousePointer2 size={15} />
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
        <h2 id="integrations-title">Plug Into Your Store in Minutes</h2>
        <p>
          Keep your current frontend, checkout, catalog, and auth. Add a thin server-side client that streams
          events and asks HyperPersona for ranked rails, complements, traces, and LLM-ready explanations.
        </p>
        <ul className="badge-list" aria-label="Integration capabilities">
          {integrationBadges.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={15} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <a href="#waitlist" className="button primary">
          Start Integrating <ChevronRight size={18} />
        </a>
      </SectionReveal>

      <SectionReveal className="code-stage" delay={0.08}>
        <div className="code-tabs" aria-label="Integration examples">
          <span>REST API</span>
          <span>MCP Server</span>
          <span>Webhook-friendly</span>
        </div>
        <pre aria-label="REST integration code snippet">
          <code>{restSnippet}</code>
        </pre>
        <pre aria-label="MCP integration code snippet">
          <code>{mcpSnippet}</code>
        </pre>
      </SectionReveal>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Platform proof points">
      {proofPoints.map(({ icon: Icon, label }) => (
        <div key={label}>
          <Icon size={16} aria-hidden />
          <span>{label}</span>
        </div>
      ))}
    </section>
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
      className="waitlist section-shell"
      data-testid="section-Ready to Make Every Recommendation Count?"
      aria-labelledby="waitlist-title"
    >
      <SectionReveal className="waitlist-card">
        <p className="eyebrow">Early access</p>
        <h2 id="waitlist-title">Ready to Make Every Recommendation Count?</h2>
        <p>
          Join the first commerce teams using agentic personalization without building ranking, memory, consent,
          and observability infrastructure from scratch.
        </p>
        <form onSubmit={onSubmit} className="waitlist-form">
          <label htmlFor="waitlist-email">Work email</label>
          <div>
            <Mail size={18} aria-hidden />
            <input id="waitlist-email" name="email" type="email" placeholder="founder@store.com" required />
            <button type="submit">Get Early Access</button>
          </div>
        </form>
        {submittedEmail ? (
          <p className="form-success" role="status">
            You're on the early access list, {submittedEmail}.
          </p>
        ) : null}
        <span className="trust-line">No credit card required. Set up in under 10 minutes.</span>
      </SectionReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" data-testid="section-Footer">
      <div>
        <a href="#hero" className="wordmark">
          <span className="wordmark-mark">H</span>
          <span>HyperPersona</span>
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
