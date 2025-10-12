


document.addEventListener("DOMContentLoaded", function () {

    
    const form = document.getElementById("contactForm");
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");
    const email = document.getElementById("email");
    const message = document.getElementById("feedbackMsg");
  
    
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      
      const firstName = fname.value.trim();
      const lastName = lname.value.trim();
      const emailValue = email.value.trim();
      const messageValue = message.value.trim();
  
      
      if (firstName === "" || lastName === "" || emailValue === "" || messageValue === "") {
        alert("Vänligen fyll i alla fälten.");
        return;
      }
  
    
      if (!emailValue.includes("@") || !emailValue.includes(".")) {
        alert("Din emailadress är inte giltig. ");
        return;
      }
  
    
      alert("Tack " + firstName + "! Ditt meddelande har skickats.");
  

      form.reset();
    });
  });
  