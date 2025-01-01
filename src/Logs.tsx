import React, { useEffect, useState, useRef } from 'react';
import ROSLIB from 'roslib';
import { useROS } from './ROSContext'; // Import the ROS context
import './Logs.css'; // Import the CSS file

// Define the log levels with their properties
const LOG_LEVELS = [
  { level: 10, name: 'DEBUG', color: '#0000FF' },
  { level: 20, name: 'INFO', color: '#00FF00' },
  { level: 30, name: 'WARN', color: '#FFFF00' },
  { level: 40, name: 'ERROR', color: '#FF0000' },
  { level: 50, name: 'FATAL', color: '#FF00FF' },
];

const Logs: React.FC = () => {
  const { ros } = useROS();
  const [messages, setMessages] = useState<ROSLIB.Message[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filters, setFilters] = useState<number[]>(LOG_LEVELS.map((lvl) => lvl.level));
  const [isSettingsMinimized, setIsSettingsMinimized] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

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

  // Toggle Autoscroll
  const toggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
  };

  // Toggle individual log level filters
  const toggleFilter = (level: number) => {
    setFilters((prevFilters) =>
      prevFilters.includes(level)
        ? prevFilters.filter((lvl) => lvl !== level)
        : [...prevFilters, level]
    );
  };

  const toggleSettingsMinimized = () => {
    setIsSettingsMinimized((prev) => !prev);
  };

  // Filter messages based on selected log levels
  const filteredMessages = messages.filter((msg) => filters.includes((msg as any).level));

  return (
    <div className="logs-container">

      <div className="logs-header">
        <button
          className="minimize-button"
          onClick={toggleSettingsMinimized}
          aria-label={isSettingsMinimized ? 'Expand Filters' : 'Minimize Filters'}
        >
          {(isSettingsMinimized ? '▼' : '▲') + ' Log Settings'}
        </button>
        {!isSettingsMinimized && (
          <div className="settings-container">
            <div className="autoscroll-container">
              <label className="autoscroll-toggle">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={toggleAutoScroll}
                />
                <span className="checkbox-custom"></span>
                Autoscroll
              </label>
            </div>
            <div className="filters-container">
              <div className="filters-box">
                <div className="log-filters">
                  {LOG_LEVELS.map((lvl) => (
                    <label key={lvl.level} className="filter-toggle">
                      <input
                        type="checkbox"
                        checked={filters.includes(lvl.level)}
                        onChange={() => toggleFilter(lvl.level)}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="filter-label" style={{ color: lvl.color }}>
                        {lvl.name}
                      </span>
                    </label>
                  ))}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="log-content" ref={logContainerRef}>
        {filteredMessages.map((message, index) => (
          <LogEntry key={index} message={message} />
        ))}
      </div>
    </div >
  );
};

const LogEntry: React.FC<{ message: ROSLIB.Message }> = ({ message }) => {
  const msg = message as any;

  const logLevel = LOG_LEVELS.find((lvl) => lvl.level === msg.level) || {
    name: 'UNKNOWN',
    color: '#FFFFFF',
  };

  return (
    <div className="log-entry">
      <span className="log-level" style={{ color: logLevel.color }}>
        {logLevel.name}
      </span>{' '}
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
