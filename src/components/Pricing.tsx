import { Check } from 'lucide-react';

interface Tier {
  name: string;
  from: string;
  amount: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    from: 'from',
    amount: 'R4 500',
    description: 'For sole traders and new businesses.',
    features: ['1–5 page website', 'WhatsApp button & contact form', 'Google Business Profile setup', 'Mobile-first, basic SEO', '1 month support'],
  },
  {
    name: 'Business',
    from: 'from',
    amount: 'R8 500',
    description: 'For established businesses that want more leads.',
    features: ['Up to 10 pages, custom design', 'Quote and booking forms', 'Google Analytics & on-page SEO', 'Copywriting help', '3 months support'],
    featured: true,
  },
  {
    name: 'Growth',
    from: 'from',
    amount: 'R13 500',
    description: 'For businesses ready to automate.',
    features: ['Everything in Business', 'Echo Assistant on your site', 'Online bookings & reminders', 'Client or member portal', '3 months support'],
  },
  {
    name: 'E-commerce',
    from: 'from',
    amount: 'R15 500',
    description: 'For selling products online.',
    features: ['Shopify or custom store', 'Yoco / PayFast payments', 'Up to 50 products loaded', 'Delivery & stock setup', '3 months support'],
  },
];

const EXTRAS = [
  { title: 'Care plans', value: 'R299 · R599 · R999 / month', note: null },
  { title: 'Ads management', value: 'from R1 800 / month', note: 'Ad spend paid separately' },
  { title: 'Payment plan', value: '+10% over 3 months', note: null },
];

export default function Pricing() {
  return (
    <section className="section section-surface" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">Pricing</span>
          <h2 id="pricing-title">Clear prices. No surprises.</h2>
          <p className="lede">
            Once-off build prices. Hosting and support are optional monthly care plans. Spread any build over 3 months
            if that suits you.
          </p>
        </div>

        <ul className="tiers">
          {TIERS.map((tier) => (
            <li className={`tier reveal${tier.featured ? ' tier-featured' : ''}`} key={tier.name}>
              {tier.featured && <span className="tier-tag mono">Most chosen</span>}
              <h3>{tier.name}</h3>
              <p>{tier.description}</p>
              <p className="tier-price">
                <span className="mono">{tier.from}</span>
                <span className="tier-amount">{tier.amount}</span>
              </p>
              <ul className="tier-features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a className={`btn btn-block ${tier.featured ? 'btn-jac' : 'btn-outline'}`} href="#contact">
                Get a quote
              </a>
            </li>
          ))}
        </ul>

        <ul className="extras">
          {EXTRAS.map((extra) => (
            <li className="extra reveal" key={extra.title}>
              <span className="mono">{extra.title}</span>
              <p className="extra-value">{extra.value}</p>
              {extra.note && <p className="extra-note">{extra.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
