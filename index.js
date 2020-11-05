/* Global Variables */

let bookDB = [];

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

function createStoreCard(book) {
  const storeBody = document.querySelector("#books-row");

  const newBook = document.createElement("div");
  newBook.style.maxWidth = "600px";
  newBook.style.margin = "5px";
  newBook.innerHTML = `<div class="card book-card mb-3" style="max-width: 18rem;">
  <div class="card-header">
  <h4>${book.title}</h4>
  <p class="mb-0">${book.category}</p>
  </div>
  <div class="card-body">
  <img src="${book.img}" class="w-100" />

    <button class="btn-addtocart my-4" onclick="addToCart()"><i class="fas fa-cart-plus mr-2"></i>Add to Cart</button>
  </div>
</div>`;
  storeBody.appendChild(newBook);
}

function populateStore() {
  bookDB[0].forEach((e) => {
    createStoreCard(e);
  });
}

window.onload = getData();
