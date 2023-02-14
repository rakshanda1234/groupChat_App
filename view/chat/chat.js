document.getElementById("chat-form").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message").value;

    const groupId = localStorage.getItem("groupId");
    if (!groupId) {
      alert("Please select a group first.");
      return (document.getElementById("message").value = "");
      // throw new Error('no group selected');
    }
    const res = await axios.post(
      "http://localhost:3000/message/send",
      {
        message: message,
        message: message,
        groupId: groupId,
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
    localStorage.removeItem("groupId");
    setInterval(() => {
      fetchGroupsAndShowToUser();
    }, 6000);
  } catch (error) {
    console.log(error);
  }
});

async function fetchMessagesAndShowToUser(groupId, intervalId) {
  try {
    localStorage.setItem("intervalId", intervalId);
    let oldMessages = JSON.parse(localStorage.getItem("messages"));
    let lastMsgId;
    let messages;
    if (!oldMessages) {
      console.log("no old messages");
      oldMessages = [];
      lastMsgId = 0;

      // if (lastMsgId !== 0) {
    } else {
      messages = oldMessages;

      lastMsgId = oldMessages[oldMessages.length - 1].id;
    }
    console.log("last msg id", lastMsgId);
    // console.log('oldmsgs1', oldMessages);
    // const res = await axios.get(
    //   `http://localhost:3000/message/fetchNewMsgs/?lastMsgId=${lastMsgId}`
    // );
    const res = await axios.get(
      `http://localhost:3000/message/fetchNewMsgs/?lastMsgId=${lastMsgId}&groupId=${groupId}`
    );
    // console.log('fetch res', res);
    if (res.status === 200) {
      const newMessages = res.data.messages;
      // let messages = oldMessages.concat(newMessages);
      messages = oldMessages.concat(newMessages);
      if (messages.length > 10) {
        messages = messages.slice(messages.length - 10, messages.length);
      }
      // console.log('messages', messages);
      localStorage.setItem("messages", JSON.stringify(messages));
      showChatToUser(messages);
    }
  } catch (error) {
    console.log(error);
  }
  let currentMsgs = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].groupId == groupId) {
      currentMsgs.push(messages[i]);
    }
  }
  console.log("msgs to show:", currentMsgs);
  localStorage.setItem("messages", JSON.stringify(messages));
  showChatToUser(currentMsgs);
}

function showChatToUser(messages) {
  try {
    const chatBody = document.getElementById("chat-body");
    chatBody.innerHTML = "";
    messages.forEach((message) => {
      // chatBody.innerHTML += message.message + `<br>`;
      // chatBody.innerHTML += message.from+': '+ message.message + `<br>`;
      chatBody.innerHTML += `
                <p>
                    ${message.from}: ${message.message}
                </p>
                <br>
            `;
    });
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("new-group-btn").onclick = async (e) => {
  window.location.href = "createChat.html";
};

async function fetchGroupsAndShowToUser() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/chat/getGroups", {
      headers: {
        Authorization: token,
      },
    });
    console.log("get groups response:", res);
    if (res.status === 200) {
      const groups = res.data.groups;
      showGrouopsToUser(groups);
    }
  } catch (error) {
    console.log(error);
  }
}

function showGrouopsToUser(groups) {
  try {
    // console.log(groups);
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";
    groups.forEach((group) => {
      // console.log(group);
      // console.log(group.name);
      chatList.innerHTML += `
                <p id="${group.id}">${group.name}</p>
                <hr>
            `;
    });
  } catch (error) {
    console.log(error);
  }
}
document.getElementById("chat-list").onclick = async (e) => {
  e.preventDefault();
  try {
    e.target.classList.add("active");
    const previousIntervalId = localStorage.getItem("intervalId");
    if (previousIntervalId) {
      clearInterval(previousIntervalId);
    }
    console.log(e.target.nodeName);
    if (e.target.nodeName === "P") {
      // e.target.setAttribute('class', 'active');
      const groupId = e.target.id;
      await new Promise((resolve, reject) => {
        localStorage.setItem("groupId", groupId);
        // localStorage.removeItem('messages');
        resolve();
      });
      const intervalId = setInterval(() => {
        fetchMessagesAndShowToUser(groupId, intervalId);
      }, 6000);
    }
  } catch (error) {
    console.log(error);
  }
};
