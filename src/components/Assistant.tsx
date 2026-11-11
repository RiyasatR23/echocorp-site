import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

interface Prompt {
  id: string;
  question: string;
  answer: string;
}

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

const OPENER =
  "Hi! I'm Echo, the assistant for this fitment centre. Ask me about prices, bookings or our hours.";

const PROMPTS: Prompt[] = [
  {
    id: 'camera',
    question: 'How much is a reverse camera fitted?',
    answer:
      'A standard reverse camera with screen starts at R1 450 fitted, and most installs take about 90 minutes. Want me to check a slot for you?',
  },
  {
    id: 'saturday',
    question: 'Can I book for Saturday?',
    answer:
      "Saturday has 10:00 and 12:30 open. Send me your name, car model and number and I'll pass the booking to the team on WhatsApp.",
  },
  {
    id: 'trackers',
    question: 'Do you do trackers?',
    answer:
      "Yes, we fit vehicle trackers and alarms. I can send you a quote now if you tell me your car's make and year.",
  },
];

const CHECKLIST = [
  'Answers in English, Afrikaans, isiZulu and more',
  'Sends qualified leads to your WhatsApp or email',
  'Already running on Pro Level Coaching, Domus Davidis and Domus Luxus',
];

const REPLY_DELAY_MS = 650;

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([{ id: 'opener', from: 'bot', text: OPENER }]);
  const [usedPrompts, setUsedPrompts] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, typing]);

  const ask = (prompt: Prompt) => {
    if (typing || usedPrompts.includes(prompt.id)) return;

    setUsedPrompts((used) => [...used, prompt.id]);
    setMessages((list) => [...list, { id: `user-${prompt.id}`, from: 'user', text: prompt.question }]);
    setTyping(true);

    timerRef.current = window.setTimeout(() => {
      setMessages((list) => [...list, { id: `bot-${prompt.id}`, from: 'bot', text: prompt.answer }]);
      setTyping(false);
    }, REPLY_DELAY_MS);
  };

  return (
    <section className="section" id="assistant" aria-labelledby="assistant-title">
      <div className="wrap assistant-grid">
        <div className="reveal">
          <span className="eyebrow">Echo Assistant</span>
          <h2 id="assistant-title">
            A receptionist that never sleeps.
          </h2>
          <p className="lede">
            Echo is our AI assistant. We train it on your prices, services and hours, then put it on your website to
            answer questions and collect leads while you work.
          </p>
          <ul className="check-list">
            {CHECKLIST.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat reveal" role="region" aria-label="Sample conversation with Echo">
          <div className="chat-head">
            <p className="chat-title">Echo · Demo car audio shop</p>
            <span className="chat-status mono">● Online now</span>
          </div>
          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <p key={message.id} className={`bubble ${message.from === 'bot' ? 'bubble-bot' : 'bubble-user'}`}>
                {message.text}
              </p>
            ))}
            {typing && (
              <div className="bubble bubble-bot bubble-typing" aria-label="Echo is typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
          <div className="chat-chips">
            {PROMPTS.map((prompt) => {
              const used = usedPrompts.includes(prompt.id);
              return (
                <button
                  key={prompt.id}
                  type="button"
                  className="chip"
                  disabled={used || typing}
                  onClick={() => ask(prompt)}
                >
                  {prompt.question}
                </button>
              );
            })}
          </div>
          <p className="chat-foot mono">Sample conversation · Powered by Echo · Echo Corp</p>
        </div>
      </div>
    </section>
  );
}
