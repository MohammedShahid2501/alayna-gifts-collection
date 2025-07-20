// 🛒 CART FUNCTIONS
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function addToCart(productId, productName, productPrice) {
  cart.push({ id: productId, name: productName, price: productPrice });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} added to cart!`);
}

function displayCartItems() {
  const cartContainer = document.getElementById('cartItems');
  const totalElement = document.getElementById('cartTotal');
  if (!cartContainer || !totalElement) return;

  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <p>${item.name} - ₹${item.price}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartContainer.appendChild(itemDiv);
      total += item.price;
    });
  }

  totalElement.textContent = `Total: ₹${total}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

// 👤 LOGIN/LOGOUT USER
function loginUser() {
  const username = document.getElementById('loginUsername').value;
  localStorage.setItem('loggedInUser', username);
  window.location.href = 'index.html';
}

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.reload();
}

function showUserGreeting() {
  const username = localStorage.getItem('loggedInUser');
  const greeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.getElementById('loginLink');

  if (username) {
    greeting.textContent = `Hi, ${username}`;
    logoutBtn.style.display = 'inline';
    loginLink.style.display = 'none';
  }
}

// ✅ CHECKOUT FORM SUBMISSION
function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value;
  const address = document.getElementById('customerAddress').value;
  const payment = document.getElementById('paymentMethod').value;
  const email = localStorage.getItem('loggedInUser') || 'guest@example.com';
  const phone = "0000000000"; // Placeholder — you can add phone input

  const order = {
    name,
    address,
    email,
    phone,
    payment,
    items: cart
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear cart and redirect
  localStorage.removeItem('cart');
  alert('Order placed successfully!');
  window.location.href = 'index.html';
}

// 🧑‍💼 ADMIN PANEL: DISPLAY ORDERS
function displayOrdersInAdminPanel() {
  const tableBody = document.querySelector('#ordersTable tbody');
  if (!tableBody) return;

  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  tableBody.innerHTML = '';

  if (orders.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.textContent = 'No orders found.';
    return;
  }

  orders.forEach((order, index) => {
    const row = tableBody.insertRow();

    row.insertCell().textContent = order.name;
    row.insertCell().textContent = order.address;
    row.insertCell().textContent = order.phone;
    row.insertCell().textContent = order.email;
    row.insertCell().textContent = order.payment;

    const itemsCell = row.insertCell();
    itemsCell.innerHTML = order.items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join('');

    const actionCell = row.insertCell();
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => deleteOrder(index);
    actionCell.appendChild(delBtn);
  });
}

function deleteOrder(index) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  if (confirm('Are you sure you want to delete this order?')) {
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrdersInAdminPanel();
  }
}

// 🔍 FILTER PRODUCTS BY SEARCH & CATEGORY
function filterProducts() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const categoryValue = document.getElementById("categoryFilter").value;

  const products = document.querySelectorAll("#productList .product");

  products.forEach(product => {
    const title = product.querySelector("h4").textContent.toLowerCase();
    const category = product.getAttribute("data-category");

    const matchesSearch = title.includes(searchValue);
    const matchesCategory = !categoryValue || category === categoryValue;

    if (matchesSearch && matchesCategory) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// ✅ INIT ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  showUserGreeting();
  displayCartItems();
  displayOrdersInAdminPanel();
});
