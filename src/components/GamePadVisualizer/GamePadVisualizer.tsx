import React, { useState, useEffect } from "react";
import { useROS } from "../../ROSContext";
import ROSLIB from "roslib";
import "./GamePadVisualizer.css";

const GamepadVisualizer: React.FC = () => {
  const [connectedGamepadIndex, setConnectedGamepadIndex] = useState<number | null>(null);
  const [gamepadData, setGamepadData] = useState<null | { buttons: number[]; axes: number[] }>(null);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  const [gamePadTopic, setGamePadTopic] = useState<ROSLIB.Topic | null>(null);
  const { ros } = useROS();

  useEffect(() => {
    if (ros) {
      const gamePadTopic = new ROSLIB.Topic({
        ros: ros as ROSLIB.Ros,
        name: "/gamepad",
        messageType: "sensor_msgs/Joy",
        queue_size: 1, // Set the queue size to 1, no backlog
        throttle_rate: 10, // Set the throttle rate to 10ms
      });
      setGamePadTopic(gamePadTopic);
    }

    const onGamepadConnected = (event: GamepadEvent) => {
      console.log("Gamepad connected:", event.gamepad);
      setConnectedGamepadIndex(event.gamepad.index);
      startGamepadLoop(event.gamepad.index);
    };

    const onGamepadDisconnected = (event: GamepadEvent) => {
      console.log("Gamepad disconnected:", event.gamepad);
      if (connectedGamepadIndex === event.gamepad.index) {
        setConnectedGamepadIndex(null);
        stopGamepadLoop();
        setGamepadData(null);
      }
    };

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        setConnectedGamepadIndex(i);
        startGamepadLoop(i);
        break;
      }
    }

    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      gamePadTopic?.removeAllListeners();
      stopGamepadLoop();
    };

  }, [connectedGamepadIndex]);

  const startGamepadLoop = (index: number) => {
    const deadZone = 0.05;
    const updateGamepadData = () => {
      const gamepad = navigator.getGamepads()[index];
      if (gamepad) {
        // Process the first four axes (joystick axes) with a dead zone threshold
        const processedAxes = gamepad.axes.map((axis, idx) => {
          let value = parseFloat(axis.toFixed(2));
          if (idx < 4 && Math.abs(value) < deadZone) {
            return 0;
          }
          return value;
        });

        setGamepadData({
          buttons: gamepad.buttons.map((button) => button.value),
          axes: processedAxes,
        });

        const gamePadMessage = new ROSLIB.Message({
          buttons: gamepad.buttons.map((button) => button.pressed),
          axes: [
            ...processedAxes,
            gamepad.buttons[6] ? gamepad.buttons[6].value : 0,
            gamepad.buttons[7] ? gamepad.buttons[7].value : 0
          ],
        });
        if (gamePadTopic) {
          gamePadTopic.publish(gamePadMessage);
        }
      }
      const id = requestAnimationFrame(updateGamepadData);
      setAnimationFrameId(id);
    };

    updateGamepadData(); // Start the loop
  };

  const stopGamepadLoop = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
  };

  if (connectedGamepadIndex === null) {
    return (
      <div className="gamepad-visualizer">
        <h4>No Gamepad Connected</h4>
      </div>
    );
  }

  const { buttons, axes } = gamepadData || { buttons: [], axes: [] };
  const radius = 50;
  const width = 300;
  const circleHeight = 80;

  return (
    <div className="gamepad-visualizer">
      <svg
        viewBox={`0 0 ${width} 200`}
        width="100%"
        height="100%"
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Left Joystick */}
        <circle cx={width / 2 - radius - 10} cy={circleHeight} r={radius} fill="#ddd" />
        <circle
          cx={width / 2 - radius - 10 + axes[0] * radius} // Left stick X-axis
          cy={circleHeight + axes[1] * radius} // Left stick Y-axis
          r="10"
          fill="red"
        />

        {/* Right Joystick */}
        <circle cx={width / 2 + radius + 10} cy={circleHeight} r={radius} fill="#ddd" />
        <circle
          cx={width / 2 + radius + 10 + axes[2] * radius} // Right stick X-axis
          cy={circleHeight + axes[3] * radius} // Right stick Y-axis
          r="10"
          fill="blue"
        />

        {/* Left Trigger */}
        <rect x={width / 2 - 10 - radius * 2 - 20} y={circleHeight - radius} width="10" height={radius * 2} fill="#ccc" />
        <rect
          x={width / 2 - 10 - radius * 2 - 20}
          y={circleHeight + radius - buttons[6] * radius * 2} // Left trigger value
          width="10"
          height={buttons[6] * radius * 2}
          fill="green"
        />

        {/* Right Trigger */}
        <rect x={width / 2 + 10 + radius * 2 + 10} y={circleHeight - radius} width="10" height={radius * 2} fill="#ccc" />
        <rect
          x={width / 2 + 10 + radius * 2 + 10}
          y={circleHeight + radius - buttons[7] * radius * 2} // Right trigger value
          width="10"
          height={buttons[7] * radius * 2}
          fill="green"
        />
      </svg>
    </div>
  );
};

export default GamepadVisualizer;
