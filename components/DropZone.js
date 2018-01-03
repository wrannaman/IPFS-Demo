import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx';
import toBuffer from 'blob-to-buffer'
import { initStore } from '../stores'

import Typography from 'material-ui/Typography';

import { IMAGE_TEST, VIDEO_TEST } from '../utils';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  dropText: {
    margin: 10,
  }
});


@inject('store')
class DropZone extends Component {

  state = {
    error: ''
  }

 constructor(props) {
   super(props)
 }


  onDrop = async (acceptedFiles, rejectedFiles) => {
    const { prepareNewFiles } = this.props.store.ipfs;
    const { setError } = this.props;
    let nonAccept = 0;
    const filtered = acceptedFiles.filter(a => (IMAGE_TEST.test(a.name)) || (VIDEO_TEST.test(a.name)))
    if (filtered.length !== acceptedFiles.length) return setError('One or more of your files are invalid. Please upload png images or mp4 videos only.')
    await prepareNewFiles(acceptedFiles);
  }

  render() {
    const { classes, files } = this.props;
    return (
      <div>
        <div className={classes.wrapper}>
          <Typography align={'center'} type="title" color="inherit" className={classes.dropText}>
            Drop Images or Videos Here
          </Typography>

          <Dropzone
            onDrop={this.onDrop}
          />
        </div>
      </div>
    )
  }
}

DropZone.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DropZone);
