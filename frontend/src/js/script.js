let userinfo = document.querySelector(".user-logo");
let info = document.querySelector(".user-info");
let header = document.querySelector("header");
let carret = document.querySelectorAll("#carret");
let nav = document.querySelector("nav");
let heart = document.querySelectorAll(".author-wishlist i");

let xmark = document.getElementById("xmark");
document.getElementById("userInfo").addEventListener("click", showDisplay);
document.getElementById("userInfo").addEventListener("click", loadProfile);

let cDown = document.getElementById('caret-down');
let display = document.getElementById('options');

const element = document.getElementById("logoutButton");
let userName = document.getElementById("userName");
let addToFav = document.getElementById("addToFav");
let wishList = document.getElementById("wishList");
let userFimg = document.getElementById("userFimg");
let userFimg2 = document.getElementById("userFimg2");
let orders = document.getElementById("orders");





window.addEventListener("scroll", function () {
  if (window.scrollY >= 677) {
    nav.classList.remove("sticky");
    nav.classList.add("fixed");

    // console.log("fixed");
  } else {
    nav.classList.remove("fixed");
    nav.classList.add("sticky");
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY >= 70) {
    nav.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  }
  else{
    nav.style.backgroundColor = "transparent";
  }
});

let inpu = document.querySelector('.input-box');
inpu.addEventListener('click', () => {
  cDown.classList.toggle('rotate');
  display.classList.toggle('hide-unhide');
})

document.querySelectorAll('.options button').forEach(button => {
  button.addEventListener('click', function () {

    // console.log(button.value);

      const category = this.getAttribute('data-category');
    document.getElementById('selected-category').placeholder = category;
    categorySearch(category);
      display.classList.toggle('hide-unhide');
      // document.getElementById('options').style.display = 'none';
  });
});

// search by category
async function categorySearch(genre) {
  // console.log(genre);
  try {
    fetch('http://localhost:3000/api/v1/books/Searchbygenre', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ genre }),
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse JSON response
      } else {
        throw new Error('Failed to search');
      }
    })
    .then(result => {
      // console.log(result.data);
      const carthome = document.getElementById('cart-homes');

      //Render the books
      renderBooks(result.data, carthome);

      window.location.href = '#book';
    })
    .catch(error => {
      console.error('Error during Search book:', error);

    });
    
  } catch (error) {
    console.error('Error during fetching book:', error);
  }
}

function showDisplay() {
  info.style.transform = "translate(0%)";
  document.body.classList.add("no-scroll");
}

xmark.addEventListener("click", hideDisplay)

function hideDisplay() {
  info.style.transform = "translate(100%)";
  document.body.classList.remove("no-scroll");
}

carret.forEach((item) => {
  item.addEventListener("click", () => {
    item.nextElementSibling.classList.toggle("hide");
    item.classList.toggle("rotate");
  });
});

heart.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("wish-unwish");
    // console.log("clicked");
  });
});

//LoadProfile
async function loadProfile() {
  try {
    // Make a GET request to the profile endpoint
    const response = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'GET',
      credentials: "include"
    });

    if (response.ok) {
      // If the response is successful, parse JSON response
      const result = await response.json();
      // console.log(result);

      // Ensure userName element exists in the DOM
      const userNameElement = document.getElementById('userName');

      userNameElement.innerText = result.data.userName;


      if (result.data.avatar) {
        userFimg2.style.display = "none";
        userFimg.style.display = "block";
        userFimg.src = "../../../src/public/temp/" + result.data.avatar;
        //   // console.log(result);
      }
    } else if (response.status === 401) {
      // Unauthorized access, redirect to login
      window.location.href = 'login.html';
    } else {
      // Handle other errors
      console.error('Failed to get profile:', response.statusText);
      // window.location.href = 'login.html';
    }
  } catch (error) {
    // If an error occurs during fetching, log the error
    console.error('Error during fetching profile:', error);
  }
}


//Logout
element.addEventListener("click", async () => {
  // console.log("Logout button clicked");
  try {

    // Make a GET request to the logout endpoint
    const response = await fetch('http://localhost:3000/api/v1/users/logout', {
      method: 'DELETE',
      credentials: "include" // This ensures cookies are sent with the request
    });

    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // "Logged out successfully"



      // Optionally, redirect to the login page or home page
      window.location.href = 'index.html';
    } else {
      console.error('Logout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
});

//search
let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", async () => {
  const title = document.getElementById('searchValue').value;

  fetch('http://localhost:3000/api/v1/books/Search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse JSON response
      } else {
        throw new Error('Failed to search');
      }
    })
    .then(result => {
      // console.log(result.data);
      const carthome = document.getElementById('cart-homes');

      //Render the books
      renderBooks(result.data, carthome);

      window.location.href = '#book';
    })
    .catch(error => {
      console.error('Error during Search book:', error);

    });
});







// event.preventDefault();

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



//final
// Function to create book items
function createBookItem(book) {
  // console.log(book.coverImage)

  const bookItem = document.createElement('div');
  bookItem.classList.add('wraper');

  //getOneBook
  bookItem.addEventListener('click', () => {
    bookItem.addEventListener('click', () => {
      window.location.href = `book-full-screen.html?bookId=${book._id}`;
    });
  });

  const bookImage = document.createElement('div');
  bookImage.classList.add('cart');
  const img = document.createElement('img');
  img.src = book.coverImage;


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
  addToFav.classList.add('fa-regular', 'fa-heart'); // Fixed typo here
  // addToFav.id = 'addToFav';


  //add to fav
  addToFav.addEventListener('click', () => {
    addTofav(book);
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
    // Display a confirmation message
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

// Function to render books
function renderBooks(books, carthome) {
  carthome.innerHTML = '';
  books.forEach(book => {
    const bookItem = createBookItem(book);
    carthome.appendChild(bookItem);
  });
}

// Add TO cart
async function addTofav(book) {
  try {
    // console.log("Book added to favorites:", book._id);
    const bookId = book._id;

    // Make a GET request to the logout endpoint
    const response = await fetch('http://localhost:3000/api/v1/cart/addcart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ bookId }),
    });

    // Check if the response is successful
    if (response.ok) {
      const result = response.json();
    } else if (response.status === 401) {
      // Unauthorized access, redirect to login
      window.location.href = 'login.html';
    }
    else {
      console.error('AddToFav failed:', response.statusText);
      // window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error during AddToFav:', error);
  }
}


async function allbook() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/books', {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      const carthome = document.getElementById('cart-homes');
      // console.log(data);
      renderBooks(data.data, carthome);


    } else {
      console.error('Failed to get all book:', response.statusText);
    }
  } catch (error) {
    console.error('Error during fetching book:', error);
  }
}

// Call allbook function when the page is loaded
document.addEventListener("DOMContentLoaded", allbook);
//end
