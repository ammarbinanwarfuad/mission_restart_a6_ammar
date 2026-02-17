/**
 * SwiftCart - E-Commerce Application
 * Main JavaScript File
 */

// ============================================
// Application State Management
// ============================================
let productCatalog = [];
let shoppingCart = [];
let availableCategories = [];

// ============================================
// Event Initialization
// ============================================
const initializeApplication = () => {
  retrieveCartData();
  fetchProductCategories();
  fetchBestRatedItems();
  fetchProductCatalog();
  refreshCartDisplay();
};

document.addEventListener("DOMContentLoaded", initializeApplication);

// ============================================
// API Data Fetching
// ============================================
const fetchProductCatalog = async () => {
  try {
    renderLoadingState("productsContainer");
    const apiResponse = await fetch("https://fakestoreapi.com/products");
    productCatalog = await apiResponse.json();
    renderProductGrid(productCatalog);
  } catch (err) {
    console.error("Product fetch error:", err);
    renderErrorState(
      "productsContainer",
      "Failed to load products. Please try again later.",
    );
  }
};

const fetchProductCategories = async () => {
  try {
    const apiResponse = await fetch(
      "https://fakestoreapi.com/products/categories",
    );
    availableCategories = await apiResponse.json();
    renderCategoryButtons();
  } catch (err) {
    console.error("Category fetch error:", err);
  }
};

const fetchCategoryProducts = async (categoryName) => {
  try {
    renderLoadingState("productsContainer");
    const apiResponse = await fetch(
      `https://fakestoreapi.com/products/category/${categoryName}`,
    );
    const categoryItems = await apiResponse.json();
    renderProductGrid(categoryItems);
  } catch (err) {
    console.error("Category products fetch error:", err);
    renderErrorState(
      "productsContainer",
      "Failed to load products. Please try again later.",
    );
  }
};

const fetchSingleProduct = async (productId) => {
  try {
    const apiResponse = await fetch(
      `https://fakestoreapi.com/products/${productId}`,
    );
    const productData = await apiResponse.json();
    openProductDetailsModal(productData);
  } catch (err) {
    console.error("Product detail fetch error:", err);
    displayNotification("Failed to load product details", "error");
  }
};

const fetchBestRatedItems = async () => {
  try {
    const apiResponse = await fetch("https://fakestoreapi.com/products");
    const productsData = await apiResponse.json();

    const topRatedItems = productsData
      .sort((itemA, itemB) => itemB.rating.rate - itemA.rating.rate)
      .slice(0, 3);

    renderBestRatedProducts(topRatedItems);
  } catch (err) {
    console.error("Top rated products fetch error:", err);
    document.getElementById("topRatedProducts").innerHTML =
      '<p class="col-span-full text-center text-error">Failed to load top products</p>';
  }
};

// ============================================
// UI Rendering Functions
// ============================================
const renderCategoryButtons = () => {
  const filterWrapper = document.getElementById("categoryFilters");

  availableCategories.forEach((categoryItem) => {
    const categoryButton = document.createElement("button");
    categoryButton.className = "btn btn-outline btn-primary category-btn";
    categoryButton.textContent = makeFirstLetterCapital(categoryItem);
    categoryButton.setAttribute("data-category", categoryItem);
    categoryButton.onclick = (e) => applyCategoryFilter(categoryItem, e.target);
    filterWrapper.appendChild(categoryButton);
  });
};

const applyCategoryFilter = (selectedCategory, clickedButton) => {
  // Remove active class from all buttons
  document.querySelectorAll(".category-btn").forEach((button) => {
    button.classList.remove("active");
  });
  
  // Add active class to the clicked button
  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  selectedCategory === "all"
    ? renderProductGrid(productCatalog)
    : fetchCategoryProducts(selectedCategory);
};

const renderProductGrid = (productList) => {
  const gridContainer = document.getElementById("productsContainer");

  if (productList.length === 0) {
    gridContainer.innerHTML =
      '<p class="col-span-full text-center text-gray-500 text-xl">No products found</p>';
    return;
  }

  gridContainer.innerHTML = productList
    .map((item) => buildProductCardHTML(item))
    .join("");
};

const renderBestRatedProducts = (productList) => {
  const topRatedContainer = document.getElementById("topRatedProducts");
  topRatedContainer.innerHTML = productList
    .map((item) => buildProductCardHTML(item))
    .join("");
};

