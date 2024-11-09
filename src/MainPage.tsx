import React from 'react';
import ROSConnectionForm from './ROSConnectionForm';
import Dashboard from './Dashboard';
import { useROS } from './ROSContext';

const MainPage: React.FC = () => {
	const { status } = useROS();
	if (status === 'Connected') {
		return <Dashboard />;
	}
	return <ROSConnectionForm />;
};

export default MainPage;
