import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: ''
    };
  }

  createMessage(e, message) {
    e.preventDefault();
    this.props.createMessage(e, message);
    this.setState({ newMessage: '' });
  }

  handleChange(event) {
    this.setState({ newMessage: event.target.value });
  }

  deleteMessage(message) {
    if(this.props.user !== null && this.props.user.displayName !== message.user) {
      alert("Need to be room creator");
      return;

    } else if (this.props.user === null && message.user !== 'Guest') {
      alert("Need to be room creator");
      return;
    }
    this.props.deleteSingleMessage(message);
  }

  formatTime(time) {
    let myDate = new Date(time);
    return myDate.toDateString() + ' @ ' + myDate.getHours() + ':' + myDate.getMinutes();
  }

  render() {
    return (
      <section className="messageList">
        {this.props.activeRoom}
        {
          this.props.activeMessages.map( (message, index) =>
            <div className="message" key={index}>
              <span className="user">{message.user}</span>
              <span className="time">{this.formatTime(message.sentAt)}</span>
              <div className="content">
                {message.content}
                <input className="deleteButton" type="button" value="Delete" onClick={(e) => this.deleteMessage(message)}></input>
              </div>
            </div>
          )
        }
        <form className="messageForm" onSubmit={ (e, message) => this.createMessage(e, this.state.newMessage) }>
          <input className="newMessage"
            type="text"
            placeholder="Enter your message"
            value={this.state.newMessage}
            onChange={ (e) => this.handleChange(e) }></input>
          <input type="submit" value="Submit"></input>
        </form>
      </section>
    )
  }
}

export default MessageList;
