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

  render() {
    return (
      <section className="messageList">
        {this.props.activeRoom}
        {
          this.props.activeMessages.map( (message, index) =>
            <div className="message" key={index}>
              {message.content}
            </div>
          )
        }
        <form className="messageForm" onSubmit={ (e, message) => this.createMessage(e, this.state.newMessage) }>
          <input className="newMessage" type="text" placeholder="Enter your message" value={this.state.newMessage} onChange={ (e) => this.handleChange(e) }></input>
          <input type="submit" value="Submit"></input>
        </form>
      </section>
    )
  }
}

export default MessageList;
