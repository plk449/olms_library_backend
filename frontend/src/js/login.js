const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");


window.addEventListener('scroll', () => {
    if (window.scrollY >= 70) {
      nav.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    }
    else{
      nav.style.backgroundColor = "transparent";
    }
});

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// wishlist.html


document.getElementById("btn1").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    console.log("Form submitted");

    // Get form data
    const email = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    try {
        // Send POST request to the backend with the form data
        const response = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include', 
        });

        if (!response.ok) {
            throw new Error('Failed to log in');
        }
        else {
            
            // }
            const result = await response.json();
            console.log(result);

            document.getElementById('message').textContent = result.message; // Display success message

            // Redirect if needed
            // window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Login failed: ' + error; // Display error message
    }
});





document.getElementById("btn2").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    console.log("Form submitted");

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const fullName = document.getElementById('fullName').value;
    const userName = document.getElementById('userName').value;

    // Send POST request to the backend with the form data
    fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, phoneNumber, fullName, userName }),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON response
            } else {
                throw new Error('Failed to register');
            }
        })
        .then(data => {
            // console.log(data.message); // Log success message
            document.getElementById('message').textContent = data.message; // Display success message
             // Optionally, redirect to the login page or home page
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').textContent = 'Registration failed: ' + error.message; // Display error message
        });
})



