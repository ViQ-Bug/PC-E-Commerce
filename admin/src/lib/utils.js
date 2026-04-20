export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const capitalizeText = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "badge-warning";
    case "shipped":
      return "badge-info";
    case "delivered":
      return "badge-success";
    default:
      return "badge-ghost";
  }
};
export const getStatusText = (status) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "Đã giao";
    case "shipped":
      return "Đang giao";
    case "pending":
      return "Chờ xử lý";
    default:
      return "Không xác định";
  }
};

export const getStockStatusBadge = (stock) => {
  if (stock === 0) return { text: "Hết hàng", class: "badge-error" };
  if (stock < 20) return { text: "Ít hàng", class: "badge-warning" };
  return { text: "Còn hàng", class: "badge-success" };
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
