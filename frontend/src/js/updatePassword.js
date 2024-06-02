document.getElementById("updateBtn").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
        const oldPassword = document.getElementById('oldpass').value;
        // console.log("value->", oldPassword);
        const newPassword = document.getElementById('newpass').value;
        // console.log("value->", newPassword);

        // Make a POST request to the update password endpoint
        const response = await fetch('http://localhost:3000/api/v1/users/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            document.getElementById("message").innerText = result.message;
            window.location.href = 'index.html';
        } else {
            console.error('Update password failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during password update:', error);
    }
});


function togglePasswordVisibility(icon) {
    let passwordInput = icon.previousElementSibling; // Get the input element preceding the icon
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        passwordInput.type = "password";
        icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
}