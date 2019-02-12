import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Button, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    minHeight: '500px',
    '&root:nth-child(2)': {
      background: 'red'
    }
  },
  date: {
    // width: '100%'
    textAlign: 'right'
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
        <Typography variant="h4" style={{marginTop: '10px'}}>{this.props.activeRoom}</Typography>
        <List className={classes.root}>
          {
            this.props.activeMessages.map( (message, index) =>
              <ListItem key={index}>
                <ListItemText secondary={message.content} primary={message.user} />
                <ListItemText className={classes.date} primary={this.formatTime(message.sentAt)} />
                  <Button size="small" variant="outlined" color="inherit" onClick={(e) => this.editMessage(e, message)}>Edit</Button>
                  <Button size="small" style={{marginLeft: '5px'}} variant="outlined" color="secondary" onClick={(e) => this.deleteMessage(e, message)}>Delete</Button>
              </ListItem>
            )
          }
        </List>
        {this.props.activeIndex !== '' &&
          <form className="messageForm" onSubmit={ (e, message) => this.createMessage(e, this.state.newMessage) }>
            <input className="newMessage"
              type="text"
              placeholder="Enter your message"
              value={this.state.newMessage}
              onChange={ (e) => this.handleChange(e) }></input>
            <input className="messageSubmit" type="submit" value="Submit"></input>
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
