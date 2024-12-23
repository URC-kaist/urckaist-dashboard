import React, { useEffect, useRef } from 'react';
import { useROS } from './ROSContext';
import ROSLIB from 'roslib';

const WebRTCClient: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const { ros } = useROS();

  useEffect(() => {
    const webrtcOfferService = new ROSLIB.Service({
      ros: ros!,
      name: '/webrtc_sdp_offer',
      serviceType: 'webrtc_services/SDPExchange',
    });
    const configuration: RTCConfiguration = {
      iceTransportPolicy: 'all',
      iceServers: [], // No STUN or TURN servers needed for local network
      // sdpSemantics: 'unified-plan'
    };
    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;


    pc.addTransceiver('video', { direction: 'recvonly' });

    // Display the incoming video stream
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        console.log(event.streams);
        videoRef.current.play().then(() => {
          console.log('Video playback started');
        }).catch((error) => {
          console.error('Error starting video playback:', error);
        })
      }
    };

    const iceGatheringComplete = new Promise((resolve) => {
      pc.onicegatheringstatechange = (event) => {
        console.log('icegatheringstatechange -> ', pc.iceGatheringState);
        if (pc.iceGatheringState === 'complete') {
          resolve(null);
        }
      };
    });

    async function sdpExchange() {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await iceGatheringComplete;
      const new_offer = pc.localDescription;
      webrtcOfferService.callService(
        new ROSLIB.ServiceRequest({
          sdp: new_offer!.sdp,
          type: new_offer!.type,
        }),
        (response) => {
          console.log('Received SDP answer:', response);
          const answer = new RTCSessionDescription({
            sdp: response.sdp,
            type: response.type,
          });
          pc.setRemoteDescription(answer);
        }
      );
    }

    sdpExchange();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [ros]);

  return (
    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
  );
};

export default WebRTCClient;

