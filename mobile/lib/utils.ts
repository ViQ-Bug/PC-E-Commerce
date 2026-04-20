export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};
export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "#10B981";
    case "shipped":
      return "#3B82F6";
    case "pending":
      return "#F59E0B";
    default:
      return "#666";
  }
};
export const getStatusText = (status: string) => {
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
