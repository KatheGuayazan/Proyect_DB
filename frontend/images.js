document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");
    if (imageInput.files.length === 0) {
        alert("Please select an image to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) return response.text();
        else throw new Error("Upload failed.");
    })
    .then(message => {
        document.getElementById("uploadResult").innerText = message;
        imageInput.value = ""; // Limpiar input
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message);
    });
});