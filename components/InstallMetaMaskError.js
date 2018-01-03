import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 100,
    justifyContent: 'center',
  },
});

function InstallMetaMaskError(props) {
  const { classes, title, item, handleChange, submit } = props;

  return (
    <div className={classes.root}>
      <div>
        <Typography align={'center'} type="title" color="inherit" className={classes.flex}>
          Looks like MetaMask is not installed. Please install it.
        </Typography>
      </div>
      <div style={{ textAlign: 'center', marginTop: 50, }}>
        <Button href={'https://metamask.io'} color="primary" aria-label="add" className={classes.button} >
          <Typography type="subheading" color="inherit" className={classes.flex}>
            Install MetaMask
          </Typography>
        </Button>
      </div>
    </div>
  );
}

InstallMetaMaskError.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InstallMetaMaskError);
