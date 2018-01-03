import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import Slide from 'material-ui/transitions/Slide';

const styles = theme => {
  // console.log('theme is ', theme);
  return ({
    close: {
      width: theme.spacing.unit * 4,
      height: theme.spacing.unit * 4,
    },
    error: {
      color: theme.palette.error[500]
    },
    info: {

    }
  });
}

class GlobalSnackbar extends Component {
  render() {
    const { classes, open, autoHideDuration, message, type } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={autoHideDuration || 6000}
          transition={(props) => <Slide direction="left" {...props} />}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<p id="message-id">{message}</p>}
        />
      </div>
    );
  }
}

GlobalSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GlobalSnackbar);
