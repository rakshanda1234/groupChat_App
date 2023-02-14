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
    document.getElementById("message").value = "";
  } catch (error) {
    console.log("error while sending msg", error);
  }
};
window.addEventListener("DOMContentLoaded", async () => {
  try {
    setInterval(() => {
      fetchMessagesAndShowToUser();
    }, 1000);
  } catch (error) {
    console.log(error);
  }
});

async function fetchMessagesAndShowToUser() {
  try {
    const res = await axios.get("http://localhost:3000/message/fetch");
    // console.log('fetch res', res);
    if (res.status === 200) {
      const messages = res.data.messages;
      showChatToUser(messages);
    }
  } catch (error) {
    console.log(error);
  }
}

function showChatToUser(messages) {
  try {
    const chatBody = document.getElementById("chat-body");
    chatBody.innerHTML = "";
    messages.forEach((message) => {
      chatBody.innerHTML += message.message + `<br>`;
    });
  } catch (error) {
    console.log(error);
  }
}
