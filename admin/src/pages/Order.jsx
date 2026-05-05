import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const statusOptions = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getOrderItem = (item) => ({
  name: item.product?.name || item.productSnapshot?.name || "Product",
  image: item.product?.image?.[0] || item.productSnapshot?.image?.[0] || "",
  quantity: item.quantity,
  size: item.size,
  price: item.price,
});

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/orders/admin`, {
        headers: { token },
      });

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Unable to load orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/orders/${orderId}/status`,
        { status },
        { headers: { token } }
      );

      if (data.success) {
        setOrders((current) =>
          current.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success("Order status updated");
      } else {
        toast.error(data.message || "Status update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage COD orders, customer details, products, and fulfillment
            status.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded border border-gray-200 bg-white p-6 text-gray-500">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-6 text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded border border-gray-200 bg-white shadow-sm"
            >
              <div className="grid gap-4 border-b border-gray-200 bg-gray-50 p-4 text-sm md:grid-cols-2 xl:grid-cols-6">
                <div>
                  <p className="text-gray-500">Order</p>
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">
                    {order.user?.name || order.shippingAddress.name}
                  </p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Placed</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod} - {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Status</label>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateStatus(order._id, event.target.value)
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const orderItem = getOrderItem(item);

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3 rounded border border-gray-100 p-3"
                      >
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-gray-50">
                          {orderItem.image && (
                            <img
                              src={orderItem.image}
                              alt={orderItem.name}
                              className="h-full w-full object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">
                            {orderItem.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {orderItem.quantity}
                            {orderItem.size ? ` | Size: ${orderItem.size}` : ""}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{orderItem.price * orderItem.quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <aside className="rounded border border-gray-100 bg-gray-50 p-4 text-sm">
                  <h2 className="font-semibold text-gray-900">
                    Delivery address
                  </h2>
                  <p className="mt-3 leading-6 text-gray-600">
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                    <br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                </aside>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
