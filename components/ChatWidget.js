import { useState, useRef, useEffect } from 'react';
import { RiChat3Line, RiCloseLine, RiSendPlaneFill, RiSubtractLine } from 'react-icons/ri';

const GREETING = "Hi, I'm Simply — your AI lending advisor at Simply Capital. Whether you're looking at a bridge loan, fix-and-flip, construction, DSCR, or any investment property financing, I'm here to help. What can I help you with today?";

const QUICK_QUESTIONS = [
  'What loan programs do you offer?',
  'How fast can you close?',
  'What are your rates?',
  'What credit score do I need?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  async function handleSend(text) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: updatedMessages.slice(1), // exclude initial greeting from history
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Sorry, something went wrong. Please try again or call us at (800) 555-1234.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting. Please try again or reach us at (800) 555-1234.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Closed state — floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/25 hover:scale-105 hover:shadow-gold/40 transition-all duration-200 group"
        aria-label="Open chat"
      >
        <RiChat3Line className="w-6 h-6 text-navy-900" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 bg-navy-800 border border-gold/30 rounded-lg px-4 py-3 shadow-xl hover:border-gold/50 transition-all duration-200"
        >
          <div className="w-8 h-8 bg-gold/15 rounded-full flex items-center justify-center">
            <RiChat3Line className="w-4 h-4 text-gold" />
          </div>
          <span className="text-white text-sm font-medium">Simply AI</span>
          <RiCloseLine
            className="w-4 h-4 text-white/40 hover:text-white ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsMinimized(false);
            }}
          />
        </button>
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col bg-navy-900 border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden" style={{ height: '560px', maxHeight: 'calc(100vh - 3rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-navy-800 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center">
            <span className="font-display font-bold text-gold text-sm">S</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Simply AI</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-white/40 text-[10px]">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            aria-label="Minimize"
          >
            <RiSubtractLine className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
            aria-label="Close chat"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gold/15 border border-gold/20 text-white'
                  : 'bg-navy-800 border border-white/5 text-white/80'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-navy-800 border border-white/5 px-4 py-3 rounded-xl">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions — only show if just the greeting */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-[11px] text-gold/80 border border-gold/20 rounded-full hover:bg-gold/10 hover:border-gold/40 transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10 bg-navy-800/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about loan programs, rates, process..."
            className="flex-1 bg-navy-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
            disabled={isLoading}
            maxLength={1000}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 flex items-center justify-center bg-gold rounded-lg text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold/90 transition-all duration-200"
            aria-label="Send message"
          >
            <RiSendPlaneFill className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-white/20 text-[9px]">Powered by Simply Capital AI</span>
        </div>
      </div>
    </div>
  );
}
