// const baseUrl = `http://34.224.95.210:3000`;
const baseUrl = `http://localhost:3000`;

document.getElementById("signupform").onsubmit = async (e) => {
  e.preventDefault();

  try {
    const name = document.getElementById("nameField").value;
    const email = document.getElementById("emailField").value;
    const phone = document.getElementById("phoneField").value;
    const password = document.getElementById("passwordField").value;

    let res = await axios.post(`${baseUrl}/user/signup`, {
      name,
      email,
      phone,
      password,
    });

    console.log(res);
    if (res.status === 200) {
      alert("Successfuly signed up!");
      window.location.href = "../login/login.html";
    }
  } catch (error) {
    console.log(error);
    document.getElementById("error-text").innerHTML += `${error}`;
    if (error.response.status === 403) {
      alert("User already exists. Please Login.");
    }
  }
};
