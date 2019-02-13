import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Button, Typography, FormControl, InputLabel, Input } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    minHeight: '500px',
    maxHeight: '100%',
    // '%root:last-child': {
    //   marginBottom: '65px',
    // }
  },
  date: {
    textAlign: 'right'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    position: 'fixed',
    left: 0,
    bottom: 0,
    // backgroundColor: '#FFF9C4',
    marginLeft: '25%',
  }
});

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: ''
    };
  }

  createMessage(e, message) {
    e.preventDefault();
    this.props.createMessage(message);
    this.setState({ newMessage: '' });
  }

  handleChange(event) {
    this.setState({ newMessage: event.target.value });
  }

  deleteMessage(e, message) {
    e.preventDefault();
    if((this.props.user !== null && this.props.user.email !== message.userEmail) && !this.props.isAdmin) {
      alert("Need to be message creator");
      return;

    } else if ((this.props.user === null && message.user !== 'Guest') && !this.props.isAdmin) {
      alert("Need to be message creator");
      return;
    }
    this.props.deleteSingleMessage(message);
  }

  formatTime(time) {
    let myDate = new Date(time);
    return myDate.toDateString() + ' @ ' + myDate.getHours() + ':' + myDate.getMinutes();
  }

  editMessage(e, message) {
    e.preventDefault();
    if((this.props.user !== null && this.props.user.email !== message.userEmail) && !this.props.isAdmin) {
      alert("Need to be message creator");
      return;

    } else if ((this.props.user === null && message.user !== 'Guest') && !this.props.isAdmin) {
      alert("Need to be messages creator");
      return;
    }
    this.props.editMessage(message);
  }

  render() {
    const {classes} = this.props;
    return (
      <Fragment>
        <List className={classes.root}>
          <Typography variant="h4" style={{marginTop: '15px', marginLeft: '10px'}}>{this.props.activeRoom}</Typography>
          {
            this.props.activeMessages.map( (message, index) =>
              <ListItem className="item" key={index}>
                <ListItemText secondary={message.content} primary={message.user} />
                <ListItemText className={classes.date} primary={this.formatTime(message.sentAt)} />
                  <Button size="small" variant="outlined" color="inherit" onClick={(e) => this.editMessage(e, message)}>Edit</Button>
                  <Button size="small" style={{marginLeft: '5px'}} variant="outlined" color="secondary" onClick={(e) => this.deleteMessage(e, message)}>Delete</Button>
              </ListItem>
            )
          }
        </List>
        {this.props.activeIndex !== '' &&
          <form className={classes.form} onSubmit={ (e, message) => this.createMessage(e, this.state.newMessage) }>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="roomname" align="center">Write message and hit enter</InputLabel>
              <Input type="text"
                id="newmessage"
                name="newmessage"
                value={this.state.newMessage}
                onChange={ (e) => this.handleChange(e) }>
              </Input>
            </FormControl>
          </form>
        }
      </Fragment>
    )
  }
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageList);
