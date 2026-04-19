import React from "react";
import { orderApi } from "../lib/api.js";
import { formatCurrency, formatDate } from "../lib/utils.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const orders = ordersData?.orders || [];

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handlesStatusChange = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
  };
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <p className="text-base-content/70">Danh sách các đơn hàng</p>
      </div>

      {/* ORDERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex justify-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">Không có đơn hàng</p>
              <p className="text-sm">
                Đơn hàng sẽ xuất hiện khi khách hàng thanh toán
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <body>
                  {orders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, items) => sum + items.quantity,
                      0,
                    );
                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="font-medium">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress.address}.
                            {order.shippingAddress.city}
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{totalQuantity}</div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 &&
                              ` + ${order.orderItems.length - 1} more`}
                          </div>
                        </td>

                        <td>
                          <span>{formatCurrency(order.totalPrice)}VND</span>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handlesStatusChange(order._id, e.target.value)
                            }
                            className="select select-sm"
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Đang chờ</option>
                            <option value="delivering">Đang giao</option>
                            <option value="delivered">Đã giao hàng</option>
                          </select>
                        </td>

                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </body>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
