class PeerService {
  constructor() {
    if (!this.peer) {
      // this are some of the servers which are open
      // eastablishing connection with them and creating peer
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
      console.log("this.peer", this.peer);
    }
  }

  // for the requested user call,
  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer); // setting remote description (whatever the desc. came from server)
      const ans = await this.peer.createAnswer(); // create ans
      await this.peer.setLocalDescription(new RTCSessionDescription(ans)); // setting local description

      return ans;
    }
  }

  // create a new offer and return newly created offer
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer(); // creating offer
      console.log("Offer created ! ", offer);
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }
}

// creating instance object of peerService class
const newService = new PeerService();
export default newService;
