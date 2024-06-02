//Brrow a book
async function BorrowBook(book) {
  // try {
    // console.log("Book added to favorites:", book._id);
    const bookId = book;

    // Make a GET request to the logout endpoint
    const response = await fetch('http://localhost:3000/api/v1/books/borrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ bookId }),
    }) .then(response => {
      if (response.ok) {
          alert('Book borrowed successfully');
          return response.json(); 
      } else if (response.status === 401) {
          // Unauthorized access, redirect to login
          window.location.href = 'login.html';
      } else if (response.status === 400) {
          alert("You have already borrowed this book");
      }else {
          throw new Error('Failed to Borrow');
      }
  }).catch(error => {
      console.error('Error during Search book:', error);

  });
}



//Wish List Load
// Function to create book items
function createFavBookItem(book) {
  // console.log(book.coverImage)

  const bookItem = document.createElement('div');
  bookItem.classList.add('wraper');

  const bookImage = document.createElement('div');
  bookImage.classList.add('cart');
  const img = document.createElement('img');
  img.src =  book.coverImage ; // Cover image might be missing
  img.alt = book.title || ''; // Title might be missing
  bookImage.appendChild(img);
  bookItem.appendChild(bookImage);

  const cartContent = document.createElement('div');
  cartContent.classList.add('cart-content');

  const bookName = document.createElement('p');
  bookName.classList.add('book-name');
  bookName.textContent = book.title || ''; // Title might be missing
  cartContent.appendChild(bookName);

  const authorWishlist = document.createElement('div');
  authorWishlist.classList.add('author-wishlist');

  const author = document.createElement('p');
  author.classList.add('author');
  author.textContent = 'By: ' + (book.author || ''); // Author might be missing
  authorWishlist.appendChild(author);

  const addToFav = document.createElement('i');
  addToFav.classList.add('fa-solid', 'fa-heart',"wish-unwish"); // Fixed typo here
  // addToFav.id = 'addToFav';


  //add to fav
  addToFav.addEventListener('click', () => {
    removeFromFav(book);
    addToFav.classList.toggle('wish-unwish');
  });

  authorWishlist.appendChild(addToFav);

  cartContent.appendChild(authorWishlist);

  const availability = document.createElement('p');
  availability.classList.add('availability');
  availability.textContent = 'Availability: ' + (book.totalCopiesAvailable || 0) + ' Pieces'; // Total copies might be missing
  cartContent.appendChild(availability);

  const borrowBook = document.createElement('div');
  borrowBook.classList.add('borrow-book');

  //Brrow Book
  borrowBook.addEventListener('click', () => {
    BorrowBook(book._id)
    borrowBook.classList.toggle('changeBg-borrow-book');
    console.log('Borrow button clicked');
  });


  const borrow = document.createElement('p');
  borrow.id = 'borrow';
  borrow.textContent = 'Borrow Book';
  borrowBook.appendChild(borrow);

  cartContent.appendChild(borrowBook);

  bookItem.appendChild(cartContent);

  return bookItem;
}

// Remove from cart
async function removeFromFav(book) {
  try {
    // console.log("Book added to favorites:", book._id);
    const bookId = book._id;

    // Make a GET request to the logout endpoint
    const response = await fetch('http://localhost:3000/api/v1/cart/removecart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ bookId }),
    });

    // Check if the response is successful
    if (response.ok) {
      window.location.href = 'wishlist.html';
      const result = response.json();
    }
    else if (response.status === 401) {
      // Unauthorized access, redirect to login
      window.location.href = 'login.html';
    }
    else {
      console.error('Remove From Fav failed:', response.statusText);
      // window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error during remove from Fav:', error);
  }
}

// Function to render books
function renderFavBooks(books, carthome) {
  const len = books.length;
  document.getElementById("wishlist-no").innerText = len;
  // if (len === 0) {
  //   console.log(len);
  // }
  // console.log(`Number of books: ${len}`);
  books.forEach(item => {
    const bookItem = createFavBookItem(item.book);
    carthome.appendChild(bookItem);
  });
}

async function allFavbook() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/cart/getcart', {
      method: 'GET',
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      const carthome = document.getElementById('wish-home');

      // console.log(data.data.items);
      renderFavBooks(data.data.items, carthome);


    }else if (response.status === 404) {
      // Unauthorized access, redirect to login
      // window.location.href = 'login.html';
      document.getElementById('message').textContent = "No books present in the wishlist.";

    }
    else {
      console.error('Failed to get all Fav book:', response.statusText);
    }
  } catch (error) {
    console.error('Error during fetching Fav book:', error);
  }
}

document.addEventListener("DOMContentLoaded", allFavbook);
//end