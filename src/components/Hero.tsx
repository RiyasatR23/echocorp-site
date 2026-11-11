import { MessageSquareText, CalendarCheck, CreditCard } from 'lucide-react';
import EchoHeroBackground from './EchoHeroBackground';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/whatsapp';

const NOTES = [
  {
    icon: MessageSquareText,
    title: 'New quote request',
    meta: 'Pest control · Roodepoort',
    time: '08:14',
  },
  {
    icon: CalendarCheck,
    title: 'Booking confirmed',
    meta: 'Sat 10:00 · Fitment bay 2',
    time: '09:02',
  },
  {
    icon: CreditCard,
    title: 'Order paid · R1 450',
    meta: 'Yoco',
    time: '09:37',
  },
];

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <EchoHeroBackground />
      <div className="hero-content">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Web agency · Johannesburg</span>
            <h1 id="hero-title">
              Websites that bring your business <span className="accent">enquiries.</span>
            </h1>
            <p className="lede">
              Echo Corp builds fast, mobile-first websites, online stores and AI assistants for South African
              businesses. Most sites go live in 7 days, with every enquiry landing straight on your WhatsApp.
            </p>
            <div className="hero-actions">
              <a className="btn btn-wa" href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener">
                WhatsApp us
              </a>
              <a className="btn btn-outline" href="#pricing">
                See prices →
              </a>
            </div>
            <ul className="hero-facts mono">
              <li>Sites from R4 500</li>
              <li>Live in about 7 days</li>
              <li>Reply within 24 hours</li>
            </ul>
          </div>

          <div className="hero-visual">
            <span className="hero-visual-label mono">What your website does</span>
            <div className="hero-cards">
              {NOTES.map((note) => (
                <div className="note-card" key={note.title}>
                  <span className="note-icon">
                    <note.icon aria-hidden="true" />
                  </span>
                  <div>
                    <p className="note-title">{note.title}</p>
                    <p className="note-meta">{note.meta}</p>
                  </div>
                  <span className="note-time mono">{note.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
