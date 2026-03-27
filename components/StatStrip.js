import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const stats = [
  { value: 70, suffix: '+', label: 'Lending Partners', detail: 'competing for your deal' },
  { value: 20, suffix: 'M', prefix: '$', label: 'Max Deal Size', detail: 'across all programs' },
  { value: 8, suffix: '+', label: 'Loan Programs', detail: 'SBA, CRE, bridge & more' },
  { value: 0, suffix: '', prefix: '$', label: 'Upfront Fees', detail: 'no cost to apply' },
  { value: 24, suffix: 'hrs', label: 'Term Sheet', detail: 'average turnaround' },
];

function CountUp({ target, suffix, prefix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="stat-number">
      {prefix || ''}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatStrip() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-navy-900 border-y border-white/5 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center lg:border-r border-white/10 last:border-0 px-4 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col items-center">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  inView={inView}
                />
                <div className="w-8 h-px bg-gold/50 my-3" />
                <div className="text-white font-semibold text-sm tracking-wide">{stat.label}</div>
                <div className="text-white/40 text-xs mt-1">{stat.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
