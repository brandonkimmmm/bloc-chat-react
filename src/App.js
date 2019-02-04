// import React, { Component } from 'react';
// import './App.css';
// import * as firebase from 'firebase';
// import RoomList from './components/RoomList';
// import MessageList from './components/MessageList';
// import User from './components/User';


// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyAxMxszluxkQnE6ccl1LwhmrG0laQYQxYs",
//   authDomain: "bloc-chat-d32ae.firebaseapp.com",
//   databaseURL: "https://bloc-chat-d32ae.firebaseio.com",
//   projectId: "bloc-chat-d32ae",
//   storageBucket: "bloc-chat-d32ae.appspot.com",
//   messagingSenderId: "170103426822"
// };
// firebase.initializeApp(config);

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       activeRoom: "Please Select Room",
//       activeIndex: '',
//       messages: [],
//       activeMessages:[],
//       user: null,
//       isAdmin: false
//     }

//     this.messagesRef = firebase.database().ref('messages');
//   }

//   componentDidMount() {
//     // Populate message array when new message is added to database
//     this.messagesRef.on('child_added', snapshot => {
//       const message = snapshot.val();
//       message.key = snapshot.key;
//       // concat new message into existing array
//       this.setState({ messages: this.state.messages.concat( message ) });
//       // if new message is added to active room, update the activeMessages array
//       if (message.roomId == this.state.activeIndex) {
//         this.setState({ activeMessages: this.state.activeMessages.concat( message ) });
//       }
//     });

//     // Update message array when message is deleted from database
//     this.messagesRef.on('child_removed', snapshot => {
//       let messageArr = this.state.messages;
//       messageArr = messageArr.filter( message => {
//         return snapshot.key !== message.key;
//       });
//       this.setState({ messages: messageArr });
//     });
//   }

//   // Change active room when new room is clicked
//   changeActiveRoom(name, key) {
//     this.setState({ activeRoom: name, activeIndex: key });
//     //select messages with the key of new, selected room and update activeMessages
//     const arr = this.state.messages.filter( message => message.roomId == key );
//     this.setState({ activeMessages: arr });
//   }

//   // Set user when someone signs in
//   setUser(user) {
//     this.setState({ user: user });
//   }

//   // Set true if the user is an authorized admin
//   setAuth(bool) {
//     this.setState({isAdmin: bool})
//   }

//   createMessage(message) {
//     // If no value is given, return from the function
//     if (!message) { return }
//     let activeUser = '';
//     let email = null;
//     // If there is no user signed in, message creator is Guest and email stays null
//     if (this.state.user === null) {
//       activeUser = 'Guest';
//     } else {
//       activeUser = this.state.user.displayName;
//       email = this.state.user.email;
//     }
//     this.messagesRef.push({
//       content: message,
//       user: activeUser,
//       userEmail: email,
//       roomId: this.state.activeIndex,
//       sentAt: firebase.database.ServerValue.TIMESTAMP
//     })
//   }

//   // Delete all messages from room when room is deleted
//   deleteRoomMessages(key) {
//     var query = this.messagesRef.orderByChild("roomId").equalTo(key);
//     // Find all messages with room key and delete from array
//     query.once("value", function(snapshot) {
//       snapshot.forEach(function(itemSnapshot) {
//           itemSnapshot.ref.remove();
//       });
//     });

//     // CLEAR MESSAGE ARRAY OF MESSAGES FROM THIS ROOM
//     let newMessages = this.state.messages;
//     newMessages = newMessages.filter( message => {
//       return message.roomId !== key;
//     })
//     this.setState({ messages: newMessages });

//     //IF ACTIVE ROOM IS DELETED, CLEAR THE ACTIVE MESSAGES
//     if(key === this.state.activeIndex) {
//       this.setState({ activeMessages: [] });
//     }
//   }

//   deleteSingleMessage(message) {
//     this.messagesRef.child(message.key).remove();

//     // UPDATE ACTIVE MESSSAGES, GET RID OF DELETED MESSAGE
//     if(message.roomId === this.state.activeIndex) {
//       let newActive = this.state.activeMessages.filter( messages => {
//         return messages.key !== message.key;
//       });
//       this.setState({ activeMessages: newActive });
//     }
//   }

//   editMessage(message) {
//     // If no user is signed in, user isn't an admin, and user email is not the same as creator's email, can't edit message
//     if ((this.state.user !== null && message.userEmail !== this.state.user.email) && !this.state.isAdmin) {
//       alert('Need to be message creator');
//       return;
//     // if user is not signed in and creator isn't a guest or user isn't an admin, can't edit message
//     } else if ((this.state.user === null && message.user !== 'Guest') && !this.state.isAdmin) {
//       alert('Need to be message creator');
//       return;
//     }

//     let editedMessage = prompt('Please edit the message.', message.content);
//     if (editedMessage === null) { return }
//     if (editedMessage.length === 0) {
//       alert('Enter valid message');
//       while (editedMessage.length === 0) {
//         editedMessage = prompt('Please edit the message.', message.content);
//         if (editedMessage === null) {return}
//         if (editedMessage.length === 0) { alert('Enter valid message')}
//       }
//     };

//     let query = this.messagesRef.orderByKey().equalTo(message.key);
//     query.once('child_added', snapshot => {
//       snapshot.ref.update({ content: editedMessage })
//     });
//     // Update message array
//     let updatedMessages = this.state.messages.map( newMessage => {
//       if (newMessage.key === message.key) {
//         newMessage.content = editedMessage;
//       }
//       return newMessage;
//     });
//     this.setState({messages: updatedMessages})
//   }

