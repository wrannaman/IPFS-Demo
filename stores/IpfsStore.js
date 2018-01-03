import { action, observable, toJS } from 'mobx'
import ipfsAPI from 'ipfs-api'
import { ipfsConfig } from '../utils';
const LOCALSTORAGE_KEY = 'MEDIA_STAMP_FILES';
let ipfs = null;

export default class IpfsStore {
  @observable initialLoad = true;
  @observable files = [];
  @observable error = '';

  constructor (isServer) {
    if (!isServer) {
      ipfs = ipfsAPI(ipfsConfig)
    }
  }

  @action
  initIpfs = () => {
    if (!ipfs) ipfs = ipfsAPI(ipfsConfig)

    if (this.initialLoad) {
      const localFiles = localStorage.getItem(LOCALSTORAGE_KEY);
      if (localFiles) {
        this.files = JSON.parse(localFiles);
      }
      ipfs.ls(``, (err, list) => {
        if (err && err.message && err.message === 'Failed to fetch') {
          this.error = err.message;
        }
      })

      this.initialLoad = false;
    }
  }

  @action
  put = (data, options) => new Promise((resolve, reject) => {
    this.initIpfs();
    const opts = {
      progress: (p) => {
        // console.log('progress is ', p);
      }
    }
    ipfs.files.add(data, opts, (err, res) => {
      if (err) return reject(err)
      return resolve(res);
    })

  })

  @action
  readAndUpload = async (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    const { put } = this;
    reader.onloadend = async () => {
      const b = new Buffer(reader.result);
      const hash = await put(b);
      f.uploaded = true;
      f.ipfs = hash[0];
      f.name = f.file.name;
      return resolve(f);
    }
    reader.readAsArrayBuffer(f.file);
  })

  @action
  prepareNewFiles = async (acceptedFiles) => {
    let _files = toJS(this.files).slice();

    acceptedFiles = acceptedFiles.map(a => {
      return {
        file: a,
        uploaded: false,
        ipfs: null,
        error: null,
      }
    })
    _files = _files.concat(acceptedFiles);

    for (let i = 0; i < _files.length; i++) {
      try {
        _files[i] = await this.readAndUpload(_files[i]);
      } catch (e) {
        _files[i].error = e.message;
      }
    }
    this.files = _files;
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(_files))

    // to avoid memory leaks, remove the object url
    // window.URL.revokeObjectURL(file.preview);
  }

  @action
  removeFile = (f, i) => new Promise((resolve, reject) => {
    const files = toJS(this.files).slice();
    files.splice(i, 1)
    try {
      ipfs.object.get(`${f.ipfs.hash}`, (err, file) => {
        if (err) return reject(err);
        try {
          // Removes the pin only, not the file, deletion is non trivial
          ipfs.pin.rm(`${f.ipfs.hash}`, (e, rm) => {
            if (e && e.message === 'not pinned') {
              this.files = files;
              localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(files))
              return reject('This file is no longer pinned.');
            }
            else if (e) return reject(e);
            this.files = files;
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(files))
            return resolve(rm);
          })
        } catch (pinRemoveError) {
          console.error("pinRemoveError ", pinRemoveError);
          return reject(pinRemoveError);
        }
      })
    } catch (objectGetError) {
      console.error('objectGetError ', objectGetError)
      return reject(objectGetError);
    }
  })

  @action
  getFiles = () => this.files;
}
