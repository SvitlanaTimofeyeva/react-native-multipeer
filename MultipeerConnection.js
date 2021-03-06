import React, { DeviceEventEmitter, NativeModules } from 'react-native';
import { EventEmitter } from 'events';
import Peer from './Peer';
let RCTMultipeerConnectivity = NativeModules.MultipeerConnectivity;

export default class MultipeerConnection extends EventEmitter {

  constructor() {
    super();
    this._peers = {};
    this._connectedPeers = {};
    var peerFound = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityPeerFound',
      ((event) => {
        try {
          var peer = new Peer(event.peer.id, event.peer.info.name);
          this._peers[peer.id] = peer;
          this.emit('peerFound', { peer });
        } catch(err) {
          console.log(err);
        }

      }).bind(this));

    var peerLost = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityPeerLost',
      ((event) => {
        try {
          var peer = this._peers[event.peer.id];
          peer.emit('lost');
          this.emit('peerLost', { peer: { id: peer.id } });
          delete this._peers[event.peer.id];
          delete this._connectedPeers[event.peer.id];
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var peerConnected = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityPeerConnected',
      ((event) => {
        try {
          if (event && event.peer && this._peers[event.peer.id]) {
            this._peers[event.peer.id].emit('connected');
            this._connectedPeers[event.peer.id] = this._peers[event.peer.id];
          } else {
            if (event && event.peer) {
              this._peers[event.peer.id] = event.peer;
              this._connectedPeers[event.peer.id] = event.peer;
            }
          }
          this.emit('peerConnected', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var peerConnecting = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityPeerConnecting',
      ((event) => {
        try {
          this._peers[event.peer.id].emit('connecting');
          this.emit('peerConnecting', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var peerDisconnected = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityPeerDisconnected',
      ((event) => {
        try {
          if (event && event.peer && this._peers[event.peer.id]) {
            this._peers[event.peer.id].emit('disconnected');
            delete this._connectedPeers[event.peer.id];
          }
          this.emit('peerDisconnected', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var streamOpened = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityStreamOpened',
      ((event) => {
        try {
          this.emit('streamOpened', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var invited = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityInviteReceived',
      ((event) => {
        try {
          event.sender = event.sender ? this._peers[event.sender.id] : event;
          this.emit('invite', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));

    var dataReceived = DeviceEventEmitter.addListener(
      'RCTMultipeerConnectivityDataReceived',
      ((event) => {
        try {
          event.sender = event.sender ? this._peers[event.sender.id] : event;
          this.emit('data', event);
        } catch(err) {
          console.log(err);
        }
      }).bind(this));
  }

  getAllPeers() {
    return this._peers;
  }

  getConnectedPeers() {
    return this._connectedPeers;
  }

  send(recipients, data, callback) {
    if (!callback) {
      callback = () => {};
    }

    var recipientIds = recipients.map((recipient) => {
      if (recipient instanceof Peer) {
        return recipient.id;
      }
      return recipient;
    });

    RCTMultipeerConnectivity.send(recipientIds, data, callback);
  }

  broadcast(data, callback) {
    if (!callback) {
      callback = () => {};
    }
    RCTMultipeerConnectivity.broadcast(data, callback);
  }

  invite(peerId, callback) {
    if (!callback) {
      callback = () => {};
    }
    RCTMultipeerConnectivity.invite(peerId, callback);
  }

  rsvp(inviteId, accept, callback) {
    if (!callback) {
      callback = () => {};
    }
    RCTMultipeerConnectivity.rsvp(inviteId, accept, callback);
  }

  advertise(channel, info) {
    RCTMultipeerConnectivity.advertise(channel, info);
  }

  browse(channel) {
    RCTMultipeerConnectivity.browse(channel);
  }

//  createStreamForPeer(peerId, name, callback) {
//    if (!callback) {
//      callback = () => {};
//    }
//    RCTMultipeerConnectivity.createStreamForPeer(peerId, name, callback);
//  }
}
