import React, { useEffect, useState } from 'react';
import { useROS } from './ROSContext';
import VideoStream from './VideoStream';
import ROSLIB from 'roslib';
import { invoke } from '@tauri-apps/api/core';
import './Dashboard.css';
import Logs from './Logs';

const Dashboard: React.FC = () => {
  const { ros } = useROS();

  const [topics, setTopics] = useState<Map<string, string>>(new Map());
  const [nodes, setNodes] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const updateTopics = () => {
    ros?.getTopics(
      (result) => {
        for (let i = 0; i < result.topics.length; i++) {
          setTopics((prevTopics) => {
            prevTopics.set(result.topics[i], result.types[i]);
            return new Map(prevTopics);
          });
        }
      }
    );
  };

  const updateServices = () => {
    ros?.getServices(
      (result) => {
        setServices(result);
      }
    );
  };

  const updateNodes = () => {
    ros?.getNodes(
      (result) => {
        setNodes(result);
      }
    );
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
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>ROS Dashboard</h1>
        <button onClick={() => ros?.close()}>Disconnect</button>
      </header>
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
              </tr>
            </thead>
            <tbody>
              {Array.from(topics.entries()).map(([topic, type]) => (
                <tr key={topic}>
                  <td>{topic}</td>
                  <td>{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <aside className="dashboard-logs">
          <Logs />
        </aside>
      </section>
    </div>
  );
};

const NetworkPing: React.FC = () => {
  const { server } = useROS();
  const [ping, setPing] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(server);
      invoke('ping_ip', {
        host: server,
        timeout: 1000
      }).then((result) => {
        setPing(result);
      })
    }, 1000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return <span>
    Network RTT: {ping}ms
  </span>;
}

export default Dashboard;
