export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const capitalizeText = (text) => {
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

export const getStockStatusBadge = (stock) => {
  if (stock === 0) return { text: "Hết hàng", color: "badge-error" };
  if (stock < 20) return { text: "Thiếu hàng", color: "badge-warning" };
  return { text: "Còn hàng", color: "badge-success" };
};

export const formateDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
