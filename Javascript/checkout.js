const cartkey = "shoppingCartList";
const selector = "#cartText";
const API_URL = "https://bloodbrewstudiodb-4049.restdb.io/rest/cartlist";
const API_KEY = "6971a6103731f788873fd7ff";

function getCartList() {
  return JSON.parse(localStorage.getItem(cartkey)) || [];
}

function saveCartList(cartList) {
  localStorage.setItem(cartkey, JSON.stringify(cartList));
  updateCartCount();
  // Refresh UI on either cart or checkout page
  if (
    document.getElementById("cartList") ||
    document.getElementById("checkoutSummary")
  ) {
    displayCartItems();
  }
}

function updateCartCount() {
  const itemList = getCartList();
  const totalItems = itemList.reduce((total, item) => total + item.quantity, 0);
  const iconElement = document.querySelector(selector);
  if (iconElement) iconElement.textContent = `🛒 Cart (${totalItems})`;
}

// Adding Items to cart
function addItem(buttonElement) {
  const productData = buttonElement.closest(
    ".product-detail-main-section",
  ).dataset;
  let cartList = getCartList();
  const itemIndex = cartList.findIndex((item) => item.id === productData.id);

  if (itemIndex > -1) {
    cartList[itemIndex].quantity++;
  } else {
    cartList.push({
      id: productData.id,
      name: productData.name,
      price: parseFloat(productData.price),
      quantity: 1,
    });
  }
  saveCartList(cartList);
  buttonElement.innerHTML = "Added! ✓";
  setTimeout(() => {
    buttonElement.innerHTML = "Add to Cart &rarr;";
  }, 1500);
}

// Remove items from the cart
function removeItem(itemId) {
  saveCartList(getCartList().filter((item) => item.id !== itemId));
}

// Show the items in the cart
function displayCartItems() {
  const cartItems = getCartList();
  const listContainer =
    document.getElementById("cartList") ||
    document.getElementById("checkoutItemsList");
  const summaryContainer =
    document.getElementById("cartSummary") ||
    document.getElementById("checkoutSummary");

  if (!listContainer) return;
  if (cartItems.length === 0) {
    listContainer.innerHTML =
      '<p style="text-align: center;">Your cart is empty.</p>';
    if (summaryContainer) summaryContainer.innerHTML = "";
    return;
  }

  listContainer.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item">
            <span class="item-details">${item.quantity}x ${item.name}</span>
            <span class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeItem('${item.id}')" class="remove-button">&times;</button>
        </div>
    `,
    )
    .join("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipToggle = document.getElementById("shippingToggle");
  const isShipping = shipToggle ? shipToggle.checked : false;
  const shippingCost = isShipping ? 10.0 : 0.0;
  const gst = subtotal * 0.1;
  const finalTotal = subtotal + gst + shippingCost;

  if (summaryContainer) {
    summaryContainer.innerHTML = `
            <div class="summary-line"><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-line"><span>GST (9%):</span> <span>$${gst.toFixed(2)}</span></div>
            <div class="summary-line"><span>Shipping:</span> <span>$${shippingCost.toFixed(2)}</span></div>
            <div class="summary-line grand-total"><h3>Total: $${finalTotal.toFixed(2)}</h3></div>
        `;
  }
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  try {
    const cartItems = getCartList();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const isShipping = document.getElementById("shippingToggle").checked;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = subtotal * 0.10;
    const shippingCost = isShipping ? 10.0 : 0.0;
    const finalTotal = subtotal + gst + shippingCost;

    const orderData = { 
      "Items": cartItems,
      "CustomerName": document.getElementById('custName')?.value || "",
      "Email": document.getElementById('custEmail')?.value || "",
      "DeliveryAddress": isShipping ? (document.getElementById('address')?.value || "") : "Self-Pickup",
      "ShippingRequired": isShipping,
      "ShippingCost": "$" + shippingCost.toString(),
      "GST": "$" + gst.toString(),
      "Total": "$" + finalTotal.toString(),
      "OrderStatus": "Pending"
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY,
            "Cache-Control": "no-cache",
        },
        body: JSON.stringify(orderData),
    });

    if (response.ok) {
        alert("Order Successful!");
        saveCartList([]); 
        window.location.href = "index.html"; 
    } else {
        const errorBody = await response.json();
        console.error("RestDB Rejected the request:", errorBody);
        alert("Error: " + (errorBody.message || "Validation failed."));
    }
  } catch (error) {
    console.error("Critical Checkout Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCartItems();

  const shipToggle = document.getElementById("shippingToggle");
  if (shipToggle) {
    shipToggle.addEventListener("change", () => {
      const addrSec = document.getElementById("addressSection");
      if (addrSec)
        addrSec.style.display = shipToggle.checked ? "block" : "none";
      displayCartItems();
    });
  }
  document
    .getElementById("checkoutForm")
    ?.addEventListener("submit", handleCheckoutSubmit);
});