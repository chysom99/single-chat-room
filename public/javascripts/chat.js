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

// Show loading before adding more messages
const outputLoading = async (parent) => {
	const div = document.createElement("div");
	div.classList.add("loading");
	const loadingPara = document.createElement("p");
	loadingPara.innerHTML = "loading...";
	div.appendChild(loadingPara);
	parent.prepend(div);
	return new Promise((resolve) =>
		setTimeout(() => {
			parent.removeChild(div);
			resolve();
		}, 2500)
	);
};

//output message to DOM
const outputMessage = (message, newMessage = false) => {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `
		<p class="meta">
			${message.sender}
				<span>${getTimeOnly(message.timeSent)}
				</span>
		</p>
		<p class="text">${message.messageText}</p>
	`;
	if (newMessage) {
		document.querySelector(".chat-messages").appendChild(div);
	} else {
		document.querySelector(".chat-messages").prepend(div);
	}
};

// output btn to show more messages
const outputBtn = (page) => {
	const div = document.createElement("div");
	div.classList.add("show-more");
	const btn = document.createElement("button");
	btn.innerHTML = "Show More";
	div.appendChild(btn);
	document.querySelector(".chat-messages").prepend(div);

	btn.addEventListener("click", async () => {
		const parent = document.querySelector(".chat-messages");
		parent.removeChild(div);
		await outputLoading(parent);
		const msg = await getMessages(page);
		if (msg.data.success) {
			displayMessages(msg.data.data, msg.data.pagination);
		}
	});
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

// Send request to send message
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

// Get first 5 messages
const getMessages = async (page) => {
	try {
		const msg = await axios.get(`/api/v1/messages?page=${page}&limit=5`);
		return msg;
	} catch (err) {
		throw new Error(err);
	}
};

// Display the messages received
const displayMessages = (msg, pagination) => {
	for (let i = 0; i < msg.length; i++) {
		outputMessage(msg[i]);
	}
	if (pagination?.next) {
		outputBtn(pagination.next.page);
	}
	chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Helper function to get time only
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
	socket.on("status", async (info) => {
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
	const msg = await getMessages(1);
	if (msg.data.success) {
		displayMessages(msg.data.data, msg.data.pagination);
	}
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
	outputMessage(message, true);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//submit message
chatForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;

	const sent = await postMessage(msg);
	if (sent.data.success) {
		outputMessage(sent.data.message, true);
		socket.emit("chatMessage", sent.data.message);
	}
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});
