import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiCheckDoubleLine, RiArrowRightLine } from 'react-icons/ri';

export default function EmailGateModal({ isOpen, onClose, onSubmit, title, subtitle, dealData }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSuccess(false);
      setForm({ name: '', email: '', phone: '' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    if (onSubmit) onSubmit({ ...form, ...dealData });
    setTimeout(() => onClose(), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-navy-950/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="card-dark p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                      <RiCheckDoubleLine className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">We&apos;ll Be in Touch!</h3>
                    <p className="text-white/50 text-sm">
                      Your personalized term sheet is on its way.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="mb-6">
                      <h3 className="font-display text-xl font-bold text-white mb-2">
                        {title || 'Get Your Personalized Term Sheet'}
                      </h3>
                      <p className="text-white/40 text-sm">
                        {subtitle || 'Enter your details and we\'ll send custom loan terms within 24 hours.'}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wide">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(555) 000-0000"
                          className="input-field"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Get Term Sheet
                            <RiArrowRightLine className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-white/30 text-xs text-center">
                        No obligation. No credit pull. Response within 24 hours.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
