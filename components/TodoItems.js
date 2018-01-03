import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import { toJS } from 'mobx'
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';


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

function TodoItems(props) {
  const { items, classes, handleToggle, deleteItem, waiting } = props;
  if (!toJS(items).length && !waiting) return (
    <Typography type={'headline'} align={'center'} style={{ marginTop: 25, }}>
      No todos yet!
    </Typography>
  )
  return (
    <List>
      {items.map((item, i) => (
        <div key={item.name + i}>
          <ListItem dense button className={classes.listItem} onClick={handleToggle(item, i)}>
            <ListItemText primary={item.name} style={item.status === 0 ? {} : { textDecoration: 'line-through' }}/>
            <ListItemSecondaryAction>
              <Checkbox
                onChange={handleToggle(item, i)}
                checked={item.status === 1}
              />
              <IconButton aria-label="Delete" onClick={deleteItem(i)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>

          </ListItem>
          <Divider light />
        </div>
      ))}
    </List>
  );
}

TodoItems.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TodoItems);
