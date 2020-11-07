/* Global Variables */

let bookDB = [];
let skippedBooks = [];

/************************ */

async function getData() {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/books"
  ).then(async (response) => {
    let data = await response.json();
    bookDB.push(data);
    console.log("Data loaded");
  });
  populateStore();
}

function skipBook(event) {
  const target = event.target.parentNode.parentNode.parentNode.parentNode;
  skippedBooks.push(target);
  target.remove();
}

function createStoreCard(book) {
  const storeBody = document.querySelector("#books-row");

  const newBook = document.createElement("div");
  newBook.style.maxWidth = "600px";
  newBook.style.margin = "5px";
  newBook.innerHTML = `<div class="card book-card" style="max-width: 18rem;">
  <div class="card-header">
  <h4 class="book-title">${book.title}</h4>
  <p class="mb-0">${book.category}</p>
  </div>
  <div class="card-body">
  <img src="${book.img}" class="w-100" />
  <div>
    <button class="btn-addtocart my-4" onclick="addToCart(event)"><i class="fas fa-cart-plus mr-2"></i>Add to Cart</button>
    <h5 class="price-info text-center ml-3 d-inline-block">${book.price.toFixed(
      2
    )}</h5>
    <button class="btn-skip">SKIP</button>
    </div>
  </div>
</div>`;
  newBook.querySelector(".btn-skip").addEventListener("click", skipBook);
  storeBody.appendChild(newBook);
}

function populateStore() {
  bookDB[0].forEach((e) => {
    createStoreCard(e);
  });
}

function updateTotalCartPrice() {
  const shoppingCartTotal = document.querySelector("#shopping-cart-total");
  const shoppingCartItems = document.querySelectorAll(
    "#shopping-cart li .price-info"
  );

  let shoppingCartPrices = [];
  shoppingCartItems.forEach((e) => {
    shoppingCartPrices.push(parseFloat(e.innerText));
  });

  if (shoppingCartPrices.length > 1) {
    shoppingCartPrices = shoppingCartPrices.reduce((a, e) => a + e);
    shoppingCartTotal.innerHTML = `Total: <p class="total-price my-0 py-3 d-inline-block">${shoppingCartPrices.toFixed(
      2
    )}</p>`;
  }
}

function addToShoppingCartList(target) {
  const shoppingCartList = document.querySelector("#shopping-cart");
  const itemName = target.querySelector(".book-title").innerText;
  const itemPrice = target.querySelector(".price-info").innerText;
  const itemImage = target.querySelector("img");

  const newLi = document.createElement("li");
  newLi.classList.add("shopping-cart-li");
  newLi.innerHTML = `<div class="d-flex justify-content-start align-items-center">
  ${itemImage.outerHTML}<h6 class="mb-0">${itemName}</h6></div>
  <p class="price-info text-right w-100 mb-0">${itemPrice}</p>`;
  shoppingCartList.appendChild(newLi);

  updateTotalCartPrice();
}

function removeFromShoppingCartList(target) {
  const shoppingCartItems = document.querySelectorAll(".shopping-cart-li h6");
  const shoppingCartItem_Title = target.querySelector("h4").innerText;
  shoppingCartItems.forEach((e) => {
    if (e.innerText === shoppingCartItem_Title) {
      e.parentNode.remove();
    }
  });
}

function addToCart(event) {
  const target = event.target.parentNode.parentNode.parentNode.parentNode;
  const targetInfo = event.target.parentNode.parentNode;
  const addToCartButton = target.querySelector(".btn-addtocart");

  target.classList.toggle("in-cart");
  if (target.classList.contains("in-cart")) {
    addToCartButton.innerHTML = `
      <i class="fas fa-trash mr-2"></i>Remove`;
  } else {
    addToCartButton.innerHTML = `
      <i class="fas fa-cart-plus mr-2"></i>Add to Cart`;
  }

  if (target.classList.contains("in-cart")) {
    addToShoppingCartList(target);
  } else {
    removeFromShoppingCartList(target);
  }
}

function hideExcessElements() {
  const skipButtons = document.querySelectorAll(".modal-body .btn-skip");
  const addToCartButtons = document.querySelectorAll(
    ".modal-body .btn-addtocart"
  );
  const priceInfo = document.querySelectorAll(".modal-body .price-info");

  for (let i = 0; i < skipButtons.length; i++) {
    skipButtons[i].classList.add("d-none");
    addToCartButtons[i].classList.add("d-none");
    priceInfo[i].classList.add("d-none");
    priceInfo[i].classList.remove("d-inline-block");
  }
  return;
}

function viewSkippedBooks() {
  const modalBody = document.querySelector(".modal-body");
  skippedBooks.forEach((e) => {
    modalBody.innerHTML += e.innerHTML;
  });
  hideExcessElements();
}

window.onload = getData();
