document.addEventListener("DOMContentLoaded", function() {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form from reloading the page

      const username = document.getElementById("username").value;
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const password = document.getElementById("password").value;

      const userData = {
          username: username,
          firstname: firstname,
          lastname: lastname,
          password: password,
      };

      try {
          const response = await fetch("http://localhost:5000/api/auth/signup", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
          });

          const result = await response.json();

          if (result.success) {
              alert("Signup successful!");
              // Optionally, redirect to login page or home page
              window.location.href = "/login.html"; // Redirect to login page
          } else {
              alert(result.message); // Display error message from backend
          }
      } catch (error) {
          console.error("Error during signup:", error);
          alert("An error occurred. Please try again.");
      }
  });
});
