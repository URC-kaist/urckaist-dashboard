import React, { useEffect, useState } from 'react';
import { useROS } from './ROSContext';
import VideoStream from './VideoStream';
import { invoke } from '@tauri-apps/api/core';
import './Dashboard.css';
import Logs from './Logs';
import Controller from './Controller';
import ROSLIB from 'roslib';

const Dashboard: React.FC = () => {
  const { ros } = useROS();

  const [topics, setTopics] = useState<Map<string, string>>(new Map());
  const [nodes, setNodes] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [messages, setMessages] = useState<Map<string, any>>(new Map());

  // Helper to compare two Maps so we only update if topics truly changed.
  const areMapsEqual = (a: Map<string, string>, b: Map<string, string>): boolean => {
    if (a.size !== b.size) return false;
    for (const [key, val] of a.entries()) {
      if (!b.has(key) || b.get(key) !== val) return false;
    }
    return true;
  };

  const updateTopics = () => {
    ros?.getTopics((result) => {
      const newMap = new Map<string, string>();

      for (let i = 0; i < result.topics.length; i++) {
        const topicName = result.topics[i];
        // Ignore /rosout if desired
        if (topicName === '/rosout') continue;

        newMap.set(topicName, result.types[i]);
      }

      // Only set topics if it truly changed (avoid redundant updates)
      setTopics((prev) => {
        if (areMapsEqual(prev, newMap)) {
          return prev;
        }
        return newMap;
      });
    });
  };

  const updateServices = () => {
    ros?.getServices((result) => setServices(result));
  };

  const updateNodes = () => {
    ros?.getNodes((result) => setNodes(result));
  };

  useEffect(() => {
    updateTopics();
    updateServices();
    updateNodes();

    const intervalId = setInterval(() => {
      updateTopics();
      updateServices();
      updateNodes();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [ros]);

  // Subscribe to each topic to get its latest message content
  useEffect(() => {
    if (!ros || topics.size === 0) return;

    const subscriptions: ROSLIB.Topic[] = [];

    // For each topic in the map, create a subscription
    topics.forEach((type, topic) => {
      const subscriber = new ROSLIB.Topic({
        ros,
        name: topic,
        messageType: type,
      });

      subscriber.subscribe((message) => {
        setMessages((prev) => {
          const updated = new Map(prev);
          updated.set(topic, message);
          return updated;
        });
      });

      subscriptions.push(subscriber);
    });

    // Cleanup: unsubscribe when the component unmounts or topics change
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [ros, topics]);

  // This function renders a nested list recursively
  const renderMessage = (data: any): React.ReactNode => {
    // If it's an array, iterate over each item
    if (Array.isArray(data)) {
      return (
        <ul style={{ marginLeft: '1rem' }}>
          {data.map((val, i) => (
            <li key={i}>{renderMessage(val)}</li>
          ))}
        </ul>
      );
    }

    // If it's an object, iterate over each [key, value]
    if (data && typeof data === 'object') {
      return (
        <ul style={{ marginLeft: '1rem' }}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderMessage(value)}
            </li>
          ))}
        </ul>
      );
    }

    // Otherwise, it's a primitive (string, number, boolean, null, etc.)
    return String(data);
  };

  return (
    <section className="dashboard-main">
      <aside className="dashboard-sidebar">
        <h2>System Info</h2>
        <NetworkPing />
        <h3>Nodes</h3>
        <ul>
          {nodes.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ul>
        <h3>Services</h3>
        <ul>
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </aside>

      <main className="dashboard-content">
        <VideoStream topic={topics} />

        <h2>Topics</h2>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(topics.entries()).map(([topic, type]) => {
              const msgData = messages.get(topic);

              return (
                <tr key={topic}>
                  <td>{topic}</td>
                  <td>{type}</td>
                  <td>
                    {msgData ? renderMessage(msgData) : 'No message yet'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      <aside className="dashboard-control">
        <Controller />
        <Logs />
      </aside>
    </section>
  );
};

const NetworkPing: React.FC = () => {
  const { server } = useROS();
  const [ping, setPing] = useState<number | string>('N/A');

  useEffect(() => {
    const intervalId = setInterval(() => {
      invoke('ping_ip', {
        host: server,
        timeout: 1000,
      }).then((result) => {
        setPing(result as number);
      }).catch((e) => {
        setPing(e);
      })
    }, 1000);

    return () => clearInterval(intervalId);
  }, [server]);

  return <span>Network RTT: {typeof ping === 'number' ? ping + 'ms' : ping}</span>;
};

export default Dashboard;
