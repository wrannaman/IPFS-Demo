import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx';
import { initStore } from '../stores'

import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { red } from 'material-ui/colors';
import { IMAGE_TEST, VIDEO_TEST } from '../utils';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  previewContainer: {
    marginTop: 20,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dropText: {
    margin: 10,
  },
  media: {
    height: 'auto',
    width: 'auto',
    minHeight: 200,
    minWidth: 200,
    maxWidth: 345,
  },
  card: {
    maxWidth: 345,
    margin: 20,
  },
  modalImage: {
    width: 200,
  }
});

@inject('store')
class FileDisplay extends Component {
  state = {
    open: '',
  };

 constructor(props) {
   super(props)
 }


  handleClickOpen = (name) => {
    console.log('opening ', name);
    this.setState({ open: name });
  }

  handleClose = () => {
    this.setState({ open: '' });
  }

  view = (f) => {
    console.log('vieweing ', f);
  }

  _delete = async (f, i) => {
    const { removeFile } = this.props.store.ipfs;
    const { setError } = this.props;
    try {
      const res = await removeFile(f, i);
    } catch (e) {
      setError(e);
    }
  }

  render() {
    const { getFiles } = this.props.store.ipfs;
    const { classes, files } = this.props;
    const noFiles = toJS(files).length === 0;
    if (noFiles) return null;
    return (
      <div className={classes.previewContainer}>
        <Typography align={'center'} type="title" color="inherit" className={classes.flex}>
          Image Previews
        </Typography>
        <div className={classes.imageContainer}>
          {!noFiles && files.map((f, i) =>  {
            const disabled = f.ipfs && f.ipfs.path && f.ipfs.hash ? false : true;
            const isImage = IMAGE_TEST.test(f.file.name || f.name);
            const isVideo = VIDEO_TEST.test(f.file.name || f.name)
            return (
              <div key={i}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    src={disabled ? `${f.file.preview}` : `http://localhost:8080/ipfs/${f.ipfs.path}`}
                    component={isVideo ? 'video' : 'img'}
                    autoPlay={isVideo ? true : false}
                    loop={isVideo ? true : false}
                    controls={isVideo ? true : false}
                    title={f.file.name || f.name}
                  />
                  <CardContent>
                    {f.file.name || f.name ? (<Typography type="headline" component="h2">
                      {f.file.name || f.name}
                    </Typography>) : (null)}
                    {f.uploaded ? (<Typography component="p">
                      {f.uploaded ? 'Upload Complete' : 'Not Uploaded'}
                    </Typography>) : (null)}
                    {f.error ? (<Typography component="p">
                      {f.error}
                    </Typography>) : (null)}
                  </CardContent>
                  <CardActions>
                    <Button raised dense color="primary" href={disabled ? `` : `http://localhost:8080/ipfs/${f.ipfs.path}`} target='_blank' disabled={disabled}>
                      View On IPFS
                    </Button>
                    <Button raised dense color="default" onClick={() => this.handleClickOpen(f.file.name || f.name)} disabled={disabled}>
                      View Hash
                    </Button>
                    <Button raised dense color="accent" onClick={() => this._delete(f, i)} disabled={disabled}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>

                <Dialog
                  open={this.state.open === f.file.name || this.state.open === f.name}
                  transition={Transition}
                  keepMounted
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="alert-dialog-slide-title">
                    {f.file.name || f.name}
                  </DialogTitle>
                  <DialogContent>
                    {isImage ? (<img src={disabled ? `${f.file.preview}` : `http://localhost:8080/ipfs/${f.ipfs.path}`} className={classes.modalImage}/>) : (null)}
                    {isVideo ? (<video src={disabled ? `${f.file.preview}` : `http://localhost:8080/ipfs/${f.ipfs.path}`} className={classes.modalImage}/>) : (null)}

                    <Typography component="p">
                      {f.ipfs && f.ipfs.hash ? `Hash: \n${f.ipfs.hash}` : ''}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

FileDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileDisplay);
