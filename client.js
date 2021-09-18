"use strict";

const { showGif } = require("./blinken");
import { EmojiButton } from "@joeattardi/emoji-button";

var socket = io();
// let messages = document.getElementById("messages");
// var form = document.getElementById("form");
// var input = document.getElementById("input");
// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("chat message", input.value);
//     input.value = "";
//   }
// });

// socket.on("chat message", (msg) => {
//   let item = document.createElement("li");
//   item.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

socket.on("show gif", (gifSrc) => {
  showGif(gifSrc);
});

const picker = new EmojiButton({
  theme: "dark",
});
const trigger = document.getElementById("emoji-trigger");
picker.on("emoji", (selection) => {
  trigger.innerHTML = selection.emoji;
  socket.emit('chat message', selection.emoji);
});

trigger.addEventListener("click", () => picker.togglePicker(trigger));
