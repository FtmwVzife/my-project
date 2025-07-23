// آرایه محصولات
const products = [
  {
    id: 1,
    name: "رژ لب مات",
    brand: "مای",
    price: 120000,
    category: "لب",
    rating: 4.5,
    image: "images/lipstick.jpg",
    inStock: true
  },
  {
    id: 2,
    name: "سایه چشم پالت",
    brand: "لورال",
    price: 180000,
    category: "چشم",
    rating: 4.2,
    image: "images/eyeshadow.jpg",
    inStock: true
  },
  // محصولات بیشتر...
];

// متغیرهای全局
let cart = [];
let filteredProducts = [...products];

// تابع نمایش محصولات
function displayProducts() {
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = '';

  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="brand">${product.brand}</p>
      <div class="rating">
        ${renderStars(product.rating)}
        <span>(${product.rating})</span>
      </div>
      <p class="price">${product.price.toLocaleString()} تومان</p>
      <button onclick="addToCart(${product.id})">افزودن به سبد خرید</button>
      ${!product.inStock ? '<span class="out-of-stock">ناموجود</span>' : ''}
    `;
    productsContainer.appendChild(productCard);
  });
}

// تابع نمایش ستاره‌های امتیاز
function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// تابع افزودن به سبد خرید
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  
  updateCart();
  showToast(`${product.name} به سبد خرید اضافه شد`);
}

// تابع به‌روزرسانی سبد خرید
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const cartItemsContainer = document.getElementById('cart-items');
  
  // محاسبه تعداد و مبلغ کل
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice.toLocaleString();
  
  // نمایش آیتم‌های سبد خرید
  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${item.price.toLocaleString()} تومان</p>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
}

// توابع مدیریت سبد خرید
function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }
  
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showToast('محصول از سبد خرید حذف شد');
}

// تابع فیلتر محصولات
function filterProducts() {
  const categoryFilter = document.getElementById('category-filter').value;
  const priceFilter = document.getElementById('price-filter').value;
  const searchTerm = document.getElementById('search').value.toLowerCase();
  
  filteredProducts = products.filter(product => {
    // فیلتر دسته‌بندی
    if (categoryFilter && product.category !== categoryFilter) return false;
    
    // فیلتر قیمت
    if (priceFilter === 'under100' && product.price >= 100000) return false;
    if (priceFilter === '100to200' && (product.price < 100000 || product.price > 200000)) return false;
    if (priceFilter === 'over200' && product.price <= 200000) return false;
    
    // فیلتر جستجو
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
        !product.brand.toLowerCase().includes(searchTerm)) return false;
    
    return true;
  });
  
  displayProducts();
}

// تابع نمایش اعلان
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

// تابع اولیه برای بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  
  // رویدادهای فیلتر
  document.getElementById('category-filter').addEventListener('change', filterProducts);
  document.getElementById('price-filter').addEventListener('change', filterProducts);
  document.getElementById('search').addEventListener('input', filterProducts);
  
  // رویدادهای سبد خرید
  document.getElementById('cart-icon').addEventListener('click', toggleCart);
  document.getElementById('close-cart').addEventListener('click', toggleCart);
  document.getElementById('checkout-btn').addEventListener('click', checkout);
});

// توابع نمایش/پنهان کردن سبد خرید
function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('active');
}

function checkout() {
  if (cart.length === 0) {
    showToast('سبد خرید شما خالی است');
    return;
  }
  
  // در اینجا می‌توانید منطق پرداخت را اضافه کنید
  showToast('در حال انتقال به صفحه پرداخت...');
  setTimeout(() => {
    cart = [];
    updateCart();
    toggleCart();
  }, 2000);
}
