import React, { useState, useEffect } from "react";
import { useROS } from "../../ROSContext";
import ROSLIB from "roslib";
import GamepadVisualizer from "../../components/GamePadVisualizer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const Drive: React.FC = () => {
  const { ros } = useROS();

  const [currentSpeed, setCurrentSpeed] = useState<ROSLIB.Message>();
  const [velocityData, setVelocityData] = useState<{ time: number; velocity: number }[]>([]);


  useEffect(() => {
    if (!ros) return;

    const cmdVel = new ROSLIB.Topic({
      ros,
      name: "/driving_node/target_twist",
      messageType: "geometry_msgs/msg/Twist",
    });

    cmdVel.subscribe((message: ROSLIB.Message) => {
      setVelocityData((prevData) => {
        prevData.push({ time: Date.now(), velocity: (message as any).linear.y });
        return prevData.length >= 500 ? prevData.slice(-500) : prevData;
      });
      // setVelocityData((prevData) => [
      //   ...prevData,
      //   { time: Date.now(), velocity: message.linear.y }]);
      setCurrentSpeed(message);
    });

    return () => {
      cmdVel.unsubscribe();
    };
  }, [ros]);

  return <div>
    <h1>Calibrate</h1>
    {currentSpeed && <p>Current speed: {(currentSpeed as any).linear.y} m/s</p>}
    {currentSpeed && <p>Current angle: {(currentSpeed as any).angular.z} rad/s</p>}
    <GamepadVisualizer />
    <LineChart
      width={600}
      height={300}
      data={velocityData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis />
      <XAxis dataKey="time" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="velocity" stroke="#8884d8" isAnimationActive={false} dot={false} />
    </LineChart>
  </div>;
};

export default Drive;
