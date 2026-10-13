function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="
        mb-6
        rounded-lg
        border
        border-red-200
        bg-red-50
        px-4
        py-3
        text-red-700
      "
    >
      {message}
    </div>
  );
}

export default ErrorAlert;
