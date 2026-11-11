import { Mail, MapPin, MessageCircle } from 'lucide-react';
import ContactForm from './ContactForm';
import { DEFAULT_WHATSAPP_MESSAGE, WHATSAPP_PHONE_DISPLAY, whatsappLink } from '../lib/whatsapp';

const EMAIL = 'rrehman2303@gmail.com';

export default function Contact() {
  return (
    <section className="section section-band" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <span className="eyebrow">Contact</span>
          <h2 id="contact-title">Tell us about your business.</h2>
          <p className="lede">
            WhatsApp is fastest. Fill in the form and it opens a ready-written WhatsApp message to us, or use the details
            below.
          </p>
        </div>

        <div className="contact-grid">
          <ul className="contact-tiles">
            <li className="contact-tile">
              <span className="contact-tile-icon">
                <MessageCircle aria-hidden="true" />
              </span>
              <div>
                <p className="contact-tile-label mono">WhatsApp or call</p>
                <p className="contact-tile-value">
                  <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener">
                    {WHATSAPP_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </li>
            <li className="contact-tile">
              <span className="contact-tile-icon">
                <Mail aria-hidden="true" />
              </span>
              <div>
                <p className="contact-tile-label mono">Email</p>
                <p className="contact-tile-value">
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
              </div>
            </li>
            <li className="contact-tile">
              <span className="contact-tile-icon">
                <MapPin aria-hidden="true" />
              </span>
              <div>
                <p className="contact-tile-label mono">Location</p>
                <p className="contact-tile-value">Based in Johannesburg, South Africa.</p>
              </div>
            </li>
          </ul>

          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
