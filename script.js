/* ===============================
   ShopEase E-Commerce JavaScript
   Author: You
   =============================== */

/* ---------- PRODUCT DATA ---------- */
const products = [
  { id: 1, name: "Smartphone X", price: 499, category: "electronics", img: "https://via.placeholder.com/200x150?text=Smartphone" },
  { id: 2, name: "Wireless Headphones", price: 99, category: "electronics", img: "https://via.placeholder.com/200x150?text=Headphones" },
  { id: 3, name: "Men's T-Shirt", price: 25, category: "fashion", img: "https://via.placeholder.com/200x150?text=T-Shirt" },
  { id: 4, name: "Women's Dress", price: 45, category: "fashion", img: "https://via.placeholder.com/200x150?text=Dress" },
  { id: 5, name: "Running Shoes", price: 60, category: "shoes", img: "https://via.placeholder.com/200x150?text=Shoes" },
  { id: 6, name: "Laptop Pro", price: 899, category: "electronics", img: "https://via.placeholder.com/200x150?text=Laptop" }
];

/* ---------- LOAD & SAVE CART ---------- */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ---------- RENDER PRODUCTS PAGE ---------- */
if (document.getElementById("product-list")) {
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category-filter");

  function displayProducts(list) {
    productList.innerHTML = "";
    if (list.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }
    list.forEach((p) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  }

  // Initial load
  displayProducts(products);

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
  });

  // Filter by category
  categoryFilter.addEventListener("change", () => {
    const category = categoryFilter.value;
    const filtered = category === "all" ? products : products.filter((p) => p.category === category);
    displayProducts(filtered);
  });
}

/* ---------- ADD TO CART ---------- */
function addToCart(id) {
  const cart = getCart();
  const product = products.find((p) => p.id === id);
  cart.push(product);
  saveCart(cart);
  alert(`${product.name} added to cart!`);
}

/* ---------- CART PAGE ---------- */
if (document.getElementById("cart-items")) {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  const clearBtn = document.getElementById("clear-cart");

  function renderCart() {
    const cart = getCart();
    cartItemsDiv.innerHTML = "";
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      totalDiv.textContent = "Total: $0";
      return;
    }
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      cartItemsDiv.innerHTML += `
        <div class="cart-item">
          <span>${item.name} - $${item.price}</span>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    });
    totalDiv.textContent = `Total: $${total}`;
  }

  renderCart();

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });
}

/* ---------- CHECKOUT PAGE ---------- */
if (document.getElementById("checkout-form")) {
  const checkoutForm = document.getElementById("checkout-form");
  const orderTotal = document.getElementById("order-total");

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  orderTotal.textContent = `Total: $${total}`;

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Prepare order details
    const orderDetails = {
      name,
      address,
      payment,
      items: cart,
      date: new Date().toLocaleString()
    };

    // Save latest order for Thank You page
    localStorage.setItem("lastOrder", JSON.stringify(orderDetails));

    // Save to order history
    let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(orderDetails);
    localStorage.setItem("orderHistory", JSON.stringify(history));

    // Clear cart and redirect
    localStorage.removeItem("cart");
    window.location.href = "thankyou.html";
  });
}

/* ---------- THANK YOU PAGE ---------- */
if (document.getElementById("order-summary")) {
  const orderSummaryDiv = document.getElementById("order-summary");
  const messageDiv = document.getElementById("thankyou-message");

  const orderData = JSON.parse(localStorage.getItem("lastOrder"));

  if (!orderData) {
    messageDiv.textContent = "No recent order found.";
    orderSummaryDiv.innerHTML = `<p>Your order details are not available.</p>`;
  } else {
    messageDiv.textContent = `Thank you, ${orderData.name}! Your order will be shipped soon.`;

    let total = 0;
    orderData.items.forEach((item) => {
      orderSummaryDiv.innerHTML += `
        <div>
          ${item.name} — $${item.price}
        </div>
      `;
      total += item.price;
    });

    orderSummaryDiv.innerHTML += `
      <strong>Total: $${total}</strong>
      <br><br>
      <em>Payment Method: ${orderData.payment.toUpperCase()}</em>
      <br><em>Order Date: ${orderData.date}</em>
    `;

    localStorage.removeItem("lastOrder");
  }
}

/* ---------- ORDER HISTORY PAGE ---------- */
if (document.getElementById("order-history")) {
  const historyDiv = document.getElementById("order-history");
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (history.length === 0) {
    historyDiv.innerHTML = "<p>You have no previous orders yet.</p>";
  } else {
    history
      .slice()
      .reverse()
      .forEach((order, index) => {
        let total = order.items.reduce((sum, item) => sum + item.price, 0);
        let itemsList = order.items
          .map((item) => `<li>${item.name} — $${item.price}</li>`)
          .join("");

        historyDiv.innerHTML += `
          <div class="order-card">
            <h3>Order #${history.length - index}</h3>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Payment:</strong> ${order.payment.toUpperCase()}</p>
            <ul>${itemsList}</ul>
            <strong>Total: $${total}</strong>
          </div>
        `;
      });
  }
}
