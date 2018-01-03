# IPFS Demo
Upload images or videos to IPFS. Play or view them, and delete them (sort of...)
[![Demo](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

## To Run
npm i && npm run dev

* Need to have MetaMask installed

I was using Ganache as a local blockchain. You can configure MetaMask to connect to Ganache.

## starting rinkeby
 geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0xYourAccount"

## starting ipfs
ipfs daemon


## Gotchas
 - If your ipfs webui is getting 403, try this https://github.com/ipfs-shipyard/ipfs-webui/issues/596#issuecomment-314395014
 - Removing files isn't simple https://discuss.ipfs.io/t/can-i-delete-my-content-from-the-network/301/31
 - If you upload the same file multiple times, the hash and path are the same. So perhaps a check on upload is necessary to see if it already exists?
