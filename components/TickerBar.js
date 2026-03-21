const items = [
  'Bridge Loans',
  'Fix & Flip Financing',
  'New Construction',
  'DSCR Rental Loans',
  'Multifamily Lending',
  'Ground-Up Development',
  'Close in 5–10 Days',
  '$1M – $50M+',
  'No Income Verification',
  'Asset-Based Lending',
  'Fast Approvals',
  '30+ States',
];

export default function TickerBar() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-gold overflow-hidden py-3 border-y border-gold-600">
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-navy-900 text-xs font-semibold tracking-[0.15em] uppercase px-6">
              {item}
            </span>
            <span className="text-navy-900/40 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
