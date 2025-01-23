import React, { useState, useEffect, useRef } from 'react';
import { useROS } from '../../ROSContext';
import { info } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';
import './ConnectionForm.css';

const ConnectionForm: React.FC = () => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<string>('9090');
  const [macAddress, setMacAddress] = useState<string>('');
  const [connectionMessage, setConnectionMessage] = useState<string>('');

  // We store the numeric interval ID in a ref
  const pollingIntervalRef = useRef<number | null>(null);

  const { ros, loading, status, message, initializeROS } = useROS();

  useEffect(() => {
    const storedIp = localStorage.getItem('ip');
    const storedPort = localStorage.getItem('port');
    const storedMac = localStorage.getItem('mac');
    if (storedIp) setIp(storedIp);
    if (storedPort) setPort(storedPort);
    if (storedMac) setMacAddress(storedMac);
  }, []);

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIp(e.currentTarget.value);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPort(e.currentTarget.value);
  };

  const handleMacAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMacAddress(e.currentTarget.value);
  };

  const connectRos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Close any existing ROS connection
    if (ros) {
      ros.close();
      info('ROS connection closed');
    }

    localStorage.setItem('ip', ip);
    localStorage.setItem('port', port);

    initializeROS(ip, port);
  };

  const wakeOnLan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any existing interval if user clicks "Rover Startup" again
    if (pollingIntervalRef.current !== null) {
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Give user immediate feedback
    setConnectionMessage('Sending Wake-on-LAN...');

    try {
      // 1. Invoke the 'wake' command from Tauri
      await invoke('wake', { mac: macAddress });
      setConnectionMessage('Waking rover. Waiting to see if it boots...');

      // 2. Poll the IP to see when the rover is alive
      pollingIntervalRef.current = window.setInterval(async () => {
        try {
          // If the ping is successful, the rover is alive
          await invoke('ping_ip', {
            host: ip,
            timeout: 1000,
          });

          localStorage.setItem('mac', macAddress);

          setConnectionMessage('Rover is Alive!');
          // Clear the interval now that it's alive
          if (pollingIntervalRef.current !== null) {
            window.clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        } catch (err) {
          // If ping fails, it means "still booting." We can ignore or show a message.
          // console.log("Still booting...");
        }
      }, 1000); // Check every 3 seconds

    } catch (err) {
      setConnectionMessage(`Wake-on-LAN failed: ${String(err)}`);
    }
  };

  return (
    <div>
      <form onSubmit={wakeOnLan}>
        <label>
          MAC Address:
          <input
            type="text"
            value={macAddress}
            onChange={handleMacAddressChange}
            placeholder="Enter ROS Master MAC Address"
            required
          />
        </label>
        <button type="submit">Rover Startup</button>
        {connectionMessage && <div>{connectionMessage}</div>}

      </form>


      <form onSubmit={connectRos}>
        <label>
          ROS Master IP:
          <input
            type="text"
            value={ip}
            onChange={handleIpChange}
            required
          />
        </label>
        <label>
          Port:
          <input
            type="text"
            value={port}
            placeholder="Enter ROS Master Server"
            onChange={handlePortChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          Connect
        </button>
        {status === null && !loading ? (
          <div />
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <div>{message}</div>
        )}
      </form>
    </div>
  );
};

export default ConnectionForm;
