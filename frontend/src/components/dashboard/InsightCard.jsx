function InsightCard({
  title,
  value,
  increase,
}) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

      <p
        className={`mt-2 text-sm font-medium ${
          increase?.startsWith("-")
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {increase}
      </p>
    </div>
  );
}

export default InsightCard;