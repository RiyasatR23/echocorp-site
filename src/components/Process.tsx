const STEPS = [
  {
    day: 'Day 1',
    title: 'Chat',
    text: 'A 20-minute call or WhatsApp chat about your business, customers and what you need.',
  },
  {
    day: 'Day 2–3',
    title: 'Preview',
    text: 'You get a working preview link to check on your phone. Changes are quick.',
  },
  {
    day: 'Day 4–6',
    title: 'Build',
    text: 'We add your content, photos, forms, payments and Google setup.',
  },
  {
    day: 'Day 7',
    title: 'Go live',
    text: 'Your site launches on your domain, and we show you how everything works.',
  },
];

export default function Process() {
  return (
    <section className="section section-surface" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">How it works</span>
          <h2 id="process-title">From first message to live site in about a week.</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step) => (
            <li className="step reveal" key={step.day}>
              <span className="step-day mono">{step.day}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
