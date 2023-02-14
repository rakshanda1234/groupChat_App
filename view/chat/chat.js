document.getElementById("chat-form").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message").value;
    const res = await axios.post(
      "http://localhost:3000/message/send",
      {
        message: message,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    console.log("error while sending msg", error);
  }
};
