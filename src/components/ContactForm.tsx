import { useState, type FormEvent } from 'react';

const NEEDS = [
  'A new website',
  'Redo my current website',
  'An online store',
  'Echo Assistant (AI chat)',
  'Ads management',
  'Not sure yet',
];

const BUDGETS = ['R4 500 – R8 500', 'R8 500 – R15 000', 'R15 000+', 'Not sure yet'];

interface EnquiryFields {
  name: string;
  email: string;
  phone: string;
  business: string;
  message: string;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; message: string }
  | { kind: 'error' };

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState('');
  const [need, setNeed] = useState(NEEDS[0]);
  const [budget, setBudget] = useState(BUDGETS[3]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields: EnquiryFields = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      business: business.trim(),
      message: message.trim(),
    };
    if (!fields.name || !fields.email) return;

    setStatus({ kind: 'sending' });
    try {
      const response = await fetch('https://echocorp.app.n8n.cloud/webhook/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          company: fields.business,
          need,
          budget,
          message: fields.message,
          source: 'website',
        }),
      });
      const responseBody = (await response.json().catch(() => null)) as { message?: unknown } | null;
      if (!response.ok) throw new Error('Lead intake request failed');

      setStatus({
        kind: 'success',
        message:
          typeof responseBody?.message === 'string'
            ? responseBody.message
            : 'Thanks, your enquiry has been sent. We’ll be in touch soon.',
      });
    } catch {
      setStatus({ kind: 'error' });
    }
  };

  const sending = status.kind === 'sending';

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">
            Name <span>(required)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-business">Business</label>
          <input
            id="contact-business"
            name="business"
            type="text"
            autoComplete="organization"
            maxLength={160}
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-email">
            Email <span>(required)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-need">What do you need?</label>
          <select id="contact-need" name="need" value={need} onChange={(event) => setNeed(event.target.value)}>
            {NEEDS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="contact-budget">Budget</label>
          <select id="contact-budget" name="budget" value={budget} onChange={(event) => setBudget(event.target.value)}>
            {BUDGETS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-message">Anything else?</label>
        <textarea
          id="contact-message"
          name="message"
          maxLength={1000}
          placeholder="e.g. I run a pest control company in Roodepoort and need more quote requests."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-wa btn-block" disabled={sending}>
        {sending ? 'Sending…' : 'Send my enquiry'}
      </button>

      <div className="form-status" role="status" aria-live="polite">
        {status.kind === 'success' && <p>{status.message}</p>}
        {status.kind === 'error' && (
          <p className="form-error">We couldn’t send your enquiry right now. Please try again or contact us directly.</p>
        )}
      </div>
    </form>
  );
}
