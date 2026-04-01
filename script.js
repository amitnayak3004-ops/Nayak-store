console.log("JS is running");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("loggedInUser"));

// ================= USER =================

if (user && document.getElementById("userName")) {
  document.getElementById("userName").innerText = "Hi, " + user.name;
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ================= AUTH =================

function signup() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let newUser = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  window.location.href = "login.html";
}

function login() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Invalid login");
  }
}

// ================= HOME =================

if (document.getElementById("products")) {

  fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
       allProducts = data.products;
    displayProducts(allProducts);
  });

  fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(data => {
      let container = document.getElementById("categories");

      data.forEach(cat => {
        container.innerHTML += `<button onclick="filterCat('${cat}')">${cat}</button>`;
      });

      container.innerHTML += `<button onclick="displayProducts(allProducts)">All</button>`;
    });
}

function displayProducts(products) {
  let container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.thumbnail}">
        <h4>${p.title}</h4>
        <p>₹${p.price * 80}</p>
      </div>
    `;
  });
}
function filterCat(cat) {
  let filtered = allProducts.filter(p => p.category === cat);
  displayProducts(filtered);
}

// SEARCH
let search = document.getElementById("search");
if (search) {
  search.addEventListener("input", e => {
    let text = e.target.value.toLowerCase();
    let result = allProducts.filter(p =>
      p.title.toLowerCase().includes(text)
    );
    displayProducts(result);
  });
}

// ================= PRODUCT =================

function goToProduct(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product.html";
}

if (document.getElementById("productDetail")) {
  let id = localStorage.getItem("productId");

  fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("productDetail").innerHTML = `
        <img src="${p.image}">
        <h2>${p.title}</h2>
        <p>${p.description}</p>
        <h3>₹${Math.round(p.price * 80)}</h3>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
    });
}

// ================= CART =================

function addToCart(id) {

  if (!localStorage.getItem("loggedInUser")) {
    alert("Login first!");
    window.location.href = "login.html";
    return;
  }

  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  let count = document.getElementById("cart-count");
  if (count) count.innerText = cart.length;
}
updateCart();

if (document.getElementById("cartItems")) {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      let total = 0;

      cart.forEach(id => {
        let p = products.find(x => x.id == id);
        total += p.price;

        document.getElementById("cartItems").innerHTML += `
          <div class="cart-item">
            <span>${p.title}</span>
            <span>₹${Math.round(p.price * 80)}</span>
          </div>
        `;
      });

      document.getElementById("total").innerText =
        "Total: ₹" + Math.round(total * 80);
    });
}