// Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI
class UI {
    // Add Book
    addBookToList(book) {
        const bookList = document.getElementById('book-list');

        // Create tr element
        const row = document.createElement('tr');
    
        //Add row inner html
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">x</a></td>
        `;
    
        // Add row to book list
        bookList.appendChild(row);
    }

    // Delete Book
    deleteBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    // Show Alert
    showAlert(msg, className) {
        const container = document.querySelector('.container');
        const bookForm = document.querySelector('#book-form');
    
        // Create DIV
        const div = document.createElement('div');
    
        // Add class name
        div.className = `alert ${className}`;
    
        // Create text node
        div.appendChild(document.createTextNode(msg));
    
        // Insert before book form
        container.insertBefore(div, bookForm);
    
        // Hide alert after 3 sec
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    // Clear Fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
        document.getElementById('title').focus();
    }
}

// Local Storage
class Store {
    // Get books
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    //Display books
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    // Add books
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Delete books
    static deleteBook(isbn) {
        const books = Store.getBooks();
        
        books.forEach(function(book, index) {
            if(isbn === book.isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Load book list when DOM Loaded
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener to add book to the list
document.getElementById('book-form').addEventListener('submit', function(e) {
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;
    
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to the list
        ui.addBookToList(book);

        // Add book to the local storage
        Store.addBook(book);

        // Show alert
        ui.showAlert('Book Added', 'success');

        // Clear Fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener to delete books
document.getElementById('book-list').addEventListener('click', function(e) {
    // Instantiate UI
    const ui = new UI();

    if(e.target.classList.contains('delete')) {
        // Delete Book
        ui.deleteBook(e.target);

        // Delete book from local storage
        Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

        // Show alert
        ui.showAlert('Book deleted', 'success');
    }

    e.preventDefault();
});