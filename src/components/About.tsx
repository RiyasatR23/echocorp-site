const FACTS = [
  { label: 'Founder', value: 'Riyasat Rehman' },
  { label: 'Company', value: 'Echo Corp (Pty) Ltd' },
  { label: 'Registration', value: 'CIPC 2025/787214/07' },
  { label: 'Supplier status', value: 'Registered on the CSD · 100% Black-owned' },
];

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="founder-card reveal">
          <span className="founder-mark" aria-hidden="true">
            R
          </span>
          <dl className="facts">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about-split reveal">
          <span className="eyebrow">About</span>
          <h2 id="about-title">
            An engineer's approach to your website.
          </h2>
          <div className="about-copy">
            <p>
              Echo Corp is a Johannesburg digital agency founded by Riyasat Rehman, who trained in industrial
              engineering. That background shapes how we work: we look at how your business gets and serves customers,
              find where time and money leak, then build the website and systems that fix it.
            </p>
            <p>
              You deal with the founder directly. No account managers, no runaround, and an answer within 24 hours.
            </p>
            <p>
              We work with small businesses, schools and academies, and public-sector clients through the Central
              Supplier Database.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
