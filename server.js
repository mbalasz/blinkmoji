const express = require("express");
const { Server } = require("socket.io");
const { exec } = require("child_process");

const app = express();

const imageBackground = "black";
const gravity = "center";
const pointsize = "10";
const extent = "16x16";
const gifName = "msg.gif";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

const server = app.listen(3000, () => {
  console.log("Server is up");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("Received message: " + msg);
    socket.emit("chat message", msg);
    printEmoji(String.fromCodePoint(msg.codePointAt(0)));
  });
});

function printEmoji(emojiChar) {
  const cat = exec(
    `convert -extent ${extent} -pointsize ${pointsize} -gravity ${gravity} -background ${imageBackground} -fill "#fff"  pango:'<span font="Noto Color Emoji">${emojiChar}</span>' public/${gifName}`,
    async (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      io.emit("show gif", `${gifName}`);
    }
  );
}

// Prints a message character by character in short time intervals.
function printChar(msg, currIdx) {
  if (currIdx >= msg.length) {
    return;
  }
  const currentChar = String.fromCodePoint(msg.codePointAt(currIdx));
  const regexEmoji = /\p{Emoji_Presentation}/u;
  console.log(
    "Is " +
      currentChar +
      " an emoji: " +
      regexEmoji.test(currentChar) +
      " length: " +
      currentChar.length
  );
  if (currentChar != " ") {
    const cat = exec(
      `convert -extent ${extent} -pointsize ${pointsize} -gravity ${gravity} -background ${imageBackground} -fill "#fff"  pango:"${currentChar}" public/${gifName}`,
      async (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        io.emit("show gif", `${gifName}`);
        shortSleep();
        printChar(msg, currIdx + currentChar.length);
      }
    );
  } else {
    printChar(msg, currIdx + 1);
  }
}

async function shortSleep() {
  await sleep(200);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
