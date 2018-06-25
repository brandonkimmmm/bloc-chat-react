import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);
      this.state = {
      }

    this.authUsersRef = this.props.firebase.database().ref('authUsers');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      if (user === null) {return}
      let isAdmin = false;
      // Check to see if signed in user is in authUsers database, make admin
      this.authUsersRef.orderByChild("email").once("value", snapshot => {
        snapshot.forEach(x => {
          if (user.email === x.val().email) {
            isAdmin = true;
          }
        })
      }).then( () => {
        if (isAdmin) {
            this.props.setAuth(true);
        }
      })
    });
  }

  signIn() {
    let query = this.authUsersRef.orderByChild("email");
    let adminPrompt = null;
    let adminCheck = false;
    let newEmail = '';
    const authCode = "helloworld";
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider ).then( (result) => {
      newEmail = result.user.email;
      query.once("value", function(snapshot) {
        snapshot.forEach(x => {
          // If signed in user's email is in authUsers database, make admin
          if (result.user.email === x.val().email) {
            adminCheck = true;
          }
        })
        // If singed in user is a new user and not in authUsers database, ask to enter admin code
        if (result.additionalUserInfo.isNewUser && !adminCheck) {
          adminPrompt = prompt("Enter Admin Code");
        }
      }).then( () => {
        // If answer is not null or a wrong password, add user to authUsers database and make admin
        if (adminPrompt === authCode) {
          this.authUsersRef.push({
            email: newEmail
          })
          this.props.setAuth(true);
        }
      })
    });
  }

  signOut() {
    this.props.setAuth(false);
    this.props.firebase.auth().signOut();
  }

  render() {
    return (
      <section className="authentication">
        <table>
          <tbody>
            <tr>
              <td>
                { this.props.user === null ? 'Guest' : this.props.user.displayName }
              </td>
              <td>
                <input type="button" value="Sign-In" onClick={() => this.signIn()}></input>
              </td>
              <td>
                <input type="button" value="Sign-Out" onClick={() => this.signOut()}></input>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }
}

export default User;
