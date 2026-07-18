interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div style={{ padding: 40, textAlign: "center", color: "var(--red)" }}>
    <p>{message || "משהו השתבש. נסה שוב."}</p>
    {onRetry && <button onClick={onRetry}>נסה שוב</button>}
  </div>
);

export default ErrorMessage;