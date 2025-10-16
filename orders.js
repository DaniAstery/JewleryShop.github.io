document.addEventListener("DOMContentLoaded", () => {
  const ordersTableBody = document.querySelector("#orders-table tbody");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="5">No orders found.</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer.name}</td>
      <td>${order.customer.email}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td>${new Date(order.date).toLocaleString()}</td>
    `;
    ordersTableBody.appendChild(row);
  });
});
