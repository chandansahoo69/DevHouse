// connection for client 1

//creat a peerConnection
const peerConnection = new RTCPeerConnection();

// create a data channel
const dataChannel = peerConnection.createDataChannel("bigData");

//when client2 will join the channel onopen method will fire
dataChannel.onopen = () => console.log("Channel Opened");

// when user sent the message then it show the message
dataChannel.onmessage = (e) => console.log("Message" + e.data);

// icecandidate collect all the necessary information about the current device such as how data, audio, video, ip address, network connectivity etc. will transfer to other user
// icecandidate when collect some info then it store all the information in localDescription
peerConnection.onicecandidate = (e) =>
  console.log("Ice candidate", JSON.stringify(peerConnection.localDescription));

// it's time to create a offer through which other client able to connect with the connection. client will answer the offer and return the answer to the current user then connection will established.
const offer = await peerConnection.createOffer();

//output of offer
// offer
// RTCSessionDescription {type: 'offer', sdp: 'v=0\r\no=- 7808812462933902765 2 IN IP4 127.0.0.1\r\ns…:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n'}sdp: "v=0\r\no=- 7808812462933902765 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:83oS\r\na=ice-pwd:WX3Yymgd6Aqjnu/+Pex0msPL\r\na=ice-options:trickle\r\na=fingerprint:sha-256 CA:08:E3:B4:1A:99:CF:14:F3:DD:A5:C3:42:39:15:94:33:22:DB:38:D3:D8:07:A2:6C:03:9F:91:00:CC:60:74\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"type: "offer"[[Prototype]]: RTCSessionDescription

// now current user have to store the information in localDescription
peerConnection.setLocalDescription(offer);

//this answer will come from client2 through websockets
const answer = {
  type: "answer",
  sdp: "v=0\r\no=- 7993399665523036115 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 52739 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 172.16.30.28\r\na=candidate:613854690 1 udp 2122260223 172.16.30.28 52739 typ host generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:2MVU\r\na=ice-pwd:r0N1uoQhHqv6ow2dvMY3TKpM\r\na=ice-options:trickle\r\na=fingerprint:sha-256 E9:1B:FE:E2:EE:46:11:F1:14:D9:C5:62:87:75:6B:3D:D3:0E:8B:2E:5B:86:CE:8D:A8:29:3A:B2:E4:B2:7C:38\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
};

// now we have to set the answer in the peerConnection remotely
peerConnection.setRemoteDescription(answer);

// now connection successfully initialized
//output
// VM915:1 "Channel Opened"

//send message to client2
dataChannel.send("Hello from Browser 1");

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// connection for client 2

const peerConnection = new RTCPeerConnection();

const offer = {
  type: "offer",
  sdp: "v=0\r\no=- 7808812462933902765 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 52393 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 172.16.30.28\r\na=candidate:613854690 1 udp 2122260223 172.16.30.28 52393 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:1779781906 1 tcp 1518280447 172.16.30.28 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:83oS\r\na=ice-pwd:WX3Yymgd6Aqjnu/+Pex0msPL\r\na=ice-options:trickle\r\na=fingerprint:sha-256 CA:08:E3:B4:1A:99:CF:14:F3:DD:A5:C3:42:39:15:94:33:22:DB:38:D3:D8:07:A2:6C:03:9F:91:00:CC:60:74\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n",
};

// we need the connection details of this browser to connect with the first client (main client) so we have to send the info to that browser

peerConnection.onicecandidate = () =>
  console.log("Ice candidate", JSON.stringify(peerConnection.localDescription));

//set the setRemoteDescription offer in peerConnection
await peerConnection.setRemoteDescription(offer);

let dataChannel;

//now we have to listen the datachannel to access the messages, data coming from client 1

peerConnection.ondatachannel = (e) => {
  dataChannel = e.channel;

  dataChannel.onopen = () => console.log("Channel Opened");

  dataChannel.onmessage = (e) => console.log("Message", e.data);
};

// now send the answer to client1
// so create an answer
const answer = await peerConnection.createAnswer();

// set the answer in localdescription so we can send it to client 1

await peerConnection.setLocalDescription(answer);

//send the message
dataChannel.send("Hi there, Browser 2");
