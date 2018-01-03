# IPFS Demo
Upload images or videos to IPFS. Play or view them, and delete them (sort of...)

![Demo](https://github.com/wrannaman/IPFS-Demo/blob/master/demo.gif)

## To Run
npm i && npm run dev

## Starting IPFS
In a separate terminal: 
`$ ipfs daemon`


## Gotchas
 - If your ipfs webui is getting 403, [try this](https://github.com/ipfs-shipyard/ipfs-webui/issues/596#issuecomment-314395014)
 - Removing files [isn't simple]( https://discuss.ipfs.io/t/can-i-delete-my-content-from-the-network/301/31)
 - If you upload the same file multiple times, the hash and path are the same. So perhaps a check on upload is necessary to see if it already exists?
