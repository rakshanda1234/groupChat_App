document.getElementById("loginform").onsubmit = async (e) => {
  e.preventDefault();

  try {
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;

    let res = await axios.post("http://localhost:3000/user/login", {
      email,
      password,
    });
    console.log(res);
    if (res.status === 200) {
      email.value = "";
      password.value = "";
      confirm("User logged in successfully!");

      localStorage.setItem("token", res.data.token);

      window.location.href = "../chat/chat.html";
    }
  } catch (error) {
    console.log(error);

    if (error.response.status === 401) {
      alert("Password is incorrect!");
    }
  }
};
