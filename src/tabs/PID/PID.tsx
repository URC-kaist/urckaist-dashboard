import React, { useState, useEffect } from "react";
import { useROS } from "../../ROSContext";
import ROSLIB from "roslib";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import ToggleSwitch from "../../components/DevModeToggle/DevModeToggle";

const PID: React.FC = () => {
  const { ros } = useROS();

  const [currentSpeed, setCurrentSpeed] = useState<ROSLIB.Message>(); // Saves a sort of state in the tab. use setCurrentSpeed to change that state.
  const [velocityData, setVelocityData] = useState<{ time: number; velocity: number }[]>([]); 

  const [isToggled, setIsToggled] = useState(false);
  const [debugOn, setDebugText] = useState("Not turned on yet");

  const setDebug = new ROSLIB.Service({
    ros: ros, 
    name: '/steering_node/set_debug_mode', 
    serviceType: 'std_srvs/SetBool', 
  });

  const handleToggleChange = (checked: boolean) => {
    setIsToggled(checked);
    console.log('Toggled:', checked); // You can do more actions here

    const request = new ROSLIB.ServiceRequest({
      data: isToggled ? false : true
    });

    setDebug.callService(request, (result) => {
      //console.log('Service response:', result);
      if (result.success) {
        //console.log('Service call was successful:', result.message);
        setDebugText(result.message);
      } else {
        //console.log('Service call failed:', result.message);
        setDebugText("Service call Failed");
      }

    });
  };

  useEffect(() => {
    if (!ros) return;

    const cmdVel = new ROSLIB.Topic({ // This topic should be something else.
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
    <ToggleSwitch
        label="Debug Mode Toggle"
        defaultChecked={isToggled}
        onChange={handleToggleChange}
    />
    <p>{debugOn}</p>
    {currentSpeed && <p>Current speed: {(currentSpeed as any).linear.y} m/s</p>}
    {currentSpeed && <p>Current angle: {(currentSpeed as any).angular.z} rad/s</p>}
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

export default PID;
