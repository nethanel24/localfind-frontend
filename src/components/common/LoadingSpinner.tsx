const LoadingSpinner = ({ message = "טוען..." }: { message?: string }) => (
  <div
    style={{
      padding: 40,
      textAlign: "center",
      color: "var(--color-text-secondary)",
    }}
  >
    {message}
  </div>
);

export default LoadingSpinner;