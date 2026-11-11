import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { CAPABILITIES, CAPABILITY_FILTERS, TECH_STACK, type CapabilityFilter } from '../data/capabilities';

function EchoChevron() {
  return (
    <svg className="cap-chevron" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <path d="M150 28 L76 100 L150 172" />
      <path d="M118 62 L84 100 L118 138" />
      <path d="M90 84 L76 100 L90 116" />
    </svg>
  );
}

function TechMarquee() {
  const row = TECH_STACK.map((tool) => (
    <li key={tool} className="cap-stack-pill">
      {tool}
    </li>
  ));

  return (
    <div className="cap-stack">
      <p className="cap-stack-label mono">Built with</p>
      <div className="cap-marquee">
        <div className="cap-marquee-inner">
          <ul className="cap-marquee-track">{row}</ul>
          <ul className="cap-marquee-track" aria-hidden="true">
            {row}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Capabilities() {
  const [filter, setFilter] = useState<CapabilityFilter>('All');

  return (
    <section className="section cap-section" id="capabilities" aria-labelledby="capabilities-heading">
      <div className="wrap">
        <div className="cap-head reveal">
          <EchoChevron />
          <span className="eyebrow cap-eyebrow">What we can do</span>
          <h2 id="capabilities-heading">Capabilities that echo across your business.</h2>
          <p className="lede">
            From the website your customers see to the automations running behind it, Echo Corp designs, builds and
            connects the systems that save you time and win you work.
          </p>
        </div>

        <div className="cap-filters" role="group" aria-label="Filter capabilities">
          {CAPABILITY_FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              className="cap-filter"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <ul className="cap-grid">
          {CAPABILITIES.map((capability, index) => {
            const Icon = capability.icon;
            const matches = filter === 'All' || capability.category === filter;
            return (
              <li
                key={capability.id}
                className="cap-item reveal"
                style={{ '--i': index } as CSSProperties}
                hidden={!matches}
              >
                <article className="cap-card">
                  <div className="cap-card-top">
                    <span className="cap-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="cap-cat mono">{capability.category}</span>
                  </div>
                  <h3>{capability.title}</h3>
                  <p className="cap-desc">{capability.description}</p>
                  <p className="cap-outcome">
                    <ArrowRight aria-hidden="true" />
                    <span>{capability.outcome}</span>
                  </p>
                  <ul className="cap-tools" aria-label="Tools used">
                    {capability.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>

        <TechMarquee />

        <div className="cap-cta reveal">
          <p>Not sure what you need? Tell us what's slowing you down, and we'll show you what can be automated.</p>
          <div className="cap-cta-actions">
            <a href="#contact" className="btn cap-btn-solid">
              Book a free consultation
            </a>
            <a href="#assistant" className="btn cap-btn-outline">
              Ask Echo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
