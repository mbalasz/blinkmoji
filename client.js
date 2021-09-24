"use strict";

const { showGif } = require("./blinken");
import { EmojiButton } from "@joeattardi/emoji-button";

var socket = io();

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
