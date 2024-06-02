document.getElementById("updateBtn").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
        const fullName = document.getElementById('fulName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phNo').value;


        // Make a POST request to the update password endpoint
        const response = await fetch('http://localhost:3000/api/v1/users/updateDetail', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ phoneNumber, email, fullName }),
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            document.getElementById("message").innerText = result.message;
            // window.location.href = 'index.html';
        } else {
            console.error('Update User Details failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during details update:', error);
    }
});