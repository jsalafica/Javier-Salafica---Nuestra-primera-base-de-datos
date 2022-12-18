const socket = io();

//Chat
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const emailInput = document.getElementById("email");
const chatPool = document.getElementById("messageForm");

const sendMsg = (messageInfo) => {
  socket.emit("client:message", messageInfo);
};

const renderChat = (chat) => {
  const html = chat.map((msg) => {
    return `
        <p> <span id="emailChat">${msg.username} </span><span id="dateChat"> [${msg.time}] </span> <span>:</span> <span id="messageChat"> ${msg.message}</span>  </p>
        `;
  });
  chatPool.innerHTML = html.join("");
};

const submitHandlerChat = (e) => {
  e.preventDefault();
  const messageInfo = {
    username: emailInput.value,
    message: messageInput.value,
    time: new Date().toLocaleString(),
  };
  sendMsg(messageInfo);
  messageInput.value = "";
  emailInput.readOnly = true;
};

chatForm.addEventListener("submit", submitHandlerChat);

socket.on("server:message", renderChat);

//Productos
const productForm = document.getElementById("productForm");
const productName = document.getElementById("name");
const productPrice = document.getElementById("price");
const productThumbnail = document.getElementById("thumbnail");
const productList = document.getElementById("productPool");

const sendProduct = (producInfo) => {
  socket.emit("client:product", producInfo);
};

const renderProduct = (product) => {
  const html = product.map((prod) => {
    return `
          <tr>
          <td>${prod.title}</td>
          <td>${prod.price}</td>
          <td><img src="${prod.thumbnail}" alt="producto" width="50px"></td>
          </tr>
          `;
  });
  productList.innerHTML = html.join("");
};

const submitHandler = (e) => {
  e.preventDefault();
  const producInfo = {
    title: productName.value,
    price: productPrice.value,
    thumbnail: productThumbnail.value,
  };
  sendProduct(producInfo);
  productForm.reset();
};

productForm.addEventListener("submit", submitHandler);

socket.on("server:product", renderProduct);
