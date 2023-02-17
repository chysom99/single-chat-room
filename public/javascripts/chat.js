const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const input = document.getElementById("input");

//output online/offline status to DOM
const outputStatus = (statusInfo) => {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = ` <p class="meta">${statusInfo.username}<span>${getTimeOnly(
		Date.now()
	)}</span></p>
  <p class="text">${statusInfo.online ? "Online" : "Offline"}</p>`;
	document.querySelector(".chat-messages").appendChild(div);
};
//output message to DOM
const outputMessage = (message) => {
	const div = document.createElement("div");
	div.classList.add("message");
	/* div.innerHTML = ` <p class="meta">${message.sender}<span>${getTimeOnly(
		message.timeSent
	)}</span></p>
  <p class="text">${message.messageText}</p>`; */
	document.querySelector(".chat-messages").appendChild(div);
};

// Show List of users
const showUserList = (user) => {
	const usersList = document.getElementById("users");
	const userChild = document.createElement("li");
	userChild.dataset.username = user.username;
	const node = document.createTextNode(`${user.username} (Offline)`);
	userChild.appendChild(node);
	usersList.appendChild(userChild);
};

// Change status when user comes online
const showUserListStatus = (user) => {
	const userInList = document.querySelectorAll(
		`[data-username=${user.username}]`
	);
	if (userInList.length) {
		userInList[0].textContent = `${user.username} (${
			user.online ? "Online" : "Offline"
		})`;
	}
};

const postMessage = async (msgText) => {
	try {
		const msg = await axios.post(`/api/v1/messages`, {
			messageText: msgText,
			timeSent: new Date(),
		});
		return msg;
	} catch (err) {
		throw new Error(err);
	}
};

const getTimeOnly = (dateObj) => {
	const date = new Date(dateObj);
	return `
    ${date.getHours()}:${
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
	}
  `;
};

(async () => {
	const { data } = await axios.get(`/api/v1/auth/me`);

	socket.on("status", (info) => {
		const registerSend = {
			username: data.data.username,
			socketId: info.id,
		};
		socket.emit("register-id", registerSend);

		socket.emit("onlines", function (response) {
			for (const onlineInfo of response.onlinesArr) {
				showUserListStatus(onlineInfo);
			}
		});
	});
	const users = await axios.get(`/api/v1/users`);
	for (let i = 0; i < users.data.data.length; i++) {
		showUserList(users.data.data[i]);
	}

	socket.on("online", (info) => {
		showUserListStatus(info);
		outputStatus(info);
	});
})();

socket.on("message", (message) => {
	console.log(message);
	outputMessage(message);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//submit message
chatForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;

	const sent = await postMessage(msg);
	if (sent.data.success) {
		outputMessage(sent.data.message);
	}
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();

	// socket.emit("chatMessage", msg);
});
