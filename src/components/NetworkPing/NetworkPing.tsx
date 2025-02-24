import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useROS } from 'ROSContext';
import './NetworkPing.css';

const NetworkPing: React.FC = () => {
  const { server } = useROS();
  const [ping, setPing] = useState<number | string>('N/A');
  const BAD_PING_THRESHOLD = 150; // Threshold for a "bad" ping in ms

  useEffect(() => {
    const intervalId = setInterval(() => {
      invoke('ping_ip', { host: server, timeout: 1000 })
        .then((result) => setPing(result as number))
        .catch(() => setPing('Error'));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [server]);

  const getPingClass = (): string => {
    if (typeof ping !== 'number') return 'error';
    return ping > BAD_PING_THRESHOLD ? 'warning' : 'good';
  };

  return (
    <div className="network-ping">
      <span className="ping-label">Ping:</span>
      <span className={`ping-value ${getPingClass()}`}>
        {typeof ping === 'number' ? `${ping}ms` : ping}
      </span>
    </div>
  );
};

export default NetworkPing;
