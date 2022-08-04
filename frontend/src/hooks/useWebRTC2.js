import { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

//This is the old version of webRTC where all the function are not structurized
//which is handled in useWebRTC.js

export const useWebRTC = (roomId, user) => {
  //get all the client available in the room
  const [clients, setClients] = useStateWithCallback([]);

  //create a map to store all user info with their audios
  const audioElements = useRef({});
  /*audioElement looks like
    {   userId: instance    }
  */

  //store the peer connections
  const connections = useRef({});

  const clientsRef = useRef([]);

  //store the user video and audio
  const localMediaStream = useRef(null);
  //   console.log("media ", localMediaStream);
  //   console.log("user audio", audioElements);
  //   console.log("clients ", clients);
  /*
                updateStateFunction, callback 
        setClients((prev) => {}, (state)=>{
            //after state update
        })

        this is our custom hook with call back so first it will update the state 
        then callback fun will do its job
    */
  const socket = useRef(null);

  //when page load it will fire
  useEffect(() => {
    //initialize the socket with options
    socket.current = socketInit();
  }, []);

  //store user audio
  const provideRef = (instance, userId) => {
    //set the audio instance with userId
    audioElements.current[userId] = instance;
  };

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //if client already connected then give warning
      if (peerId in connections.current) {
        /*connections = {
                socketId: connection(webRtc object)
            }*/
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }
      //else connect the user
      connections.current[peerId] = new RTCPeerConnection({
        //iceserver is used to find the public router and send it to other user
        iceServers: freeice(),
      });

      //handle new ice candidate
      connections.current[peerId].onicecandidate = (e) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: e.candidate,
        });
      };

      //handle ontrack on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          //checking if audio player already created for the current user or not
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              //sometime it take time to render the audio so incase the
              //audio is not present then check again and again after 1s
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }

              if (settled) {
                //if the user audio is successfully set then
                //flag will set as true and it will clear this interval
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      //add local track to remote connection
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      //create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        //set the offer in localDescription
        await connections.current[peerId].setLocalDescription(offer);

        //send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    //when component unmount the lot of memory wastage happens to
    //clear all the unnecessary things we have to stop memory wastage
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  //Handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    //Clean the socket to avoid memory wastage
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  //Handle ice candidate
  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      //if sessiondescription is type of offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        //set the answer in localdescription
        connection.setLocalDescription(answer);

        //send it to other client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    //Clean the socket to avoid memory wastage
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  const addNewClient = useCallback(
    (newClient, cb) => {
      //check current client is available in the client array or not
      const lookingFor = clients.find((client) => client.id === newClient.id);

      //if not present then add it to the state
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  //capture audio from mic of user
  useEffect(() => {
    const startCapture = async () => {
      //store the audio in localMediaStream
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
      // then add the user in clients when the state change callback will fire and do the stuffs
      addNewClient({ ...user, muted: true }, () => {
        //get the user audio and mute it
        const localElement = audioElements.current[user.id];
        if (localElement) {
          //why volume = 0 unless user will listen his own voice
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }

        //socket emit JOIN
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      // leaving the room
      localMediaStream.current.getTracks().forEach((track) => track.stop());

      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  //Handle remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        //close the peerId and remove the user
        connections.current[peerId].close();
      }

      //remove the connections
      delete connections.current[peerId];
      //delete the object of audio
      delete audioElements.current[peerId];
      //remove from the client list also
      setClients((list) => list.filter((client) => client.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    //Clean the socket to avoid memory wastage
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  //Listen for mute
  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });

    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      //coverting the clientsRef.current object array to id's of array and finding the index of the userId to be mute
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);

      //Copy the obj
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));

      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };
  }, []);

  //handling mute
  const handleMute = (isMute, userId) => {
    //take the first element and set audio mute and unmute
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        //mute and unmute the current user stream with the toggle value
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        //if user mute the mike then it should be reflect on other user page also
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, {
            roomId,
            userId,
          });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return { clients, provideRef, handleMute };
};
