import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);
      this.state = {
      }
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
  }

  signIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  signOut() {
    this.props.firebase.auth().signOut();
  }

  render() {
    return (
      <section className="authentication">
        { this.props.user === null ? 'Guest' : this.props.user.displayName }
        <input type="button" value="Sign-In" onClick={() => this.signIn()}></input>
        <input type="button" value="Sign-Out" onClick={() => this.signOut()}></input>
      </section>
    )
  }
}

export default User;
