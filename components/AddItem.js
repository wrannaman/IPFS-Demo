import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

function AddItem(props) {
  const { classes, title, item, handleChange, submit } = props;

  return (
    <form className={classes.container} noValidate autoComplete="off" onSubmit={submit}>

    <div className={classes.root}>
        <div>
          <TextField
          id="item"
          label="Add something to do"
          className={classes.textField}
          value={item}
          onChange={handleChange('item')}
          margin="normal"
          />
        </div>
        <div>
          <Button fab color="primary" aria-label="add" className={classes.button} type={'submit'}>
            <AddIcon />
          </Button>
        </div>
    </div>
    </form>
  );
}

AddItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddItem);