const buildProductCardHTML = (productItem) => {
  const displayTitle =
    productItem.title.length > 50
      ? productItem.title.substring(0, 50) + "..."
      : productItem.title;

  return `
        <div class="card bg-base-100 shadow-xl product-card">
            <figure class="product-image-container">
                <img src="${productItem.image}" alt="${productItem.title}" loading="lazy" />
            </figure>
            <div class="card-body">
                <div class="badge badge-secondary category-badge">${makeFirstLetterCapital(productItem.category)}</div>
                <h3 class="card-title text-lg truncate-2-lines" title="${productItem.title}">
                    ${displayTitle}
                </h3>
                
                <div class="flex items-center justify-between my-2">
                    <span class="price-tag">$${productItem.price.toFixed(2)}</span>
                    <div class="flex items-center gap-1">
                        ${buildStarDisplay(productItem.rating.rate)}
                        <span class="text-sm text-gray-600 ml-1">(${productItem.rating.count})</span>
                    </div>
                </div>
                
                <div class="card-actions justify-between mt-4">
                    <button class="btn btn-outline btn-primary btn-sm flex-1" onclick="fetchSingleProduct(${productItem.id})">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                    <button class="btn btn-primary btn-sm flex-1" onclick="addItemToCart(${productItem.id})">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
};

const buildStarDisplay = (ratingValue) => {
  const completeStars = Math.floor(ratingValue);
  const showHalfStar = ratingValue % 1 >= 0.5;
  const blankStars = 5 - completeStars - (showHalfStar ? 1 : 0);

  let starHTML = "";

  for (let i = 0; i < completeStars; i++) {
    starHTML += '<i class="fas fa-star star filled"></i>';
  }

  if (showHalfStar) {
    starHTML += '<i class="fas fa-star-half-alt star filled"></i>';
  }

  for (let i = 0; i < blankStars; i++) {
    starHTML += '<i class="far fa-star star"></i>';
  }

  return `<div class="star-rating">${starHTML}</div>`;
};

// ============================================
// Modal Management
// ============================================
const openProductDetailsModal = (productData) => {
  const modalElement = document.getElementById("productModal");
  const contentArea = document.getElementById("modalContent");

  contentArea.innerHTML = `
        <div class="space-y-4">
            <img src="${productData.image}" alt="${productData.title}" class="modal-product-image" />
            
            <div class="badge badge-secondary category-badge">${productData.category}</div>
            
            <h3 class="text-2xl font-bold">${productData.title}</h3>
            
            <div class="flex items-center justify-between">
                <span class="price-tag">$${productData.price.toFixed(2)}</span>
                <div class="flex items-center gap-2">
                    ${buildStarDisplay(productData.rating.rate)}
                    <span class="text-sm text-gray-600">(${productData.rating.count} reviews)</span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div>
                <h4 class="font-bold text-lg mb-2">Description</h4>
                <p class="text-gray-700">${productData.description}</p>
            </div>
            
            <div class="modal-action">
                <button class="btn btn-primary flex-1" onclick="addItemToCart(${productData.id}); document.getElementById('productModal').close();">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
                <button class="btn btn-success flex-1" onclick="addItemToCart(${productData.id}); document.getElementById('productModal').close(); toggleCartPanel();">
                    <i class="fas fa-shopping-bag"></i>
                    Buy Now
                </button>
            </div>
        </div>
    `;

  modalElement.showModal();
};

// ============================================
// Shopping Cart Operations
// ============================================
const addItemToCart = (itemId) => {
  const selectedProduct = productCatalog.find((p) => p.id === itemId);

  if (!selectedProduct) {
    displayNotification("Product not found", "error");
    return;
  }

  const existingEntry = shoppingCart.find((cartItem) => cartItem.id === itemId);

  if (existingEntry) {
    existingEntry.quantity += 1;
    displayNotification("Product quantity updated in cart", "success");
  } else {
    shoppingCart.push({
      ...selectedProduct,
      quantity: 1,
    });
    displayNotification("Product added to cart", "success");
  }

  refreshCartDisplay();
  persistCartData();
};

const deleteCartItem = (itemId) => {
  shoppingCart = shoppingCart.filter((cartItem) => cartItem.id !== itemId);
  refreshCartDisplay();
  persistCartData();
  displayNotification("Product removed from cart", "info");
};

const modifyItemQuantity = (itemId, adjustment) => {
  const cartEntry = shoppingCart.find((cartItem) => cartItem.id === itemId);

  if (cartEntry) {
    cartEntry.quantity += adjustment;

    if (cartEntry.quantity <= 0) {
      deleteCartItem(itemId);
    } else {
      refreshCartDisplay();
      persistCartData();
    }
  }
};

const refreshCartDisplay = () => {
  const badgeElement = document.getElementById("cartCount");
  const itemsContainer = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  const itemCount = shoppingCart.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  badgeElement.textContent = itemCount;

  if (shoppingCart.length === 0) {
    itemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p class="text-gray-500">Your cart is empty</p>
                <p class="text-sm text-gray-400 mt-2">Add some products to get started!</p>
            </div>
        `;
  } else {
    itemsContainer.innerHTML = shoppingCart
      .map(
        (cartItem) => `
            <div class="cart-item">
                <div class="flex gap-4">
                    <img src="${cartItem.image}" alt="${cartItem.title}" class="w-20 h-20 object-contain" />
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm truncate-2-lines">${cartItem.title}</h4>
                        <p class="text-primary font-bold mt-1">$${cartItem.price.toFixed(2)}</p>
                        
                        <div class="flex items-center justify-between mt-2">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline" onclick="modifyItemQuantity(${cartItem.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <button class="btn btn-sm btn-outline no-animation">${cartItem.quantity}</button>
                                <button class="btn btn-sm btn-outline" onclick="modifyItemQuantity(${cartItem.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <button class="btn btn-sm btn-error btn-circle" onclick="deleteCartItem(${cartItem.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  const grandTotal = shoppingCart.reduce(
    (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
    0,
  );
  totalElement.textContent = `$${grandTotal.toFixed(2)}`;
};

const toggleCartPanel = () => {
  const panelElement = document.getElementById("cartSidebar");
  const overlayElement = document.getElementById("cartOverlay");

  panelElement.classList.toggle("open");
  overlayElement.classList.toggle("hidden");

  document.body.style.overflow = panelElement.classList.contains("open")
    ? "hidden"
    : "auto";
};

const emptyCart = () => {
  if (shoppingCart.length === 0) {
    displayNotification("Cart is already empty", "info");
    return;
  }

  if (confirm("Are you sure you want to clear the cart?")) {
    shoppingCart = [];
    refreshCartDisplay();
    persistCartData();
    displayNotification("Cart cleared", "info");
  }
};

const processCheckout = () => {
  if (shoppingCart.length === 0) {
    displayNotification("Your cart is empty", "error");
    return;
  }

  const finalAmount = shoppingCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQuantity = shoppingCart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  alert(
    `Checkout Summary:\n\nTotal Items: ${totalQuantity}\nTotal Amount: $${finalAmount.toFixed(2)}\n\nThank you for shopping with SwiftCart!\nThis is a demo, no actual payment will be processed.`,
  );

  shoppingCart = [];
  refreshCartDisplay();
  persistCartData();
  toggleCartPanel();
  displayNotification("Order placed successfully!", "success");
};

// ============================================
// Local Storage Management
// ============================================
const persistCartData = () => {
  localStorage.setItem("swiftcart_cart", JSON.stringify(shoppingCart));
};

const retrieveCartData = () => {
  const storedData = localStorage.getItem("swiftcart_cart");
  if (storedData) {
    shoppingCart = JSON.parse(storedData);
  }
};

// ============================================
// Utility & Helper Functions
// ============================================
const renderLoadingState = (elementId) => {
  const targetElement = document.getElementById(elementId);
  targetElement.innerHTML = `
        <div class="col-span-full flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
    `;
};

const renderErrorState = (elementId, errorMessage) => {
  const targetElement = document.getElementById(elementId);
  targetElement.innerHTML = `
        <div class="col-span-full text-center py-20">
            <i class="fas fa-exclamation-triangle text-6xl text-error mb-4"></i>
            <p class="text-xl text-error">${errorMessage}</p>
        </div>
    `;
};

const displayNotification = (
  notificationText,
  notificationType = "success",
) => {
  const toastElement = document.createElement("div");
  toastElement.className = "toast";

  const iconMapping = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const colorMapping = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
  };

  toastElement.innerHTML = `
        <div class="alert ${colorMapping[notificationType]}">
            <i class="fas ${iconMapping[notificationType]}"></i>
            <span>${notificationText}</span>
        </div>
    `;

  document.body.appendChild(toastElement);

  setTimeout(() => {
    toastElement.remove();
  }, 3000);
};

const makeFirstLetterCapital = (text) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const submitNewsletterForm = (formEvent) => {
  formEvent.preventDefault();
  const emailValue = formEvent.target.querySelector(
    'input[type="email"]',
  ).value;

  displayNotification(
    `Thank you for subscribing with ${emailValue}!`,
    "success",
  );
  formEvent.target.reset();
};

// ============================================
// Smooth Scrolling Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((linkElement) => {
  linkElement.addEventListener("click", function (clickEvent) {
    const linkHref = this.getAttribute("href");
    if (linkHref !== "#" && linkHref !== "") {
      clickEvent.preventDefault();
      const targetSection = document.querySelector(linkHref);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});
