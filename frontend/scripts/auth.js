document.addEventListener("DOMContentLoaded", function() {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

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

              window.location.href = "/login"; 
          } else {
              alert(result.message); 
          }
      } catch (error) {
          console.error("Error during signup:", error);
          alert("An error occurred. Please try again.");
      }
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const loginData = {
          username: username,
          password: password,
      };

      try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(loginData),
          });

          const result = await response.json();

          if (result.success) {
              alert("Login successful!");

              localStorage.setItem("user", JSON.stringify(result.user));

              window.location.href = "/main"; 

          } else {
              alert(result.message);
          }
      } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred. Please try again.");
      }
  });
});