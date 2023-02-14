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
  } catch (error) {
    console.log(error);
  }
};
