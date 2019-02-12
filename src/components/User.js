import React, { Component, Fragment } from 'react';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  button: {
    marginLeft: '10px'
  },
};

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

  showButton() {
    const { classes } = this.props;
    if(!this.props.user) {
      return (
        <Button className={classes.button} color="inherit" onClick={() => this.signIn()}>Sign In</Button>
      )
    } else {
      return (
        <Button className={classes.button} color="secondary" variant="contained" onClick={() => this.signOut()}>Sign Out</Button>
      )
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Typography variant="h6" color="inherit">
          { this.props.user === null ? 'Guest' : this.props.user.displayName }
        </Typography>
          {this.showButton()}
      </Fragment>
    )
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
