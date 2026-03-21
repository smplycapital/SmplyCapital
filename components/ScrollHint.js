export default function ScrollHint() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
    </div>
  );
}
