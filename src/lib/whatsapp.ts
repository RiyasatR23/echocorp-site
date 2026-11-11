export const WHATSAPP_NUMBER = '27798917746';

export const WHATSAPP_PHONE_DISPLAY = '079 891 7746';

export const DEFAULT_WHATSAPP_MESSAGE = "Hi Echo Corp, I'd like a quote for a website";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message).replace(/'/g, '%27')}`;
}
