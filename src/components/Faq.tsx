import { Minus, Plus } from 'lucide-react';

const FAQS = [
  {
    question: 'How long does a website take?',
    answer:
      'Most Starter and Business sites go live in about 7 days once we have your logo, photos and details. Stores and web apps take 2–4 weeks.',
  },
  {
    question: 'Do I need to pay everything upfront?',
    answer:
      'No. We take a 50% deposit to start and the balance at launch, or you can split the build over 3 months.',
  },
  {
    question: 'What do you need from me?',
    answer:
      'Your logo if you have one, a few photos of your work, your prices or services, and contact details. We can write the copy for you.',
  },
  {
    question: 'Do I own the website?',
    answer:
      'Yes. Your domain, content and site are yours. If you ever leave, we hand everything over.',
  },
  {
    question: 'Can you fix or redo my existing website?',
    answer:
      "Yes. Send us the link and we'll tell you what's holding it back, free, and often build a concept of the new version before you decide.",
  },
  {
    question: 'Do you work outside Johannesburg?',
    answer:
      'Yes. Everything can be done online, so we work with businesses anywhere in South Africa.',
  },
];

export default function Faq() {
  return (
    <section className="section section-surface" id="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-title">Before you ask.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq) => (
            <details className="faq-item reveal" key={faq.question}>
              <summary>
                {faq.question}
                <span className="faq-icon" aria-hidden="true">
                  <Plus className="icon-plus" />
                  <Minus className="icon-minus" />
                </span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
