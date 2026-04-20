import React from "react";
import { orderApi } from "../lib/api.js";
import { formatCurrency, formatDate } from "../lib/utils.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function OrdersPage() {
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const orders = ordersData?.orders || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <p className="text-base-content/70">Danh sách các đơn hàng</p>
      </div>

      {/* TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Lỗi khi tải đơn hàng
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-base-content/60">
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
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const totalQuantity = (order.orderItems || []).reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    );

                    return (
                      <tr key={order._id}>
                        {/* ID */}
                        <td>
                          <span className="font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* CUSTOMER */}
                        <td>
                          <div className="font-medium">
                            {order.shippingAddress?.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress?.address},{" "}
                            {order.shippingAddress?.city}
                          </div>
                        </td>

                        {/* PRODUCTS */}
                        <td>
                          <div className="font-medium">
                            {totalQuantity} sản phẩm
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems?.[0]?.name}
                            {order.orderItems?.length > 1 &&
                              ` + ${order.orderItems.length - 1} more`}
                          </div>
                        </td>

                        {/* PRICE */}
                        <td>{formatCurrency(order.totalPrice)}</td>

                        {/* STATUS */}
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="select select-sm"
                            disabled={
                              updateStatusMutation.isPending &&
                              updateStatusMutation.variables?.orderId ===
                                order._id
                            }
                          >
                            <option value="pending">Chờ sử lý</option>
                            <option value="shipped">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                          </select>
                        </td>

                        {/* DATE */}
                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
