export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#050810",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28,
    }}>
      {/* Spinner rings + D logo */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {/* Outer spinning ring */}
        <svg style={{ position: "absolute", inset: 0, animation: "spinOuter 2s linear infinite" }}
          width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none"
            stroke="#2563EB" strokeWidth="2"
            strokeDasharray="40 185" strokeLinecap="round"/>
        </svg>
        {/* Inner counter-spinning ring */}
        <svg style={{ position: "absolute", inset: 0, animation: "spinInner 1.4s linear infinite reverse" }}
          width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="28" fill="none"
            stroke="#4338CA" strokeWidth="1.5"
            strokeDasharray="25 151" strokeLinecap="round"/>
        </svg>
        {/* Static D logo center */}
        <svg style={{ position: "absolute", inset: 0 }}
          width="80" height="80" viewBox="0 0 80 80">
          <rect width="80" height="80" rx="0" fill="transparent"/>
          <path d="M28 24 L28 56 L38 56 Q52 56 52 40 Q52 24 38 24 Z"
            fill="none" stroke="#6366F1" strokeWidth="3.5" strokeLinejoin="round"/>
          <circle cx="58" cy="30" r="4" fill="#818CF8"
            style={{ animation: "nodePulse 1.8s ease-in-out infinite 0s" }}/>
          <circle cx="58" cy="40" r="4" fill="#6366F1"
            style={{ animation: "nodePulse 1.8s ease-in-out infinite 0.3s" }}/>
          <circle cx="58" cy="50" r="4" fill="#4338CA"
            style={{ animation: "nodePulse 1.8s ease-in-out infinite 0.6s" }}/>
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ width: 180, height: 2, background: "#0F172A",
        borderRadius: 99, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #1D4ED8, #4338CA, #6366F1)",
          animation: "loadProgress 2s ease-in-out infinite",
        }}/>
      </div>

      {/* Text */}
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, color: "#334155",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>{text}</span>

      <style>{`
        @keyframes spinOuter  { to { transform: rotate(360deg);  } }
        @keyframes spinInner  { to { transform: rotate(360deg);  } }
        @keyframes nodePulse  { 0%,100%{ opacity:0.2; } 50%{ opacity:1; } }
        @keyframes loadProgress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
