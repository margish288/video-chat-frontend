class PeerService {
  constructor() {
    if (!this.peer) {
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

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      console.log("Offer created ! ", offer);
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    }
  }
}

const newService = new PeerService();
export default newService;
