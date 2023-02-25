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
    fetchGroupsAndShowToUser();
    // setInterval(() => {
    //   fetchGroupsAndShowToUser();
    // }, 1000);
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
    } else {
      messages = oldMessages;
      lastMsgId = oldMessages[oldMessages.length - 1].id;
    }
    // console.log("last msg id", lastMsgId);
    console.log("oldmsgs1", oldMessages);
    const res = await axios.get(
      `http://localhost:3000/message/fetchNewMsgs/?lastMsgId=${lastMsgId}&groupId=${groupId}`
    );
    console.log("fetch res", res);
    if (res.status === 200) {
      const newMessages = res.data.messages;
      // let messages = oldMessages.concat(newMessages);
      messages = oldMessages.concat(newMessages);
      if (messages.length > 10) {
        messages = messages.slice(messages.length - 10, messages.length);
      }
      console.log("messages", messages);
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
  } catch (error) {
    console.log(error);
  }
}
//frontent msg
function showChatToUser(messages) {
  try {
    const chatul = document.getElementById("chat-ul");
    chatul.innerHTML = "";
    console.log("messages");
    messages.forEach((message) => {
      // chatBody.innerHTML += message.from+': '+ message.message + `<br>`;
      chatul.innerHTML += `
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
      showGroupsToUser(groups);
    }
  } catch (error) {
    console.log(error);
  }
}

function showGroupsToUser(groups) {
  try {
    // console.log(groups);
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";
    groups.forEach((group) => {
      // console.log(group);
      // console.log(group.name);
      chatList.innerHTML += `
      <div>
                <p id="${group.id}">${group.name}</p>
                <button>+</button>
                </div>
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

    if (e.target.nodeName === "BUTTON") {
      // console.log(e.target.parentElement.children[0].id);
      const groupId = e.target.parentElement.children[0].id;
      sessionStorage.setItem("addToGroup", groupId);
      window.location.href = `newMember.html`;
    } else {
      const chatNameDiv = document.getElementById("open-chat");
      let groupId;
      if (e.target.nodeName === "P") {
        chatNameDiv.innerHTML = `<p><b>${e.target.innerText}</b></p>`;
        groupId = e.target.id;
      } else {
        chatNameDiv.innerHTML = `<p><b>${e.target.children[0].innerText}</b></p>`;
        groupId = e.target.children[0].id;
      }
      await new Promise((resolve, reject) => {
        localStorage.setItem("groupId", groupId);
        // localStorage.setItem("messages", message);
        resolve();
      });
      fetchMessagesAndShowToUser(groupId);
      // const intervalId = setInterval(() => {
      //   fetchMessagesAndShowToUser(groupId, intervalId);
      // }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};
document.getElementById("open-chat").onclick = (e) => {
  e.preventDefault();
  try {
    document.getElementById("members-list").classList.add("active");
    const groupId = localStorage.getItem("groupId");
    fetchMembersAndShowToUser(groupId);
  } catch (error) {
    console.log(error);
  }
};

async function fetchMembersAndShowToUser(groupId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/chat/getMembers/?groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("get members response:", res);
    if (res.status === 200) {
      const members = res.data.members;
      showMembersToUser(members);
    }
  } catch (error) {
    console.log(error);
  }
}

function showMembersToUser(members) {
  try {
    const memberBody = document.getElementById("members-ul");
    memberBody.innerHTML = "";
    members.forEach((member) => {
      if (member.isAdmin) {
        memberBody.innerHTML += `<li>
                    ${member.dataValues.name} <b>-Admin</b>
                    <button class="rmadminbtn" id="rmadminbtn-${member.dataValues.id}">Remove Admin Permission</button>
                    <button class="rmbtn" id="rmbtn-${member.dataValues.id}">Remove User</button>
                </li>`;
      } else {
        memberBody.innerHTML += `<li>
                    ${member.dataValues.name}
                    <button class="adminbtn" id="mkbtn-${member.dataValues.id}">Make Admin</button>
                    <button class="rmbtn" id="rmbtn-${member.dataValues.id}">Remove User</button>
                </li>`;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("close-members-btn").onclick = (e) => {
  e.preventDefault();
  document.getElementById("members-list").classList.remove("active");
};

document.getElementById("members-ul").onclick = (e) => {
  e.preventDefault();
  try {
    if (e.target.className == "adminbtn") {
      makeAdmin(e.target.id);
    } else if (e.target.className == "rmbtn") {
      removeMember(e.target.id);
    } else if (e.target.className == "rmadminbtn") {
      removeAdminPermission(e.target.id);
    }
  } catch (error) {
    console.log(error);
  }
};

async function makeAdmin(idString) {
  try {
    const userId = idString.split("-")[1];
    const token = localStorage.getItem("token");
    const groupId = localStorage.getItem("groupId");
    const res = await axios.put(
      "http://localhost:3000/admin/makeAdmin",
      { userId: userId, groupId: groupId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res.status === 200) {
      console.log("setting admin response:", res);
      confirm("user set as admin");
      fetchMembersAndShowToUser(groupId);
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 403) {
      alert(`You don't have required permissions.`);
    }
  }
}

async function removeMember(idString) {
  try {
    const userId = idString.split("-")[1];
    const token = localStorage.getItem("token");
    const groupId = localStorage.getItem("groupId");
    let config = {
      headers: {
        Authorization: token,
      },
      data: { userId: userId, groupId: groupId },
    };
    const res = await axios.delete(
      "http://localhost:3000/admin/removeFromGroup",
      config
    );
    if (res.status === 200) {
      console.log("removing user response:", res);
      confirm("user removed from group");
      fetchMembersAndShowToUser(groupId);
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 403) {
      alert(`You don't have required permissions.`);
    }
  }
}

async function removeAdminPermission(idString) {
  try {
    const userId = idString.split("-")[1];
    const token = localStorage.getItem("token");
    const groupId = localStorage.getItem("groupId");
    const res = await axios.put(
      "http://localhost:3000/admin/removeAdmin",
      { userId: userId, groupId: groupId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res.status === 200) {
      console.log("remove admin response:", res);
      confirm("user removed from admin");
      fetchMembersAndShowToUser(groupId);
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 403) {
      alert(`You don't have required permissions.`);
    }
  }
}
