import React, { useState, useEffect } from 'react';
import { useROS } from './ROSContext';

const VideoStream: React.FC<{ topic: Map<string, string> }> = ({ topic }) => {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [videoTopics, setVideoTopics] = useState<string[]>([]);
  const { server } = useROS();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTopic(e.target.value);
    console.log(currentTopic);
  };

  useEffect(() => {
    const videoTopics = Array.from(topic)
      .filter(([_, type]) => type === 'sensor_msgs/msg/Image')
      .map(([topic, _]) => topic);
    setVideoTopics(videoTopics);
    setCurrentTopic(videoTopics[0]);
  }, [topic]);


  return (
    <div>
      <select onChange={onChange}>
        {videoTopics.map((topic) => (
          <option key={topic}>{topic}</option>
        ))}
      </select>
      <div className="video-container">
        {currentTopic && (
          <img src={`http://${server}:8080/stream?topic=${currentTopic}`} alt="Video Stream" />
        )}
      </div>
    </div>
  );
};



export default VideoStream;
