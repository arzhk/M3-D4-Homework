/* Global Variables */

let bookDB = [];

/************************ */

async function getData() {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/books"
  ).then(async (response) => {
    let data = await response.json();
    bookDB.push(data);
    console.log(bookDB);
  });
}