//   render() {
//     return (
//       <div className="App">
//         <section className="leftSide">
//           <h1>Bloc Chat</h1>
//           <RoomList
//             firebase={ firebase }
//             activeRoom={this.state.activeRoom}
//             activeIndex={this.state.activeIndex}
//             user={this.state.user}
//             isAdmin={this.state.isAdmin}
//             changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}
//             deleteRoomMessages={(key) => this.deleteRoomMessages(key)}
//           />
//           <User
//             firebase={ firebase }
//             user={this.state.user}
//             setUser={(user) => this.setUser(user)}
//             setAuth={(bool) => this.setAuth(bool)}
//           />
//         </section>
//         <main>
//           <MessageList
//             firebase={ firebase }
//             activeRoom={this.state.activeRoom}
//             activeIndex={this.state.activeIndex}
//             activeMessages={this.state.activeMessages}
//             user={this.state.user}
//             isAdmin={this.state.isAdmin}
//             createMessage={(message) => this.createMessage(message)}
//             deleteSingleMessage={(message) => this.deleteSingleMessage(message)}
//             editMessage={(message) => this.editMessage(message)}
//           />
//         </main>
//       </div>
//     );
//   }
// }

// export default App;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
// import { mainListItems, secondaryListItems } from './listItems';
// import SimpleLineChart from './SimpleLineChart';
// import SimpleTable from './SimpleTable';
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

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      activeRoom: "Please Select Room",
      activeIndex: '',
      messages: [],
      activeMessages:[],
      user: null,
      isAdmin: false
    }

    this.messagesRef = firebase.database().ref('messages');
  }

    componentDidMount() {
    // Populate message array when new message is added to database
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      // concat new message into existing array
      this.setState({ messages: this.state.messages.concat( message ) });
      // if new message is added to active room, update the activeMessages array
      if (message.roomId == this.state.activeIndex) {
        this.setState({ activeMessages: this.state.activeMessages.concat( message ) });
      }
    });

    // Update message array when message is deleted from database
    this.messagesRef.on('child_removed', snapshot => {
      let messageArr = this.state.messages;
      messageArr = messageArr.filter( message => {
        return snapshot.key !== message.key;
      });
      this.setState({ messages: messageArr });
    });
  }

  // Change active room when new room is clicked
  changeActiveRoom(name, key) {
    this.setState({ activeRoom: name, activeIndex: key });
    //select messages with the key of new, selected room and update activeMessages
    const arr = this.state.messages.filter( message => message.roomId == key );
    this.setState({ activeMessages: arr });
  }

  // Set user when someone signs in
  setUser(user) {
    this.setState({ user: user });
  }

  // Set true if the user is an authorized admin
  setAuth(bool) {
    this.setState({isAdmin: bool})
  }

  createMessage(message) {
    // If no value is given, return from the function
    if (!message) { return }
    let activeUser = '';
    let email = null;
    // If there is no user signed in, message creator is Guest and email stays null
    if (this.state.user === null) {
      activeUser = 'Guest';
    } else {
      activeUser = this.state.user.displayName;
      email = this.state.user.email;
    }
    this.messagesRef.push({
      content: message,
      user: activeUser,
      userEmail: email,
      roomId: this.state.activeIndex,
      sentAt: firebase.database.ServerValue.TIMESTAMP
    })
  }

  // Delete all messages from room when room is deleted
  deleteRoomMessages(key) {
    var query = this.messagesRef.orderByChild("roomId").equalTo(key);
    // Find all messages with room key and delete from array
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
    // If no user is signed in, user isn't an admin, and user email is not the same as creator's email, can't edit message
    if ((this.state.user !== null && message.userEmail !== this.state.user.email) && !this.state.isAdmin) {
      alert('Need to be message creator');
      return;
    // if user is not signed in and creator isn't a guest or user isn't an admin, can't edit message
    } else if ((this.state.user === null && message.user !== 'Guest') && !this.state.isAdmin) {
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
    // Update message array
    let updatedMessages = this.state.messages.map( newMessage => {
      if (newMessage.key === message.key) {
        newMessage.content = editedMessage;
      }
      return newMessage;
    });
    this.setState({messages: updatedMessages})
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              {/* <ChevronLeftIcon /> */}
            </IconButton>
          </div>
          <Divider />
          <List>
            <RoomList
              firebase={ firebase }
              activeRoom={this.state.activeRoom}
              activeIndex={this.state.activeIndex}
              user={this.state.user}
              isAdmin={this.state.isAdmin}
              changeActiveRoom={(name, key) => this.changeActiveRoom(name, key)}
              deleteRoomMessages={(key) => this.deleteRoomMessages(key)}
            />
          </List>
          <Divider />
          <User
            firebase={ firebase }
            user={this.state.user}
            setUser={(user) => this.setUser(user)}
            setAuth={(bool) => this.setAuth(bool)}
          />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div className={classes.tableContainer}>
            <MessageList
              firebase={ firebase }
              activeRoom={this.state.activeRoom}
              activeIndex={this.state.activeIndex}
              activeMessages={this.state.activeMessages}
              user={this.state.user}
              isAdmin={this.state.isAdmin}
              createMessage={(message) => this.createMessage(message)}
              deleteSingleMessage={(message) => this.deleteSingleMessage(message)}
              editMessage={(message) => this.editMessage(message)}
            />
          </div>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
