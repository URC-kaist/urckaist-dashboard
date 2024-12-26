import React, { useState, useEffect } from 'react';
import { useROS } from './ROSContext';
import { info } from '@tauri-apps/plugin-log';
import './RosConnectionForm.css';

const ROSConnectionForm: React.FC = () => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<string>('9090');
  const { ros, loading, status, message, initializeROS } = useROS();

  useEffect(() => {
    const storedIp = localStorage.getItem('ip');
    const storedPort = localStorage.getItem('port');
    if (storedIp) setIp(storedIp);
    if (storedPort) setPort(storedPort);
  }, []);

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIp(e.currentTarget.value);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPort(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (ros) {
      ros.close();
      info('ROS connection closed');
    }
    localStorage.setItem('ip', ip);
    localStorage.setItem('port', port);
    e.preventDefault();
    initializeROS(ip, port);
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        ROS Master IP:
        <input
          type="text"
          value={ip}
          onChange={handleIpChange}
          placeholder="Enter ROS Master Server"
          required
        />
      </label>
      <br />
      <label>
        Port:
        <input
          type="text"
          value={port}
          onChange={handlePortChange}
          required
        />
      </label>
      <br />
      <button type="submit" disabled={loading}>Connect</button>
      {status === null && loading === false ?
        <div />
        :
        loading ?
          <div>Loading...</div>
          : <div>{message}</div>
      }
    </form>
  );
};

export default ROSConnectionForm;
