import BlockStore from './MediaBlockStore';
import IpfsStore from './IpfsStore';

let store = null;

export function initStore (isServer) {
  if (isServer) {
    return {
      block: new BlockStore(isServer),
      ipfs: new IpfsStore(isServer),
    }
  } else {
    if (store === null) {
      store = {
        block: new BlockStore(isServer),
        ipfs: new IpfsStore(isServer),
      }
    }
    return store
  }
}
