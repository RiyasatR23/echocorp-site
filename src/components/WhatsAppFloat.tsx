import { MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/whatsapp';

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener"
      aria-label="Chat with Echo Corp on WhatsApp"
    >
      <MessageCircle aria-hidden="true" />
    </a>
  );
}
