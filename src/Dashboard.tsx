import React, { useEffect, useState } from 'react';
import { useROS } from './ROSContext';
import ROSLIB from 'roslib';
import { invoke } from '@tauri-apps/api/core';

const Dashboard: React.FC = () => {
	const { ros } = useROS();

	const [topics, setTopics] = useState<Map<string, string>>(new Map());
	const [nodes, setNodes] = useState<string[]>([]);
	const [messages, setMessages] = useState<ROSLIB.Message[]>([]);

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

	const updateNodes = () => {
		ros?.getNodes(
			(result) => {
				setNodes(result);
			}
		);
	};

	useEffect(() => {
		updateTopics();
		updateNodes();
		const intervalId = setInterval(() => {
			updateTopics();
			updateNodes();
		}, 1000);
		const log = new ROSLIB.Topic({
			ros: ros!,
			name: '/rosout',
			messageType: 'rcl_interfaces/msg/Log',
		});
		log.subscribe((message) => {
			console.log(message);
			setMessages((prevMessages) => [...prevMessages, message]);
		})

		return () => {
			log.unsubscribe();
			clearInterval(intervalId);
		}
	}, []);

	return <div>
		<button onClick={() => ros?.close()}>Disconnect</button>
		<NetworkPing />
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

		<table>
			<thead>
				<tr>
					<th>Node</th>
				</tr>
			</thead>
			<tbody>
				{nodes.map((node) => (
					<tr key={node}>
						<td>{node}</td>
					</tr>
				))}
			</tbody>
		</table>
		<h2>Log</h2>
		{messages.map((message) => <ROSOut key={(message as any).stamp.nanosec} message={message} />)}
	</div>;
};

const NetworkPing: React.FC = () => {
	const { server } = useROS();
	const [ping, setPing] = useState<number>(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			invoke('ping_ip', {
				ip: server,
				timeout: 1000
			}).then((result) => {
				console.log(result);
			})
		}, 1000);
		return () => {
			clearInterval(intervalId);
		}
	}, []);

	return <div>
		Network ping: {ping}
	</div>;
}

const ROSOut: React.FC<{ message: ROSLIB.Message }> = ({ message }) => {
	var level = '';
	var level_color = '';
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
	return <div>
		<span style={{ color: level_color }}>{level} </span>
		{formatTimestamp(msg.stamp.sec)} [{msg.name}] {msg.msg}
	</div>;
}

function formatTimestamp(unix_timestamp: number) {
	// multiplied by 1000 so that the argument is in milliseconds, not seconds
	var date = new Date(unix_timestamp * 1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2);
	return formattedTime
}

export default Dashboard;
