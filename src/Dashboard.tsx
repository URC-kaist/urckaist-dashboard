import React, { useState } from 'react';
import { useROS } from './ROSContext';

const Dashboard: React.FC = () => {
	const { ros } = useROS();

	const [topics, setTopics] = useState<string[]>([]);
	const [types, setTypes] = useState<string[]>([]);

	setInterval(() => {
		ros?.getTopics(
			(result) => {
				setTopics(result.topics);
				setTypes(result.types);
			}
		);
	}, 1000);

	return <div>
		<button onClick={() => ros?.close()}>Disconnect</button>
		<div>Topics: {topics.join(', ')}</div>
		<div>Types: {types.join(', ')}</div>
	</div>;
};

export default Dashboard;
