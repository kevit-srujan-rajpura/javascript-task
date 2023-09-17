const instance = axios.create({
    baseURL: 'https://dummyapi.io/data/v1/user/',
    headers: {
        'app-id': '64ff095030fdb635ba516d77',
    },
    params: {
        limit: 6
    }
});

let apiResponse;
let isUpdateMode = false;

// GET -- method
async function getUser() {
    try {
        apiResponse = await instance.get();
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = ""; // Clear the table
        apiResponse.data.data.forEach(user => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", user.id);
            row.innerHTML = `
                <td><img src='${user.picture}' id="dp--img"/></td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td><button class="del_btn" onclick="delUser('${user.id}')"><i class="fa fa-trash" id="icon"></i></button></td>
            `;
            row.addEventListener("click", () => displayForm(user.id));
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

// DELETE -- method
async function delUser(id) {
    try {
        const userId = id;
        await instance.delete(`/${userId}`);
        console.log(`${userId}`)
        alert('User deleted');
        getUser(); // Refresh the table after deletion
    } catch (error) {
        console.error(error);
        alert('Failed to delete user');
    }
}

// to display data in form - from table
function displayForm(userId) {
    let form = document.getElementById("useradd--form");
    const user = apiResponse.data.data.find((user) => user.id === userId);
    if (user) { // Editing an existing user(for PUT)
        isUpdateMode = true;
        document.getElementById("userId").value = user.id;
        document.getElementById("email").value = "";
        document.getElementById("firstname").value = user.firstName;
        document.getElementById("lastname").value = user.lastName;
        document.getElementById("avtarlink").value = user.picture;
        document.getElementById('formH1').innerHTML = "Update User";
    } else { // Adding a new user(for POST)
        isUpdateMode = false;
        document.getElementById("userId").value = "";
        document.getElementById("email").value = "";
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";
        document.getElementById("avtarlink").value = "";
        document.getElementById('formH1').innerHTML = "Add User";
    }
    form.style.display = "block";
}

// logic for -- handle user submission (POST or PUT)
document.getElementById("subuser").addEventListener("click", (event) => {
    event.preventDefault();

    const userId = document.getElementById("userId").value;
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const avatarLink = document.getElementById("avtarlink").value;
    const email = document.getElementById("email").value;

    if (isUpdateMode) {
        updateUser(userId, firstName, lastName, avatarLink);
    } else {
        createUser(firstName, lastName, email, avatarLink);
    }

    // Validation -- for fill all the fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !avatarLink.trim()) {
        alert('Please fill all fields.');
        return;
    }

    // Validation for image URL 
    const urlPattern = /^(http|https):\/\/\S+\.(jpg|jpeg|png|svg|gif)$/i;
    if (!urlPattern.test(avatarLink)) {
        alert('Please enter a valid image URL');
        return;
    }
});

// PUT -- method
async function updateUser(userId, firstName, lastName, avatarLink) {
    try {
        const updatedUserData = {
            id: userId,
            firstName,
            lastName,
            picture: avatarLink
        }

        const response = await instance.put(`/${userId}`, updatedUserData);

        if (response.status === 200) {
            console.log("User updated successfully", response.data);
            getUser(); // Refresh the table after updating
            clearForm(); // for clear the fields
        }
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

// POST -- method
async function createUser(firstName, lastName, email, avatarLink) {
    try {
        const userData = {
            firstName,
            lastName,
            email,
            picture: avatarLink
        };

        const response = await instance.post(`/create`, userData);

        if (response.status === 201) {
            console.log("User created successfully", response.data);
            getUser(); // Refresh the table after creating
            clearForm();
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

// Functn to clear the form fields
function clearForm() {
    document.getElementById("userId").value = "";
    document.getElementById("email").value = "";
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("avtarlink").value = "";
    document.getElementById('formH1').innerHTML = "Add User";
}


getUser();
