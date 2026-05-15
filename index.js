import { DAC } from "@laser-dac/core";
import { Simulator } from "@laser-dac/simulator";
import { EtherDream } from "@laser-dac/ether-dream";
import { Circle, Line, Scene, Svg, loadSvgFile } from "@laser-dac/draw";
import * as path from "path";
import { io } from "socket.io-client";
import { Rect } from "@laser-dac/draw";

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
      const color = [1, 1, 1];

      if (user.color === "red") {
        color[0] = 1;
        color[1] = 0;
        color[2] = 0;
      }
      if (user.color === "green") {
        color[0] = 0;
        color[1] = 1;
        color[2] = 0;
      }
      if (user.color === "blue") {
        color[0] = 0;
        color[1] = 0;
        color[2] = 1;
      }

      if (user.shape === "circle") {
        const circle = new Circle({
          x: normalizedX,
          y: normalizedY,
          radius: normalizedRadius,
          color: color,
        });
        scene.add(circle);
      }
      if (user.shape === "square") {
        const size = normalizedRadius * 2;
        const halfSize = size / 2;
        const square = new Rect({
          x: normalizedX - halfSize,
          y: normalizedY - halfSize,
          width: size,
          height: size,
          color: color,
        });
        scene.add(square);
      }
      if (user.shape === "triangle") {
        const size = normalizedRadius * 2;
        const halfSize = size / 2;
        const p1 = { x: normalizedX, y: normalizedY - halfSize };
        const p2 = { x: normalizedX - halfSize, y: normalizedY + halfSize };
        const p3 = { x: normalizedX + halfSize, y: normalizedY + halfSize };

        scene.add(
          new Line({ from: p1, to: p2, color: color, blankBefore: true }),
        );
        scene.add(new Line({ from: p2, to: p3, color: color }));
        scene.add(
          new Line({ from: p3, to: p1, color: color, blankAfter: true }),
        );
      }
    }
  }

  scene.start(renderFrame);
  dac.stream(scene, 30_000);
})();
