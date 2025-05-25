// register user
document.getElementById("RegisterButton").addEventListener("click", () => {
    // get username and password values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // check if fields are empty
    if (!username || !password) {
        alert("all fields are required.");
        return;
    }

    // create data object
    const data = {
        username: username,
        password: password
    };

    // send post request to server
    fetch("http://localhost:3000/uploadsql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // check if response is ok
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("registration failed.");
            }
        })
        .then(message => {
            // show server message
            alert(message);
        })
        .catch(error => {
            // handle errors
            console.error("error:", error);
            alert("an error occurred while registering.");
        });
});