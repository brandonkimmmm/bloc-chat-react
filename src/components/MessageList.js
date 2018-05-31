import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
      </section>
    )
  }
}

export default MessageList;
