/* Global Variables */

let bookDB = [];
let skippedBooks = [];
let skippedBookTitles = [];
let selectedBooks = [];
let isFiltered = false;

/************************ */

async function getData() {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/books"
  ).then(async (response) => {
    let data = await response.json();
    bookDB.push(data);
    console.log("Data loaded");
  });
  populateStore(bookDB);
}

function skipBook(event) {
  const target = event.target.parentNode.parentNode.parentNode.parentNode;
  skippedBooks.push(target);
  skippedBookTitles.push(target.querySelector(".book-title").innerText);
  target.remove();
}

function createStoreCard(book) {
  const storeBody = document.querySelector("#books-row");
  let isSkipped = false;
  skippedBookTitles.forEach((e) => {
    if (e === book.title) {
      isSkipped = true;
      console.log(book.title + " is on the skipped list");
    }
  });

  if (!isSkipped) {
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

    selectedBooks.forEach((e) => {
      const newBookTitle = newBook.querySelector(".book-title").innerText;
      const addToCartButton = newBook.querySelector(".btn-addtocart");
      if (e === newBookTitle) {
        newBook.classList.add("in-cart");
        addToCartButton.innerHTML = `
        <i class="fas fa-trash mr-2"></i>Remove`;
      }
    });

    storeBody.appendChild(newBook);
  }
}

function populateStore(array) {
  const storeBody = document.querySelector("#books-row");
  storeBody.innerHTML = "";
  if (isFiltered === false) {
    array[0].forEach((e) => {
      createStoreCard(e);
    });
  } else {
    array.forEach((e) => {
      createStoreCard(e);
    });
  }
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

function emptyCart() {
  const shoppingCart = document.querySelector("#shopping-cart");
  shoppingCart.innerHTML = "";

  const shoppingCartTotal = document.querySelector("#shopping-cart-total");
  shoppingCartTotal.innerHTML = `<p class="my-0 py-3">Total: £0.00</p>`;

  selectedBooks = [];

  const allSelectedCards = document.querySelectorAll(".in-cart");
  allSelectedCards.forEach((e) => {
    e.classList.remove("in-cart");

    const addToCartButton = e.querySelector(".btn-addtocart");
    addToCartButton.innerHTML = `
    <i class="fas fa-cart-plus mr-2"></i>Add to Cart`;
  });
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
  const addToCartButton = target.querySelector(".btn-addtocart");

  target.classList.toggle("in-cart");

  if (target.classList.contains("in-cart")) {
    addToCartButton.innerHTML = `
      <i class="fas fa-trash mr-2"></i>Remove`;
    selectedBooks.push(target.querySelector(".book-title").innerText);
  } else {
    addToCartButton.innerHTML = `
      <i class="fas fa-cart-plus mr-2"></i>Add to Cart`;
    const indexofTarget = selectedBooks.indexOf(
      `${target.querySelector(".book-title").innerText}`
    );
    selectedBooks.splice(indexofTarget, 1);
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
}

function updateSelectedItems() {}

function viewSkippedBooks() {
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";
  skippedBooks.forEach((e) => {
    modalBody.innerHTML += e.innerHTML;
  });

  hideExcessElements();
}

function filterBooks(searchInput) {
  const filteredBooksArray = bookDB.flat().filter((e) => {
    if (e.title.toLowerCase().startsWith(`${searchInput}`.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  });
  populateStore(filteredBooksArray);
}

function search(value) {
  const filterText = document.querySelector("#filter-text");

  if (value.length < 3 && isFiltered) {
    isFiltered = false;
    filterText.classList.add("d-none");
    updateSelectedItems();
    populateStore(bookDB);
  }
  if (value.length >= 3) {
    isFiltered = true;
    filterText.classList.remove("d-none");
    filterText.innerText = `Currently filtering by... "${value}"`;
    filterBooks(value);
  }
}

window.onload = getData();
