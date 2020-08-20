// Book Class: Represents a book
class Book {
  constructor(title, author, genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
}
// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td><a href = "#" class = "btn btn-danger btn-sm delete">X</a></td>
        
        `;

    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // make alert vanish
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#genre').value = '';
  }

}
// Store Class: Handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];

    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(genre) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.genre === genre) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

}

//Events: Display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Events: Add a Book
document.getElementById("book-form").addEventListener("submit", (e) => {
  // prevent actual submit
  e.preventDefault();

  // Get form values

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;


  // Validate
  if (title === '' || author === '' || genre === '') {
    UI.showAlert('Please fill in all fields', 'danger')

  } else {
    // Instatiate books
    const book = new Book(title, author, genre);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to local store
    Store.addBook(book);

    // Success alert
    UI.showAlert('Book added', 'success');

    //Clear fields
    UI.clearFields();
  }



});

//Events: Remove a  Book
document.querySelector("#book-list").addEventListener("click", (e) => {

  //remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // book removal alert
  UI.showAlert('Book removed', 'success')
});