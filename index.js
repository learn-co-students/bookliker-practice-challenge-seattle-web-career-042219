document.addEventListener("DOMContentLoaded", function() {
  getBooks();
});

const booksUrl = "http://localhost:3000/books";
let viewBoolean = true;

function getBooks() {
  fetch(booksUrl)
    .then(result => result.json())
    .then(books => renderBooks(books))
    .catch(err => console.log("Error", err));
}

function renderBooks(books) {
  books.forEach(book => renderBook(book));
}

function renderBook(book) {
  let bookList = document.getElementById("list");
  let li = document.createElement("li");
  li.textContent = "Title:  " + book.title + " " + book.users.length;
  li.addEventListener("click", () => showBook(book));
  bookList.appendChild(li);
}

function showBook(book) {
  let showPanel = document.getElementById("show-panel");

  let div = document.createElement("div");
  let li = document.createElement("li");
  let pID = document.createElement("p");
  let h3 = document.createElement("h3");
  let pDesc = document.createElement("p");
  let img = document.createElement("img");
  let button = document.createElement("button");
  let ul = document.createElement("ul");
  ul.id = "usersList";

  pID.textContent = "ID: " + book.id;
  h3.textContent = "Title:" + book.title;
  pDesc.textContent = "Content: " + book.description;
  img.src = book.img_url;
  button.textContent = "Like This Book";
  button.addEventListener("click", () => addLike(book));

  showPanel.innerHTML = "";

  div.appendChild(pID);
  div.appendChild(h3);
  div.appendChild(pDesc);
  div.appendChild(img);
  for (let i = 0; i < book.users.length; i++) {
    let li = document.createElement("li");
    li.textContent = `{"id":${book.users[i].id}, "username":${
      book.users[i].username
    }}`;
    ul.appendChild(li);
  }
  div.appendChild(ul);
  div.appendChild(button);
  showPanel.appendChild(div);
}

function appendBookUsers(book) {
  let usersList = document.getElementById("usersList");
  usersList.innerHTML = "";
  for (let i = 0; i < book.users.length; i++) {
    let li = document.createElement("li");
    li.textContent = `{"id":${book.users[i].id}, "username":${
      book.users[i].username
    }}`;
    usersList.appendChild(li);
  }
}

function addLike(book) {
  let userExists = false;
  for (let i = 0; i < book.users.length; i++) {
    if (book.users[i].id === 1) {
      userExists = true;
      break;
    }
  }
  userExists
    ? book.users.pop()
    : book.users.push({ id: 1, username: "pouros" });

  fetch(booksUrl + "/" + book.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ users: book.users })
  })
    .then(response => {
      return response.json();
    })
    .then(showBook(book))
    .catch(err => console.log(err));
}
