const STATUS_STYLES = {
  PROCESSING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  SHIPPED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  CANCELED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}