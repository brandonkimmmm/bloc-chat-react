import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';


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
      activeRoom: "room6",
      activeIndex: "-LDfGEUA_2FWPsAzBqp-"
    }
  }

  changeActiveRoom(name, key) {
    this.setState({ activeRoom: name, activeIndex: key });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Bloc Chat</h1>
        </header>
        <main>
          <RoomList firebase={ firebase } activeRoom={this.state.activeRoom} activeIndex={this.state.activeIndex} changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}/>
          <MessageList firebase={ firebase } activeRoom={this.state.activeRoom} activeIndex={this.state.activeIndex}/>
        </main>
      </div>
    );
  }
}

export default App;
