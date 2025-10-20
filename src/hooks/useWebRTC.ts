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
  ],
};

export function useWebRTC(roomId: string, userId: string, username: string) {
  const [peers, setPeers] = useState<Map<string, Peer>>(new Map());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileTransfers, setFileTransfers] = useState<FileTransfer[]>([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const peersRef = useRef<Map<string, Peer>>(new Map());

  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

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
        channelRef.current.send({
          type: 'broadcast',
          payload: {
            type: 'ice-candidate',
            candidate: event.candidate,
            from: userId,
            to: peerId,
          },
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setPeers((prev) => {
          const newPeers = new Map(prev);
          newPeers.delete(peerId);
          return newPeers;
        });
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
      setFileTransfers((prev) =>
        prev.map((ft) =>
          ft.id === fileId ? { ...ft, status: 'completed', progress: 100 } : ft
        )
      );
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
          const pc = createPeerConnection(newUserId, true);

          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              channel.send({
                type: 'broadcast',
                payload: {
                  type: 'offer',
                  offer: pc.localDescription,
                  from: userId,
                  to: newUserId,
                },
              });
            });
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
      })
      .on('broadcast', { event: '*' }, ({ payload }: any) => {
        if (payload.to !== userId) return;

        const peer = peersRef.current.get(payload.from);

        if (payload.type === 'offer') {
          const pc = peer?.connection || createPeerConnection(payload.from, false);

          pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
            .then(() => pc.createAnswer())
            .then((answer) => pc.setLocalDescription(answer))
            .then(() => {
              channel.send({
                type: 'broadcast',
                payload: {
                  type: 'answer',
                  answer: pc.localDescription,
                  from: userId,
                  to: payload.from,
                },
              });
            });
        } else if (payload.type === 'answer') {
          peer?.connection.setRemoteDescription(new RTCSessionDescription(payload.answer));
        } else if (payload.type === 'ice-candidate') {
          peer?.connection.addIceCandidate(new RTCIceCandidate(payload.candidate));
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
