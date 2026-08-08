const STATUS_BADGE = {
  PROCESSING: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },

  SHIPPED: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-400",
  },

  DELIVERED: {
    bg: "bg-green-50",
    text: "text-green-600",
    dot: "bg-green-400",
  },

  CANCELED: {
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

export default function Statusbadge({ status }) {
  const style = STATUS_BADGE[status] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
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
