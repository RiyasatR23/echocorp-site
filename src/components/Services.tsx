import { Globe, ShoppingBag, Bot, Workflow, Megaphone, LifeBuoy } from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: 'Websites',
    text: 'Fast, mobile-first sites with WhatsApp, quote forms and Google setup built in.',
    price: 'from R4 500',
  },
  {
    icon: ShoppingBag,
    title: 'Online stores',
    text: 'Shopify or custom stores with Yoco, PayFast or card payments and delivery options.',
    price: 'from R15 500',
  },
  {
    icon: Bot,
    title: 'Echo Assistant',
    text: 'An AI assistant trained on your business that answers customers 24/7 and sends you the leads.',
    price: 'included in Growth',
  },
  {
    icon: Workflow,
    title: 'Automation',
    text: 'Bookings, reminders, invoices and follow-ups that run themselves, so you stop chasing admin.',
    price: 'quoted per system',
  },
  {
    icon: Megaphone,
    title: 'Ads & social',
    text: 'Google, Facebook, Instagram and TikTok ads, plus boosted live broadcasts.',
    price: 'from R1 800/month',
  },
  {
    icon: LifeBuoy,
    title: 'Care plans',
    text: 'Hosting, updates, backups and small changes each month, handled for you.',
    price: 'from R299/month',
  },
];

export default function Services() {
  return (
    <section className="section section-band" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">Services</span>
          <h2 id="services-title">Everything you need to get found and get paid.</h2>
          <p className="lede">
            Start with a website. Add an online store, an AI assistant or ads when you're ready.
          </p>
        </div>
        <ul className="services-grid">
          {SERVICES.map((service) => (
            <li className="service-cell reveal" key={service.title}>
              <service.icon className="service-icon" aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-price mono">{service.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
