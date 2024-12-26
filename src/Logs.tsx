import React, { useEffect, useState, useRef } from 'react';
import ROSLIB from 'roslib';
import { useROS } from './ROSContext'; // Import the ROS context

const Logs: React.FC = () => {
  const { ros } = useROS();
  const [messages, setMessages] = useState<ROSLIB.Message[]>([]);
  const [autoScroll, setAutoScroll] = useState(true); // Autoscroll toggle state
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference for the log container

  useEffect(() => {
    if (!ros) return;

    const log = new ROSLIB.Topic({
      ros,
      name: '/rosout',
      messageType: 'rcl_interfaces/msg/Log',
    });

    log.subscribe((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      log.unsubscribe();
    };
  }, [ros]); // Only run when the `ros` connection changes

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]); // Trigger when messages or autoscroll status changes

  const toggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
  };

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h2>Logs</h2>
        <button onClick={toggleAutoScroll}>
          {autoScroll ? 'Disable Autoscroll' : 'Enable Autoscroll'}
        </button>
      </div>
      <div className="log-content" ref={logContainerRef}>
        {messages.map((message, index) => (
          <LogEntry key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

const LogEntry: React.FC<{ message: ROSLIB.Message }> = ({ message }) => {
  let level = '';
  let level_color = '';
  const msg = message as any;

  switch (msg.level) {
    case 10:
      level = 'DEBUG';
      level_color = '#0000FF';
      break;
    case 20:
      level = 'INFO';
      level_color = '#00FF00';
      break;
    case 30:
      level = 'WARN';
      level_color = '#FFFF00';
      break;
    case 40:
      level = 'ERROR';
      level_color = '#FF0000';
      break;
    case 50:
      level = 'FATAL';
      level_color = '#FF00FF';
      break;
  }

  return (
    <div>
      <span style={{ color: level_color }}>{level} </span>
      {formatTimestamp(msg.stamp.sec)} [{msg.name}] {msg.msg}
    </div>
  );
};

function formatTimestamp(unix_timestamp: number) {
  const date = new Date(unix_timestamp * 1000);
  const hours = date.getHours();
  const minutes = '0' + date.getMinutes();
  const seconds = '0' + date.getSeconds();
  return `${hours}:${minutes.slice(-2)}:${seconds.slice(-2)}`;
}

export default Logs;
