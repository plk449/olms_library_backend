let bookImage = document.getElementById("bookImageFullS");
let bookName = document.getElementById("bookNameFullS");
let author = document.getElementById("authorFullS");
let cat = document.getElementById("catFullS");
let copy = document.getElementById("copyFullS");
let borrow = document.getElementById("borrow");
let cart = document.getElementById("cart");
let like = document.getElementById("like");
let likecount = document.getElementById("like-count");

let bookIdf = '';
// console.log(bookIdf)..


// Add like 
like.addEventListener("click", async function () {
    let bookId = bookIdf;
    await fetch('http://localhost:3000/api/v1/like/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                window.location.href = 'login.html';
            }
            else {
                throw new Error('Failed to Borrow');
            }
        }).then(result => {
            // console.log(result);
            like.classList.toggle('likeDislike');
            likecount.innerText = result.data.likeCount;
            // console.log(result.data.liked)
        })
        .catch(error => {
            console.error('Error during Search book:', error);

        });
})



//Add to cart or remove
cart.addEventListener("click", async function () {
    try {
        const bookId = bookIdf;
        // Make a POST request to the add to cart endpoint
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
            const result = await response.json(); // Await the response to get the result
            cart.classList.toggle('wishUnwish');
        } else {
            const result = await response.json(); // Await the response to get the error message
            if (response.status === 401) {
                // Unauthorized access, redirect to login
                window.location.href = 'login.html';
            } else {
                alert(result.message); // Display the error message
                console.error('Add to cart book failed:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Error during add to cart:', error); // Catch block should include the error parameter
    }
});


//book borrow
borrow.addEventListener("click", async () => {

    const bookId = bookIdf;
    // Make a GET request to the logout endpoint
    await fetch('http://localhost:3000/api/v1/books/borrow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
    })
        .then(response => {
            if (response.ok) {
                alert('Book borrowed successfully');
                return response.json();
            } else if (response.status === 401) {
                // Unauthorized access, redirect to login
                window.location.href = 'login.html';
            } else if (response.status === 400) {
                alert("You have already borrowed this book");
            } else {
                throw new Error('Failed to Borrow');
            }
        }).catch(error => {
            console.error('Error during Search book:', error);

        });
})


async function getOneBook() {
    try {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('bookId');
        bookIdf = bookId;
        // console.log(bookId);
        const response = await fetch('http://localhost:3000/api/v1/books/getOneBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });

        if (response.ok) {
            const data = await response.json();

            // console.log(data.data);
            // Update the HTML elements with the data from the response
            bookImage.src = data.data.coverImage;
            bookName.textContent = data.data.title;
            author.textContent = data.data.author;
            cat.textContent = data.data.genre;
            copy.innerText = data.data.totalCopiesAvailable;

        } else {
            console.error('Failed to get all book:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fetching book:', error);
    }
}

document.addEventListener("DOMContentLoaded", getOneBook);



async function likedislike() {
    let bookId = bookIdf;
    await fetch('http://localhost:3000/api/v1/like/liked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(result => {
            // console.log(result);
            if (result.data.liked) {
                like.classList.toggle('likeDislike');
            }
            likecount.innerText = result.data.likeCount;
        })
        .catch(error => {
            console.error('Error during Search book:', error);

        });
}

document.addEventListener("DOMContentLoaded", likedislike);