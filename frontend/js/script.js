const API_BASE_URL = 'http://localhost:8080/api/books'; // Ensure this matches your Spring Boot port

document.addEventListener('DOMContentLoaded', () => {
    // Check which page is loaded and call the appropriate function
    if (document.getElementById('book-list-container')) {
        fetchAllBooks();
    }
    if (document.getElementById('add-book-form')) {
        document.getElementById('add-book-form').addEventListener('submit', handleAddBook);
    }
});

async function fetchAllBooks() {
    const bookListContainer = document.getElementById('book-list-container');
    if (!bookListContainer) return;

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        bookListContainer.innerHTML = '<p style="color: red;">Failed to load books. Please check if the backend is running.</p>';
    }
}

function renderBooks(books) {
    const bookListContainer = document.getElementById('book-list-container');
    bookListContainer.innerHTML = ''; // Clear existing content

    if (books.length === 0) {
        bookListContainer.innerHTML = '<p>No books available.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
            <p><strong>Quantity:</strong> ${book.quantity}</p>
            <button onclick="deleteBook(${book.id})">Delete</button>
            `;
        bookListContainer.appendChild(bookCard);
    });
}

async function handleAddBook(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const bookData = {
        title: form.title.value,
        author: form.author.value,
        isbn: form.isbn.value,
        price: parseFloat(form.price.value),
        quantity: parseInt(form.quantity.value, 10)
    };

    const messageElement = document.getElementById('message');
    messageElement.textContent = ''; // Clear previous messages

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const newBook = await response.json();
        messageElement.textContent = `Book "${newBook.title}" added successfully!`;
        form.reset(); // Clear the form
        // Optionally, redirect to the book list page or update it
        // window.location.href = 'index.html';
    } catch (error) {
        console.error('Error adding book:', error);
        messageElement.textContent = `Error adding book: ${error.message}. Please try again.`;
        messageElement.style.color = 'red';
    }
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Book with ID ${id} deleted successfully.`);
        // Re-fetch and re-render the book list to show the updated state
        fetchAllBooks();
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        alert(`Failed to delete book: ${error.message}`);
    }
}