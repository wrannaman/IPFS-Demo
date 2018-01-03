import IpfsStore from './IpfsStore';

let store = null;

export function initStore (isServer) {
  if (isServer) {
    return {
      ipfs: new IpfsStore(isServer),
    }
  } else {
    if (store === null) {
      store = {
        ipfs: new IpfsStore(isServer),
      }
    }
    return store
  }
}
