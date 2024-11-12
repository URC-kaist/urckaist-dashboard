import { createContext, useContext, useState, ReactNode } from 'react';
import ROSLIB from 'roslib';

// Define the type for the ROS context value
interface ROSContextType {
	ros: ROSLIB.Ros | null;
	server: string;
	loading: boolean;
	status: 'Connected' | 'Disconnected' | null;
	message: string | null;
	initializeROS: (ip: string, port: string) => void;
}

// Create the ROS context with default values
const ROSContext = createContext<ROSContextType | undefined>(undefined);

// Define props for the ROSProvider component
interface ROSProviderProps {
	children: ReactNode;
}

// ROSProvider component to manage and provide the ROS instance
export function ROSProvider({ children }: ROSProviderProps) {
	const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [status, setStatus] = useState<'Connected' | 'Disconnected' | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [server, setServer] = useState<string>('');

	// Function to initialize ROS connection
	function initializeROS(ip: string, port: string) {
		const url = `ws://${ip}:${port}`;
		setLoading(true);

		setServer(ip);

		const rosConnection = new ROSLIB.Ros({ url });

		setRos(rosConnection);

		rosConnection.on('connection', () => {
			setMessage(`Connected to ROS master: ${url}`);
			setLoading(false)
			setStatus('Connected');
		});
		rosConnection.on('error', () => {
			setMessage(`Error connecting to ROS: ${url}`);
			setLoading(false)
			setStatus('Disconnected');
		});
		rosConnection.on('close', () => {
			setMessage(`Closed connection to ROS master: ${url}`);
			setLoading(false)
			setStatus('Disconnected');
		});
	}

	return (
		<ROSContext.Provider value={{ ros, loading, server, status, message, initializeROS }}>
			{children}
		</ROSContext.Provider>
	);
}

// Custom hook for accessing the ROS context
export function useROS(): ROSContextType {
	const context = useContext(ROSContext);
	if (!context) {
		throw new Error('useROS must be used within a ROSProvider');
	}
	return context;
}
