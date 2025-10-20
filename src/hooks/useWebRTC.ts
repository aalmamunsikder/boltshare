import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface FileTransfer {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed';
  fromUserId: string;
  fromUsername: string;
  data?: ArrayBuffer; // Store the file data for downloading
  chunks?: ArrayBuffer[]; // Store file chunks for reassembly
}

export interface Peer {
  id: string;
  username: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

export function useWebRTC(roomId: string, userId: string, username: string) {
  const [peers, setPeers] = useState<Map<string, Peer>>(new Map());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileTransfers, setFileTransfers] = useState<FileTransfer[]>([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const peersRef = useRef<Map<string, Peer>>(new Map());
  const signalingStatesRef = useRef<Map<string, 'idle' | 'offer' | 'answer' | 'connected'>>(new Map());
  const iceCandidatesRef = useRef<Map<string, RTCIceCandidate[]>>(new Map());

  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  const processBufferedIceCandidates = useCallback((peerId: string, pc: RTCPeerConnection) => {
    const bufferedCandidates = iceCandidatesRef.current.get(peerId);
    if (bufferedCandidates && bufferedCandidates.length > 0) {
      console.log(`Processing ${bufferedCandidates.length} buffered ICE candidates for ${peerId}`);
      bufferedCandidates.forEach((candidate) => {
        pc.addIceCandidate(candidate)
          .then(() => {
            console.log(`Successfully added buffered ICE candidate for ${peerId}`);
          })
          .catch((error) => {
            console.error(`Failed to add buffered ICE candidate for ${peerId}:`, error);
          });
      });
      iceCandidatesRef.current.delete(peerId);
    }
  }, []);

  const setupDataChannel = useCallback((channel: RTCDataChannel, peerId: string) => {
    channel.onopen = () => {
      console.log(`Data channel opened with peer ${peerId}`);
      setConnected(true);
    };

    channel.onclose = () => {
      console.log(`Data channel closed with peer ${peerId}`);
    };

    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat') {
          setMessages((prev) => [...prev, {
            id: crypto.randomUUID(),
            userId: data.userId,
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
          }]);
        } else if (data.type === 'file-offer') {
          setFileTransfers((prev) => [...prev, {
            id: data.id,
            name: data.name,
            size: data.size,
            progress: 0,
            status: 'pending',
            fromUserId: data.fromUserId,
            fromUsername: data.fromUsername,
          }]);
        } else if (data.type === 'file-data') {
          setFileTransfers((prev) =>
            prev.map((ft) =>
              ft.id === data.id
                ? { ...ft, data: data.data, status: 'completed', progress: 100 }
                : ft
            )
          );
        } else if (data.type === 'file-chunk') {
          // Handle file chunks for reassembly
          setFileTransfers((prev) =>
            prev.map((ft) => {
              if (ft.id === data.id) {
                // Initialize chunks array if not exists
                if (!ft.chunks) {
                  ft.chunks = new Array(data.totalChunks);
                }
                
                // Store the chunk
                ft.chunks[data.chunkIndex] = data.data;
                
                // Check if all chunks received
                const receivedChunks = ft.chunks.filter(chunk => chunk !== undefined).length;
                const progress = Math.round((receivedChunks / data.totalChunks) * 100);
                
                if (receivedChunks === data.totalChunks) {
                  // Reassemble the file
                  const totalLength = ft.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
                  const reassembled = new Uint8Array(totalLength);
                  let offset = 0;
                  
                  for (const chunk of ft.chunks) {
                    reassembled.set(new Uint8Array(chunk), offset);
                    offset += chunk.byteLength;
                  }
                  
                  return { ...ft, data: reassembled.buffer, status: 'completed', progress: 100 };
                } else {
                  return { ...ft, progress };
                }
              }
              return ft;
            })
          );
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }, []);

  const createPeerConnection = useCallback((peerId: string, isInitiator: boolean) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log(`Sending ICE candidate to ${peerId}:`, event.candidate.type);
        channelRef.current.send({
          type: 'broadcast',
          payload: {
            type: 'ice-candidate',
            candidate: event.candidate,
            from: userId,
            to: peerId,
          },
        });
      } else if (!event.candidate) {
        console.log(`ICE gathering complete for ${peerId}`);
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log(`ICE gathering state for ${peerId}: ${pc.iceGatheringState}`);
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${peerId}: ${pc.iceConnectionState}`);
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        setConnected(true);
        signalingStatesRef.current.set(peerId, 'connected');
      } else if (pc.connectionState === 'failed') {
        console.log(`Connection failed with ${peerId}, attempting restart...`);
        // Attempt to restart the connection
        setTimeout(() => {
          if (pc.connectionState === 'failed') {
            pc.restartIce();
          }
        }, 1000);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
        setPeers((prev) => {
          const newPeers = new Map(prev);
          newPeers.delete(peerId);
          return newPeers;
        });
        signalingStatesRef.current.delete(peerId);
        iceCandidatesRef.current.delete(peerId);
      }
    };

    if (isInitiator) {
      const dataChannel = pc.createDataChannel('fileTransfer');
      setupDataChannel(dataChannel, peerId);

      setPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.set(peerId, {
          id: peerId,
          username: 'User',
          connection: pc,
          dataChannel,
        });
        return newPeers;
      });
    } else {
      pc.ondatachannel = (event) => {
        const dataChannel = event.channel;
        setupDataChannel(dataChannel, peerId);

        setPeers((prev) => {
          const peer = prev.get(peerId);
          if (peer) {
            const newPeers = new Map(prev);
            newPeers.set(peerId, { ...peer, dataChannel });
            return newPeers;
          }
          return prev;
        });
      };

      setPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.set(peerId, {
          id: peerId,
          username: 'User',
          connection: pc,
        });
        return newPeers;
      });
    }

    return pc;
  }, [userId, setupDataChannel]);

  const sendChatMessage = useCallback((message: string) => {
    const chatMessage = {
      type: 'chat',
      userId,
      username,
      message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      userId,
      username,
      message,
      timestamp: Date.now(),
    }]);

    peersRef.current.forEach((peer) => {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        peer.dataChannel.send(JSON.stringify(chatMessage));
      }
    });
  }, [userId, username]);

  const sendFile = useCallback((file: File) => {
    const fileId = crypto.randomUUID();
    const fileOffer = {
      type: 'file-offer',
      id: fileId,
      name: file.name,
      size: file.size,
      fromUserId: userId,
      fromUsername: username,
    };

    setFileTransfers((prev) => [...prev, {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'transferring',
      fromUserId: userId,
      fromUsername: username,
    }]);

    peersRef.current.forEach((peer) => {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        peer.dataChannel.send(JSON.stringify(fileOffer));
      }
    });

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      
      // Update local transfer with data
      setFileTransfers((prev) =>
        prev.map((ft) =>
          ft.id === fileId ? { ...ft, data: arrayBuffer, status: 'completed', progress: 100 } : ft
        )
      );

      // Send file data to peers
      const fileData = {
        type: 'file-data',
        id: fileId,
        data: arrayBuffer,
      };

      peersRef.current.forEach((peer) => {
        if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
          // Send in chunks to avoid message size limits
          const chunkSize = 16384; // 16KB chunks
          const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
          
          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
            const chunk = arrayBuffer.slice(start, end);
            
            const chunkData = {
              type: 'file-chunk',
              id: fileId,
              chunkIndex: i,
              totalChunks,
              data: chunk,
            };
            
            peer.dataChannel.send(JSON.stringify(chunkData));
          }
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }, [userId, username]);

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: userId } },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence sync:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);

        const newUserId = newPresences[0]?.user_id;
        if (newUserId && newUserId !== userId && !peersRef.current.has(newUserId)) {
          // Use user ID comparison to determine who should initiate the connection
          // The user with the "smaller" ID (lexicographically) will be the initiator
          const shouldInitiate = userId < newUserId;
          
          if (shouldInitiate) {
            console.log(`Initiating connection to ${newUserId}`);
          const pc = createPeerConnection(newUserId, true);
            signalingStatesRef.current.set(newUserId, 'offer');

          pc.createOffer()
              .then((offer) => {
                if (pc.signalingState === 'stable') {
                  return pc.setLocalDescription(offer);
                } else {
                  console.log('Connection state not stable, skipping offer');
                  return Promise.resolve();
                }
              })
            .then(() => {
                if (pc.localDescription) {
              channel.send({
                type: 'broadcast',
                payload: {
                  type: 'offer',
                  offer: pc.localDescription,
                  from: userId,
                  to: newUserId,
                },
              });
                }
              })
              .catch((error) => {
                console.error('Error creating offer:', error);
                signalingStatesRef.current.delete(newUserId);
            });
          } else {
            console.log(`Waiting for offer from ${newUserId}`);
            signalingStatesRef.current.set(newUserId, 'idle');
          }
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log('User left:', key);
        setPeers((prev) => {
          const newPeers = new Map(prev);
          const peer = newPeers.get(key);
          if (peer) {
            peer.connection.close();
            newPeers.delete(key);
          }
          return newPeers;
        });
        // Clean up signaling state
        signalingStatesRef.current.delete(key);
      })
      .on('broadcast', { event: '*' }, ({ payload }: any) => {
        if (payload.to !== userId) return;

        const peer = peersRef.current.get(payload.from);

        if (payload.type === 'offer') {
          const currentState = signalingStatesRef.current.get(payload.from);
          if (currentState === 'idle' || !currentState) {
            console.log(`Received offer from ${payload.from}`);
          const pc = peer?.connection || createPeerConnection(payload.from, false);
            signalingStatesRef.current.set(payload.from, 'answer');

            pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
              .then(() => {
                // Process any buffered ICE candidates
                processBufferedIceCandidates(payload.from, pc);
                
                if (pc.signalingState === 'have-remote-offer') {
                  return pc.createAnswer();
                } else {
                  console.log('Not in correct state for answer, current state:', pc.signalingState);
                  return Promise.resolve();
                }
              })
              .then((answer) => {
                if (answer) {
                  return pc.setLocalDescription(answer);
                }
                return Promise.resolve();
              })
              .then(() => {
                if (pc.localDescription) {
                  channel.send({
                    type: 'broadcast',
                    payload: {
                      type: 'answer',
                      answer: pc.localDescription,
                      from: userId,
                      to: payload.from,
                    },
                  });
                  signalingStatesRef.current.set(payload.from, 'connected');
                }
              })
              .catch((error) => {
                console.error('Error handling offer:', error);
                signalingStatesRef.current.delete(payload.from);
              });
          } else {
            console.log(`Ignoring offer from ${payload.from}, current state: ${currentState}`);
          }
        } else if (payload.type === 'answer') {
          const currentState = signalingStatesRef.current.get(payload.from);
          if (currentState === 'offer') {
            console.log(`Received answer from ${payload.from}`);
            peer?.connection.setRemoteDescription(new RTCSessionDescription(payload.answer))
              .then(() => {
                // Process any buffered ICE candidates
                processBufferedIceCandidates(payload.from, peer.connection);
                signalingStatesRef.current.set(payload.from, 'connected');
              })
              .catch((error) => {
                console.error('Error handling answer:', error);
                signalingStatesRef.current.delete(payload.from);
              });
          } else {
            console.log(`Ignoring answer from ${payload.from}, current state: ${currentState}`);
          }
        } else if (payload.type === 'ice-candidate') {
          const currentState = signalingStatesRef.current.get(payload.from);
          if (currentState && peer?.connection) {
            console.log(`Received ICE candidate from ${payload.from}:`, payload.candidate.type);
            
            // Try to add the ICE candidate immediately
            peer.connection.addIceCandidate(new RTCIceCandidate(payload.candidate))
              .then(() => {
                console.log(`Successfully added ICE candidate from ${payload.from}`);
              })
              .catch((error) => {
                console.log(`Failed to add ICE candidate immediately, buffering:`, error);
                // Buffer the candidate if it can't be added immediately
                if (!iceCandidatesRef.current.has(payload.from)) {
                  iceCandidatesRef.current.set(payload.from, []);
                }
                iceCandidatesRef.current.get(payload.from)!.push(new RTCIceCandidate(payload.candidate));
              });
          } else {
            console.log(`Buffering ICE candidate from ${payload.from}, no active connection`);
            // Buffer the candidate for later
            if (!iceCandidatesRef.current.has(payload.from)) {
              iceCandidatesRef.current.set(payload.from, []);
            }
            iceCandidatesRef.current.get(payload.from)!.push(new RTCIceCandidate(payload.candidate));
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      peersRef.current.forEach((peer) => {
        peer.connection.close();
      });
      signalingStatesRef.current.clear();
      iceCandidatesRef.current.clear();
      channel.unsubscribe();
    };
  }, [roomId, userId, username, createPeerConnection]);

  return {
    peers: Array.from(peers.values()),
    messages,
    fileTransfers,
    connected,
    sendChatMessage,
    sendFile,
  };
}
