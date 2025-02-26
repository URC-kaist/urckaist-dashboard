import React from 'react';
import ROSLIB from 'roslib';
import { useROS } from 'ROSContext';

const Misc: React.FC = () => {
  const { ros } = useROS();

  const handleLedOff = () => {
    const ledTopic = new ROSLIB.Topic({
      ros: ros as ROSLIB.Ros,
      name: "/led_state",
      messageType: "std_msgs/String",
    })
    const message = new ROSLIB.Message({
      data: "0",
    });
    ledTopic.publish(message);
  }

  const handleLedRed = () => {
    const ledTopic = new ROSLIB.Topic({
      ros: ros as ROSLIB.Ros,
      name: "/led_state",
      messageType: "std_msgs/String",
    })
    const message = new ROSLIB.Message({
      data: "1",
    });
    ledTopic.publish(message);
  }

  const handleLedBlue = () => {
    const ledTopic = new ROSLIB.Topic({
      ros: ros as ROSLIB.Ros,
      name: "/led_state",
      messageType: "std_msgs/String",
    })
    const message = new ROSLIB.Message({
      data: "2",
    });
    ledTopic.publish(message);
  }

  const handleLedGreen = () => {
    const ledTopic = new ROSLIB.Topic({
      ros: ros as ROSLIB.Ros,
      name: "/led_state",
      messageType: "std_msgs/String",
    })
    const message = new ROSLIB.Message({
      data: "3",
    });
    ledTopic.publish(message);
  }
  return <div className="misc">
    <div>
      <button onClick={handleLedOff}>LED OFF</button>
    </div>
    <div>
      <button onClick={handleLedRed}>LED RED</button>
    </div>
    <div>
      <button onClick={handleLedBlue}>LED BLUE</button>
    </div>
    <div>
      <button onClick={handleLedGreen}>LED GREEN</button>
    </div>
  </div>;
};

export default Misc;
