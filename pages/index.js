import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import { Provider, observer, inject } from 'mobx-react'
import { toJS } from 'mobx';

import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import Nav from '../components/Nav';
import AddItem from '../components/AddItem';
import TodoItems from '../components/TodoItems';
import GlobalSnack from '../components/GlobalSnack';
import InstallMetaMaskError from '../components/InstallMetaMaskError';
import DropZone from '../components/DropZone';
import FileDisplay from '../components/FileDisplay';

import { initStore } from '../stores'


const styles = {

};

@observer
class Index extends Component {

  static getInitialProps ({ req }) {
   const isServer = !!req
   return { isServer }
 }

  state = {
    open: false,
    waiting: true,
  };

  constructor (props) {
    super(props)
    this.store = initStore(props.isServer)
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { setWeb3 } = this.store.block;
    const { initIpfs } = this.store.ipfs;
    const ipfs = await initIpfs();
    const web3 = await setWeb3();
    setTimeout(() => this.setState({ waiting: false, e: web3 ? web3 : '' }), 500);
    this.forceUpdate();
  }

  setError = (e) => {
    this.setState({ e: e.message ? e.message : e })
    setTimeout(() => {
      this.setState({ e: '' })
    }, 3000)
  };


  render() {
    const { openUploadModal, e } = this.state;
    const { error, files } = this.store.ipfs;
    const title = 'IPFS demo';
    // if (e && e === 'Please install MetaMask') (<InstallMetaMaskError />)
    if (error && error === 'Failed to fetch') {
      return (
        <div className={this.props.classes.root}>
          <Nav title={title} />
          <Typography type={'headline'} align={'center'} style={{ marginTop: 25, }}>
            Uh oh! Looks like your IPFS node is not running or cannot be reached.
          </Typography>
        </div>
      )
    }
    return (
      <Provider store={this.store}>
        <div className={this.props.classes.root}>
          <Nav title={title} />

          <DropZone
            files={files}
            setError={this.setError}
          />

          <FileDisplay
            setError={this.setError}
            files={files}
          />

          <GlobalSnack
            autoHideDuration={6000}
            open={this.state.e ? true : false}
            type={'error'}
            message={this.state.e}
          />
        </div>
      </Provider>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
