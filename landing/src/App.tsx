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
  MousePointer2,
  Search,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { HeroVideoDialog } from "./components/HeroVideoDialog";
import { SectionReveal } from "./components/SectionReveal";
import {
  features,
  footerLinks,
  howItWorks,
  mcpSnippet,
  restSnippet,
} from "./content";

const heroRecommendations = [
  ["01", "Linen Overshirt", "breathable fabric match", "96"],
  ["02", "Moss Travel Pant", "saved similar silhouettes", "88"],
  ["03", "Cotton Utility Tote", "pairs with current cart", "74"],
];

const contactHref =
  "mailto:anamikaagg18@gmail.com?subject=HyperPersona%20demo%20request&body=Hi%2C%0A%0AI%20would%20love%20to%20learn%20more%20about%20HyperPersona.%0A%0ACompany%3A%0AWebsite%3A%0AUse%20case%3A";

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
        <a href="#demo">Demo</a>
        <a href="#integrations">Integrations</a>
      </nav>
      <a className="nav-cta" href={contactHref} aria-label="Contact Us">
        <span>Contact</span>
        <span className="nav-cta-extra"> Us</span>
      </a>
    </header>
  );
}

function HeroVisual() {
  return (
    <SectionReveal className="hero-stage" delay={0.08}>
      <figure className="hero-product-card" aria-labelledby="hero-preview-title">
        <div className="hero-product-figure">
          <img
            src="/media/hero-product-cutout.webp"
            alt="Editorial storefront product preview for a personalized HyperPersona recommendation rail"
            width={900}
            height={785}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="hero-product-copy">
          <p className="mini-label">Live shopper</p>
          <h2 id="hero-preview-title">Comparing breathable summer layers</h2>
          <span className="status-pill">personalization on</span>
        </div>
      </figure>

      <div className="hero-signal-panel">
        <div className="panel-head">
          <span>Preference-first rank</span>
          <strong>trace ready</strong>
        </div>
        <ol className="preference-stack" aria-label="Preference-first recommendation ranking">
          {heroRecommendations.map(([rank, product, reason, score]) => (
            <li className="preference-row" key={product}>
              <span>{rank}</span>
              <div>
                <strong>{product}</strong>
                <em>{reason}</em>
              </div>
              <b>{score}%</b>
            </li>
          ))}
        </ol>
        <p className="agent-line">
          <Sparkles size={16} aria-hidden />
          Verifier passed · 24 facts checked · 18ms trace span
        </p>
      </div>
    </SectionReveal>
  );
}

function Hero() {
  return (
    <section id="hero" className="hero section-shell" data-testid="section-Hero" aria-labelledby="hero-title">
      <SectionReveal className="hero-copy">
        <p className="eyebrow">Agentic ecommerce personalization</p>
        <h1 id="hero-title">Product rails that feel like mind reading.</h1>
        <p className="hero-subtitle">
          HyperPersona gives startup commerce teams verified, real-time recommendations across search, browse,
          product pages, carts, and AI agents without building an ML platform in-house.
        </p>
      </SectionReveal>
      <HeroVisual />
      <SectionReveal className="hero-actions" delay={0.12}>
        <a className="button primary" href={contactHref}>
          Contact Us <ArrowRight size={17} />
        </a>
        <a className="button secondary" href="#demo">
          See It In Action <ArrowDown size={17} />
        </a>
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
      </SectionReveal>
      <SectionReveal delay={0.08}>
        <HeroVideoDialog videoSrc="/media/hyperpersona-demo.mp4" />
      </SectionReveal>
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
      <SectionReveal className="section-heading centered">
        <div>
          <p className="eyebrow">How It Works</p>
          <h2 id="how-title">Three moves from raw events to personal commerce.</h2>
        </div>
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

const realTimeSignals = [
  ["view_item", "Redis hot state", "18ms"],
  ["search", "Vector memory", "31ms"],
  ["add_to_cart", "Pair-up cache", "44ms"],
];

function RealTimeSignalWidget() {
  return (
    <div className="signal-widget" role="region" aria-label="Real-Time Learning signal widget">
      <div className="signal-widget-head">
        <span>
          <i aria-hidden />
          live events
        </span>
        <strong>no batch lag</strong>
      </div>
      <div className="signal-rail" aria-hidden />
      <ul className="signal-list" aria-label="Real-time event processing">
        {realTimeSignals.map(([event, destination, latency]) => (
          <li className="signal-row" key={event}>
            <code>{event}</code>
            <span>{destination}</span>
            <strong>{latency}</strong>
          </li>
        ))}
      </ul>
    </div>
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
              className={`feature-card ${index === 0 ? "feature-card-hero" : ""} ${
                index === 3 ? "feature-card-wide feature-card-technical" : ""
              } ${feature.title === "Real-Time Learning" ? "feature-card-realtime" : ""}`}
              delay={(index % 3) * 0.05}
              key={feature.title}
            >
              <div className="feature-copy">
                <IconBadge icon={feature.icon} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              {feature.title === "Real-Time Learning" ? <RealTimeSignalWidget /> : null}
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
            <p>Reranks search results into the shopper's order.</p>
          </div>
          <div className="search-visual" aria-label="Preference-first search result diagram">
            <div className="search-box">
              <Search size={15} aria-hidden />
              <span>summer layers</span>
            </div>
            {[
              ["#1", "Linen Overshirt", "breathable fabric match"],
              ["#2", "Utility Travel Pant", "saved similar silhouette"],
              ["#3", "Cotton Camp Shirt", "price sensitivity match"],
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
            <p>Pairs the current product or cart with natural add-ons.</p>
          </div>
          <div className="pair-visual" aria-label="Pair-up recommendation diagram">
            <div className="product-slab">
              <ShoppingBag size={17} aria-hidden />
              <span>Cart anchor</span>
              <strong>Highland Overshirt</strong>
            </div>
            <div className="pair-list">
              {["Moss Travel Pant", "Cotton Utility Tote", "Weatherproof Cap"].map((item, index) => (
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
        <a href={contactHref} className="button primary">
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

function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="waitlist"
      data-testid="section-Ready to Make Every Recommendation Count?"
      aria-labelledby="waitlist-title"
    >
      <SectionReveal className="section-shell waitlist-card">
        <p className="eyebrow"></p>
        <h2 id="waitlist-title">Ready to Make Every Recommendation Count?</h2>
        <a className="button primary waitlist-contact" href={contactHref}>
          Contact Us <ArrowRight size={17} />
        </a>
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
      </div>
      <div className="footer-link-stack">
        <nav aria-label="Footer">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p>Built with love by the HyperPersona team.</p>
      </div>
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
        <HowItWorks />
        <FeatureGrid />
        <RecommendationDeepDive />
        <IntegrationSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
