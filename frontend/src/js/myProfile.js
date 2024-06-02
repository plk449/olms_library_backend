const fullName = document.getElementById("fullName");
const userEmail = document.getElementById("user-email");
const userName = document.getElementById("user-name");
const userPhone = document.getElementById("user-phone");
const avatar = document.getElementById("image");
const userFimg2 = document.getElementById("userFimg2");
const history = document.getElementById("history");



//history
history.addEventListener("click",async () => {
    try {
        window.location.href = 'trans-history.html';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  })


// Load Profile 
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


            if (result.data.avatar) {
                userFimg2.style.display = "none";
                avatar.style.display = "block";
                avatar.src="../../../src/public/temp/" +result.data.avatar || '';
              //   // console.log(result);
              } 

            // console.log(result.data.avatar);
           
            fullName.innerText = result.data.fullName;
            userEmail.innerText = result.data.email;
            userName.innerText = result.data.userName;
            userPhone.innerText = result.data.phoneNumber;
            // console.log(result.data);
           
        } else if (response.status === 401) {
            // Unauthorized access, redirect to login
            window.location.href = 'login.html';
        } else {
            // Handle other errors
            console.error('Failed to get profile:', response.statusText);

        }
    } catch (error) {
        // If an error occurs during fetching, log the error
        console.error('Error during fetching profile:', error);
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);