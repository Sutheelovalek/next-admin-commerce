import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  // Change format time to MM/DD/YYYY TT:TT(AM)
  function changeFormatTime(time) {
    function formatTime(hours, minutes) {
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}${meridiem}`;
    }
    const inputDateString = time;
    const inputDate = new Date(inputDateString);
    return `${inputDate.getMonth() + 1}/${inputDate.getDate()}/${inputDate.getFullYear()} ${formatTime(inputDate.getHours(), inputDate.getMinutes())}`;
  }

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr key={order._id}>
              <td>{(changeFormatTime(order.createdAt))}
              </td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                {order.paid? 'YES' : 'NO'}
              </td>
              <td>
                {order.name} {order.email} <br />
                {order.city} {order.postalCode} {order.country} <br/>
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map(l => (
                    <>
                    {l.price_data.product_data.name} x {l.quantity}
                    <br />
                    </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
