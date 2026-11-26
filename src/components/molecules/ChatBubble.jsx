export function ChatBubble({ from = "agente", children }) {
  return <div className={`bubble bubble--${from}`}>{children}</div>;
}
