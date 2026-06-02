function ErrorMessage({
  message,
}) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-500 rounded-2xl p-4">
      {message}
    </div>
  );
}

export default ErrorMessage;