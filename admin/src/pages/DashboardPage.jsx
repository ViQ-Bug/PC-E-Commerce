import React from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api.js";
import {
  CircleDollarSignIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import {
  capitalizeText,
  formatCurrency,
  formatDate,
  getOrderStatusBadge,
  getStatusText,
} from "../lib/utils.js";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      name: "Tổng doanh thu",
      value: statsLoading
        ? "..."
        : formatCurrency(statsData?.totalRevenue || 0),
      icon: <CircleDollarSignIcon className="size-7 text-primary" />,
    },
    {
      name: "Tổng đơn hàng",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-7 text-primary" />,
    },
    {
      name: "Tổng khách hàng",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UsersIcon className="size-7 text-primary" />,
    },
    {
      name: "Tổng sản phẩm",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-7 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8 p-4">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-base-100 shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-xl transition"
          >
            <div>
              <p className="text-sm text-base-content/60">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* ORDERS */}
      <div className="card bg-base-100 shadow-xl rounded-xl">
        <div className="card-body">
          <h2 className="card-title text-lg">Đơn hàng gần đây</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 text-base-content/60">
              Hiện tại chưa có đơn hàng nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="text-base-content/70">
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Ngày</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover">
                      <td className="font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress?.fullName}
                          </div>
                          <div className="text-xs text-base-content/60">
                            {order.orderItems?.length} sản phẩm
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-sm">
                          {order.orderItems?.[0]?.name}
                          {order.orderItems?.length > 1 &&
                            ` +${order.orderItems.length - 1}`}
                        </div>
                      </td>

                      <td className="font-semibold text-primary">
                        {formatCurrency(order.totalPrice || 0)}
                      </td>

                      <td>
                        <span
                          className={`badge ${getOrderStatusBadge(
                            order.status,
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>

                      <td className="text-sm opacity-60">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
