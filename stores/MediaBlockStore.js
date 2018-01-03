import contract from 'truffle-contract'
import MediaArtifact from '../build/contracts/Media'
import { action, observable, toJS } from 'mobx'

let web3Instance;

let setWeb3Instance = function (isServer) {
  return new Promise((resolve, reject) => {
    if (web3Instance) {
      resolve(web3Instance);
    } else {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener('load', () => {
        try {
          let web3 = window.web3
          // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider)
            web3Instance = web3
          } else {
            // Fallback to localhost if no web3 injection.
            const provider = new Web3.providers.HttpProvider('http://localhost:8545')
            web3 = new Web3(provider)
            web3Instance = web3
          }
          resolve(web3Instance);
        } catch (e) {
          console.error('eee ', e);
        }
      })
    }
  })
}

export default class MediaBlockStore {
  @observable mediaList = [];
  @observable w3 = undefined
  @observable account = '';
  @observable instance = null;
  interval = null;

  constructor (isServer) {
    if (!isServer) setWeb3Instance();
  }

  @action
  setWeb3 = async () => {
    try {
      this.w3 = await setWeb3Instance();
      // wait for an account and instance.
      // set up instance and account
      await this.getMediaContractInstance();
      // // watch for events
      // this.setMediaChangeEventWatch();
      // get initial todo items from the blockchain
      this.getInitialMediaFromBlockchain();
    } catch (e) {
      if (e.message.indexOf('Invalid JSON RPC response') !== -1) {
        return "Please install MetaMask";
      }
      return e.message;
    }
  }

  // @action setMedia = (t) => {
  //   this.todo = t;
  // }
  //
  // @action.bound setMedias = async (arr) => {
  //   try {
  //     await this.getMediaContractInstance();
  //     const { instance, account } = this
  //     this.todos = arr;
  //     console.log('setMedias account ', account);
  //     const todos = await instance.change(JSON.stringify(toJS(this.todos)), { from: account })
  //     console.log('TODOS Tx', todos)
  //     // await this.getInitialMediaFromBlockchain();
  //   } catch (e) {
  //     console.error('setMedias E ', e.message);
  //     return e.message;
  //   }
  // }

  @action
  getInitialMediaFromBlockchain = async() => {
    await this.getMediaContractInstance();
    const { instance, account } = this
    const mediaList = await instance.getMedia.call(account)
    if (mediaList) {
      return this.mediaList = JSON.parse(mediaList.toString());
    }
    console.warn('no mediaList on blockchain yet')
    return this.mediaList = [];
  }
  //
  // @action
  // addOneMedia = async (item) => {
  //   try {
  //     await this.getMediaContractInstance();
  //     const { instance, account } = this;
  //     this.todos.push(item);
  //     const todos = await instance.change(JSON.stringify(toJS(this.todos)), { from: account })
  //     // await this.getInitialMediaFromBlockchain();
  //   } catch (e) {
  //     console.error('addOneMedia E ', e);
  //     return e;
  //   }
  // }

  /* Blockchain Interfaces */
  // @action setMediaChangeEventWatch = async () => {
  //   // await this.getMediaContractInstance();
  //   // const { instance, account } = this;
  //   // console.log('instance ', instance);
  //
  // }

  @action
  getMediaContractInstance = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.getMediaContractInstance();
      }, 2000)
    }
    return new Promise((resolve, reject) => {
      const Media = contract(MediaArtifact)
      Media.setProvider(this.w3.currentProvider)
      web3Instance.eth.getAccounts((error, accounts) => {
        if (error) {
          console.error("get accounts ", error)
          return reject(error)
        }
        if (!accounts || !Array.isArray(accounts)) {
          return reject('No accounts found')
        }
        const account = accounts[0]
        Media.deployed().then((instance) => {
          if (this.account !== account) {
            this.account = account;
            this.getInitialMediaFromBlockchain();
          }
          if (!this.instance)  {
            this.instance = instance;
          }
          this.instance.MediaChange().watch(function(error, result) {
            console.log('EVENT RESULT', result)
            console.log('EVENT ERROR', error)
          });
          resolve({ instance, account })
        })
      })
    })
  }
}
