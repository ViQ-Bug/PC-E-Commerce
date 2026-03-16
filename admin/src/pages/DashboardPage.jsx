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
  formateDate,
  getOrderStatusBadge,
} from "../lib/utils.js";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  console.log(ordersLoading);
  console.log(ordersData);

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
        : `${formatCurrency(statsData.totalRevenue.toFixed(2)) || 0}`,
      icon: <CircleDollarSignIcon className="size-8" />,
    },
    {
      name: "Tổng đơn hàng",
      value: statsLoading ? "..." : statsData.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-8" />,
    },
    {
      name: "Tổng khách hàng",
      value: statsLoading ? "..." : statsData.totalCustomers || 0,
      icon: <UsersIcon className="size-8" />,
    },
    {
      name: "Tổng sản phẩm",
      value: statsLoading ? "..." : statsData.totalProducts,
      icon: <PackageIcon className="size-8" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {statsCards.map((stat) => (
          <div key={stat.name} className="stat">
            <div className="stat-figure text-primary">{stat.icon}</div>
            <div className="stat-title">{stat.name}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      {/* đơn hàng hiện tại */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Đơn hàng hiện tại</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              Hiện tại chưa có đơn hàng nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table>
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
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems.length} item(s)
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          {order.orderItems[0]?.name}
                          {order.orderItems.length > 1 &&
                            ` +${order.orderItems.length - 1} more`}
                        </div>
                      </td>

                      <td>
                        <span className="font-semibold">
                          {formatCurrency(order.totalPrice.toFixed(2))}đ
                        </span>
                      </td>

                      <td>
                        <div
                          className={`badge ${getOrderStatusBadge(order.status)}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>

                      <td>
                        <span className="text-sm opacity-60">
                          {formateDate(order.createdAt)}
                        </span>
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
