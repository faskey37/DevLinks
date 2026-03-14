export function Loader({ text = "Loading your links..." }: { text?: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080C14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <svg width="72" height="72" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="20" fill="#0F172A"/>
        <rect width="80" height="80" rx="20" fill="none" stroke="#4338CA" strokeWidth="1.5"/>
        <path d="M16 16 L16 64 L32 64 Q54 64 54 40 Q54 16 32 16 Z" fill="none" stroke="#6366F1" strokeWidth="4.5" strokeLinejoin="round"/>
        <circle cx="66" cy="26" r="6" fill="#818CF8" style={{ animation: "pulse 1.8s ease-in-out infinite 0s" }}/>
        <circle cx="66" cy="40" r="6" fill="#6366F1" style={{ animation: "pulse 1.8s ease-in-out infinite 0.3s" }}/>
        <circle cx="66" cy="54" r="6" fill="#4338CA" style={{ animation: "pulse 1.8s ease-in-out infinite 0.6s" }}/>
      </svg>
      <div style={{ width: 200, height: 2, background: "#1E293B", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#4338CA,#6366F1,#818CF8)", animation: "progress 2.4s ease-in-out infinite" }}/>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#475569", letterSpacing: "0.08em" }}>{text}</span>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes progress { 0%{width:0%} 80%{width:85%} 100%{width:100%} }
      `}</style>
    </div>
  );
}