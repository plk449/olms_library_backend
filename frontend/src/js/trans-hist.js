



//Return Book
async function returnBook(book) {
    const bookId = book._id;
    // console.log(book._id);
    await fetch('http://localhost:3000/api/v1/books/return', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
    })
    .then(response => {
        if (response.ok) {
            // alert('Book return successfully');
            window.location.href = 'trans-history.html';

        }
        return response.json();
        })
        // .then(result => {
    //     console.log(result.massege)
    // }).catch(error => {
    //     console.error('Error during Search book:', error);
    // })
}





// Function to create book items
function createBookItem(book) {
    // console.log(book);

    // Create div element for cart
    const cartDiv = document.createElement('div');
    cartDiv.classList.add('cart');
    cartDiv.id = 'cart';

    // Create div element for book image
    const bookImageDiv = document.createElement('div');
    bookImageDiv.classList.add('book-image');
    bookImageDiv.id = 'bookImgCon';

    // Create img element for book image
    const bookImg = document.createElement('img');
    // bookImg.src = './book2.webp';
    bookImg.alt = 'book-image';
    bookImg.id = 'bookImg';
    bookImg.src =  book.bookId.coverImage || '';

    // Append book image img to book image div
    bookImageDiv.appendChild(bookImg);

    // Append book image div to cart div
    cartDiv.appendChild(bookImageDiv);

    // Create div element for book info
    const bookInfoDiv = document.createElement('div');
    bookInfoDiv.classList.add('book-info');
    bookInfoDiv.id = 'bookInfo';

    // Create div element for book name
    const bookNameDiv = document.createElement('div');
    bookNameDiv.classList.add('book-name');
    bookNameDiv.id = 'bookNameCon';

    // Create h3 element for book name
    const bookName = document.createElement('h3');
    // bookName.textContent = 'The Selfish Giant';
    bookName.id = 'bookName';
    bookName.textContent = book.bookId.title || '';

    // Append book name h3 to book name div
    bookNameDiv.appendChild(bookName);

    // Append book name div to book info div
    bookInfoDiv.appendChild(bookNameDiv);

    // Create div element for author
    const authorDiv = document.createElement('div');
    authorDiv.classList.add('author');
    authorDiv.id = 'authorCon';

    // Create p element for author
    const authorPara = document.createElement('p');
    authorPara.textContent = 'By: ';


    // Create span element for author name
    const authorSpan = document.createElement('span');
    authorSpan.id = 'author';
    authorSpan.textContent = book.bookId.author || '';


    // Append author span to author p
    authorPara.appendChild(authorSpan);
    authorDiv.appendChild(authorPara);
    bookInfoDiv.appendChild(authorDiv);

    // Create div element for date
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.id = 'dateCon';

    // Create div element for borrow date
    const borrowDateDiv = document.createElement('div');
    borrowDateDiv.classList.add('borrow-date');
    borrowDateDiv.id = 'brrowDateCon';

    // Create p element for borrow date
    const borrowDatePara = document.createElement('p');
    borrowDatePara.textContent = 'Borrow Date:';


    const borrowDateSpan = document.createElement('span');
    borrowDateSpan.id = 'borrow';

    const date = book.borrowDate;
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();


    // borrowDateSpan.textContent =`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`|| '';
    borrowDateSpan.textContent = date || '';


    borrowDatePara.appendChild(borrowDateSpan);


    borrowDateDiv.appendChild(borrowDatePara);
    dateDiv.appendChild(borrowDateDiv);

    // Create div element for return date
    const returnDiv = document.createElement('div');
    returnDiv.classList.add('return');
    returnDiv.id = 'returnCon';

    // Create p element for return date
    const returnPara = document.createElement('p');
    returnPara.textContent = 'Return Date: ';
    const returnSpan = document.createElement('span');
    returnSpan.id = 'return';
    returnSpan.textContent = book.returnDate || ''
    returnPara.appendChild(returnSpan);



    // Append return date p to return date div
    returnDiv.appendChild(returnPara);

    // Append return date div to date div
    dateDiv.appendChild(returnDiv);

    // Append date div to book info div
    bookInfoDiv.appendChild(dateDiv);

    // Create div element for status
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    statusDiv.id = 'statusCon';

    // Create p element for status
    const statusPara = document.createElement('p');
    statusPara.textContent = 'Status: ';

    const statusSpan = document.createElement('span');
    statusSpan.id = 'status';
    console.log(book.isReturned)
    if (book.isReturned) {

        statusSpan.textContent = 'Returned'
    }
    else {
        statusSpan.textContent = 'Not return'

    }
    // statusSpan.textContent ='Not return'
    statusPara.appendChild(statusSpan);



    // Append status p to status div
    statusDiv.appendChild(statusPara);
    bookInfoDiv.appendChild(statusDiv);
    if (!book.isReturned) {
        const retDiv = document.createElement('div');
        retDiv.classList.add('return-btn');

        const retBtn = document.createElement('button');
        retBtn.id = 'return';
        retBtn.textContent = "Return"

        retDiv.appendChild(retBtn);
        bookInfoDiv.appendChild(retDiv);

        retBtn.addEventListener('click', () => {
            returnBook(book.bookId);
            // addToFav.classList.toggle('wish-unwish');
            // console.log(book.bookId._id);
        });
    }
    cartDiv.appendChild(bookInfoDiv);
    document.body.appendChild(cartDiv);
    return cartDiv;

}

// Function to render books
function renderBooks(books, carthome) {
    carthome.innerHTML = '';
    books.forEach(book => {
        // console.log(book.bookId.title)
        const bookItem = createBookItem(book);
        carthome.appendChild(bookItem);
    });
}

async function history() {
    try {

        const response = await fetch('http://localhost:3000/api/v1/books/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();

            // console.log(data.data);
            const carthome = document.getElementById('container');

            renderBooks(data.data, carthome);


        } else {
            console.error('Failed to get all book:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fetching book:', error);
    }
}

document.addEventListener("DOMContentLoaded", history);