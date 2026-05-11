import { DAC } from "@laser-dac/core";
import { Simulator } from "@laser-dac/simulator";
import { EtherDream } from "@laser-dac/ether-dream";
import { Circle, Line, Scene, Svg, loadSvgFile } from "@laser-dac/draw";
import * as path from "path";
import { io } from "socket.io-client";

const __dirname = import.meta.dirname;
console.log(__dirname);
const socket = io("http://localhost:3000");
let users = {};

socket.on("updatePosition", (data) => {
  console.log(data);
  users = data;
});

socket.on("userDisconnected", (data) => {
  delete users[data.socketId];
});

(async () => {
  const dac = new DAC();
  dac.use(new Simulator());
  // dac.use(new EtherDream());
  if (process.env.DEVICE) {
  }
  await dac.start();

  const scene = new Scene({
    resolution: 200,
  });

  function renderFrame() {
    console.log(users);
    console.log(Math.random());
    for (const socketId in users) {
      const user = users[socketId];

      const normalizedX = user.x / 802.95;
      const normalizedY = user.y / 802.95;
      const normalizedRadius = user.radius / 802.95;
      if (user.shape === "circle") {
        const circle = new Circle({
          x: normalizedX,
          y: normalizedY,
          radius: normalizedRadius,
          color: user.color === "red" ? [1, 0, 0] : [1, 1, 1],
        });
        scene.add(circle);
      }
    }
  }

  scene.start(renderFrame);
  dac.stream(scene, 30_000);
})();
