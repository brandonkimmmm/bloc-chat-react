import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAxMxszluxkQnE6ccl1LwhmrG0laQYQxYs",
  authDomain: "bloc-chat-d32ae.firebaseapp.com",
  databaseURL: "https://bloc-chat-d32ae.firebaseio.com",
  projectId: "bloc-chat-d32ae",
  storageBucket: "bloc-chat-d32ae.appspot.com",
  messagingSenderId: "170103426822"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: "Please Select Room",
      activeIndex: '',
      messages: [],
      activeMessages:[],
      user: null,
    }

    this.messagesRef = firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
      if (message.roomId == this.state.activeIndex) {
        this.setState({ activeMessages: this.state.activeMessages.concat( message ) });
      }
    });

    this.messagesRef.on('child_removed', snapshot => {
      let messageArr = this.state.messages;
      messageArr = messageArr.filter( message => {
        return snapshot.key !== message.key;
      });
      this.setState({ messages: messageArr });
    });
  }

  changeActiveRoom(name, key) {
    this.setState({ activeRoom: name, activeIndex: key });
    const arr = this.state.messages.filter( message => message.roomId == key );
    this.setState({ activeMessages: arr });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  createMessage(message) {
    if (!message) { return }
    let activeUser = '';
    if (this.state.user === null) {
      activeUser = 'Guest';
    } else {
      activeUser = this.state.user.displayName;
    }
    this.messagesRef.push({
      content: message,
      user: activeUser,
      roomId: this.state.activeIndex,
      sentAt: firebase.database.ServerValue.TIMESTAMP
    })
  }

  deleteRoomMessages(key) {
    var query = this.messagesRef.orderByChild("roomId").equalTo(key);
    query.once("value", function(snapshot) {
       snapshot.forEach(function(itemSnapshot) {
           itemSnapshot.ref.remove();
       });
    });

    // CLEAR MESSAGE ARRAY OF MESSAGES FROM THIS ROOM
    let newMessages = this.state.messages;
    newMessages = newMessages.filter( message => {
      return message.roomId !== key;
    })
    this.setState({ messages: newMessages });

    //IF ACTIVE ROOM IS DELETED, CLEAR THE ACTIVE MESSAGES
    if(key === this.state.activeIndex) {
      this.setState({ activeMessages: [] });
    }
  }

  deleteSingleMessage(message) {
    this.messagesRef.child(message.key).remove();

    // UPDATE ACTIVE MESSSAGES, GET RID OF DELETED MESSAGE
    if(message.roomId === this.state.activeIndex) {
      let newActive = this.state.activeMessages.filter( messages => {
        return messages.key !== message.key;
      });
      this.setState({ activeMessages: newActive });
    }
  }

  editMessage(message) {
    if (this.state.user !== null && message.user !== this.state.user.displayName) {
      alert('Need to be message creator');
      return;
    } else if (this.state.user === null && message.user !== 'Guest') {
      alert('Need to be message creator');
      return;
    }

    let editedMessage = prompt('Please edit the message.', message.content);
    if (editedMessage === null) { return }
    if (editedMessage.length === 0) {
      alert('Enter valid message');
      while (editedMessage.length === 0) {
        editedMessage = prompt('Please edit the message.', message.content);
        if (editedMessage === null) {return}
        if (editedMessage.length === 0) { alert('Enter valid message')}
      }
    };

    let query = this.messagesRef.orderByKey().equalTo(message.key);
    query.once('child_added', snapshot => {
      snapshot.ref.update({ content: editedMessage })
    });
    let updatedMessages = this.state.messages.map( newMessage => {
      if (newMessage.key === message.key) {
        newMessage.content = editedMessage;
      }
      return newMessage;
    });
    this.setState({messages: updatedMessages})
  }

  render() {
    return (
      <div className="App">
        <section className="leftSide">
          <h1>Bloc Chat</h1>
          <RoomList
            firebase={ firebase }
            activeRoom={this.state.activeRoom}
            activeIndex={this.state.activeIndex}
            user={this.state.user}
            changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}
            deleteRoomMessages={(key) => this.deleteRoomMessages(key)}
          />
          <User firebase={ firebase } user={this.state.user} setUser={(user) => this.setUser(user)} />
        </section>
        <main>
          <MessageList
            firebase={ firebase }
            activeRoom={this.state.activeRoom}
            activeIndex={this.state.activeIndex}
            activeMessages={this.state.activeMessages}
            user={this.state.user}
            createMessage={(message) => this.createMessage(message)}
            deleteSingleMessage={(message) => this.deleteSingleMessage(message)}
            editMessage={(message) => this.editMessage(message)}
          />
        </main>
      </div>
    );
  }
}

export default App;
