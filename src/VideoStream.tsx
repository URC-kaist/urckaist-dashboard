import React, { useState, useEffect, useRef } from 'react';
import { useROS } from './ROSContext';

const VideoStream: React.FC<{ topic: Map<string, string> }> = ({ topic }) => {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [videoTopics, setVideoTopics] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sourceRef = useRef<HTMLSourceElement | null>(null);
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
  }, [topic]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      sourceRef.current!.src = '';
    }
    if (currentTopic) {
      const sourceElement = sourceRef.current;
      if (sourceElement) {
        sourceElement.src = `http://${server}:8080/stream?topic=${currentTopic}&type=vp8&bitrate=50000`;
      }
    }
    return () => {
      if (videoElement) {
        videoElement.src = ''; // Stop the stream on unmount
        videoElement.load();
      }
    }
  }, [currentTopic]);


  return (
    <div>
      <select onChange={onChange}>
        {videoTopics.map((topic) => (
          <option key={topic}>{topic}</option>
        ))}
      </select>
      <div className="video-container">
        {currentTopic && (
          <video controls autoPlay key={currentTopic} ref={videoRef}>
            <source type="video/webm" ref={sourceRef} />
          </video>
        )}
      </div>
    </div>
  );
};



export default VideoStream;
