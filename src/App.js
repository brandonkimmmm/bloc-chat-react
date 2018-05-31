import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
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
      user: '',
    }

    this.messagesRef = firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.orderByChild('roomId').on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
      if (message.roomId == this.state.activeIndex) {
        this.setState({ activeMessages: this.state.activeMessages.concat( message ) });
      }
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

  render() {
    return (
      <div className="App">
        <header>
          <h1>Bloc Chat</h1>
        </header>
        <main>
          <RoomList firebase={ firebase } activeRoom={this.state.activeRoom} activeIndex={this.state.activeIndex} changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}/>
          <MessageList firebase={ firebase } activeRoom={this.state.activeRoom} activeIndex={this.state.activeIndex} activeMessages={this.state.activeMessages}/>
          <User firebase={ firebase } user={this.state.user} setUser={(user) => this.setUser(user)} />
        </main>
      </div>
    );
  }
}

export default App;
