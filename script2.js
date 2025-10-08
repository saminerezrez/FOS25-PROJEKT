const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const feedback = document.getElementById("feedback");
const button = document.getElementById("button");

button.onclick = FormValidator;

function FormValidator(event){
    event.preventDefault(); 

    if(fname.value.trim() === "" || lname.value.trim() === "" || email.value.trim() === "" || feedback.value.trim() === "") {
        alert("Please fill in all fields");
        return;
    }

    if(!email.value.includes("@") || !email.value.includes(".com")) {
        alert("Please write correct email format");
        return;
    }

    alert("Form has been sent!");
}
