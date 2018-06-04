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
      activeRoom: "room1",
      activeIndex: "1",
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
        console.log(snapshot.key);
        console.log(message.key);
        return snapshot.key !== message.key;
      });
      this.setState({ messages: messageArr });
      console.log(messageArr);
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

  createMessage(e, message) {
    e.preventDefault();
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

    //IF ACTIVE ROOM IS DELETED, CLEAR THE ACTIVE MESSAGES
    if(key === this.state.activeIndex) {
      this.setState({ activeMessages: [] });
    }
  }

  deleteSingleMessage(message) {
    this.messagesRef.child(message.key).remove();
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Bloc Chat</h1>
        </header>
        <main>
          <RoomList
            firebase={ firebase }
            activeRoom={this.state.activeRoom}
            activeIndex={this.state.activeIndex}
            user={this.state.user}
            changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}
            deleteRoomMessages={(key) => this.deleteRoomMessages(key)}
          />
          <MessageList
            firebase={ firebase }
            activeRoom={this.state.activeRoom}
            activeIndex={this.state.activeIndex}
            activeMessages={this.state.activeMessages}
            user={this.state.user}
            createMessage={(e, message) => this.createMessage(e, message)}
            deleteSingleMessage={(e, message) => this.deleteSingleMessage(e, message)}
          />
          <User firebase={ firebase } user={this.state.user} setUser={(user) => this.setUser(user)} />
        </main>
      </div>
    );
  }
}

export default App;
