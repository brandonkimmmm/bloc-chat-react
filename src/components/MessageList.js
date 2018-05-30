import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.messagesRef = this.props.firebase.database().ref('rooms/' + this.props.activeIndex + '/messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
      console.log(message);
    });
  }

  render() {
    return (
      <section className="messageList">
        {this.props.activeRoom}
        {
          this.state.messages.map( (message, index) =>
            <div className="message" key={index}>
              {message.message}
            </div>
          )
        }
      </section>
    )
  }
}

export default MessageList;
