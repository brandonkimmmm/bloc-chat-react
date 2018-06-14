import React, { Component } from 'react';


class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoom: "",
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ), newRoom: "" });
    });
    this.roomsRef.on('child_removed', snapshot => {
      this.setState({ rooms: this.state.rooms.filter( room => snapshot.key !== room.key )});
    })
  }

  createRoom(e) {
    e.preventDefault();
    // If user enters a blank form, ask for valid name
    if(!this.state.newRoom) {
      alert('Enter Valid Name');
      return;
    }
    // If Admin, ask if admin wants room to be private
    let password = null;
    let privateRoom = false;
    if(this.props.isAdmin) {
      privateRoom = window.confirm("Make Private?");
      if (privateRoom) {
        // Make password for new room
        password = prompt("Enter Password");
        while (password === '') {
          password = prompt("Enter Valid Password");
          // If user cancels entering password, don't make private room
          if (password === null) {
            privateRoom = false;
          }
        }
      }
    }
    // If no user is signed in, room creator is Guest.
    let user = '';
    if(this.props.user === null) {
      user = 'Guest';
    } else {
      user = this.props.user.displayName;
    }
    // Push new room into database
    let newRoomName = this.state.newRoom;
    this.roomsRef.push({
      name: newRoomName,
      user: user,
      password: password
    });
    // Get key of new created room
    let key = '';
    let newRoom = this.roomsRef.orderByChild("name").equalTo(newRoomName);
    newRoom.once('value', snapshot => {
      key = Object.keys(snapshot.val())[0];
      // If private room, make creator an authorized user
      if (privateRoom) {
        let query = this.props.firebase.database().ref('rooms/' + key + '/authUsers');
        query.push({
          email: this.props.user.email
        })
      }
    });
    // Set active room to new created room
    this.props.changeActiveRoom(this.state.newRoom, key);
  }

  handleChange(event) {
    this.setState({ newRoom: event.target.value });
  }

  handleClick(name, key) {
    let password = '';
    let isAuthUser = false;
    let authUsersArr = undefined;
    this.roomsRef.orderByKey().equalTo(key).on('value', snapshot => {
      password = Object.values(snapshot.val())[0].password;
      authUsersArr = Object.values(snapshot.val())[0].authUsers;
      if (authUsersArr !== undefined) {
        authUsersArr = Object.values(authUsersArr);
        authUsersArr.map(user => {
          if (this.props.user !== null && this.props.user.email === user.email) {
            isAuthUser = true;
          }
        })
      }
    })
    let checkPassword = '';
    if ((password !== undefined && this.props.user !== null) && !isAuthUser) {
      checkPassword = prompt("Enter Password");
      if (password === checkPassword) {
        alert("Now authorized user");
        let query = this.props.firebase.database().ref('rooms/' + key + '/authUsers');
        query.push({
          email: this.props.user.email
        })
      }
    }
    if (checkPassword === null || (password !== undefined && password !== checkPassword && !isAuthUser)) {
      if (this.props.user === null) {
        alert("Must be signed in");
        return;
      } else {
        alert("Must be an authorized user");
        return;
      }
    } else{
      this.props.changeActiveRoom(name, key);
    }
  }

  deleteRoom(room) {
    if((this.props.user !== null && this.props.user.displayName !== room.user) && !this.props.isAdmin) {
      alert("Need to be room creator");
      return;

    } else if ((this.props.user === null && room.user !== 'Guest') && !this.props.isAdmin) {
      alert("Need to be room creator");
      return;
    }
    this.props.deleteRoomMessages(room.key);
    this.roomsRef.child(room.key).remove();
    if (room.key === this.props.activeIndex) {
      this.props.changeActiveRoom('Please Select Room', '');
    }
  }

  renameRoom(e, user, key) {
    e.preventDefault();
    if ((this.props.user !== null && user !== this.props.user.displayName) && !this.props.isAdmin) {
      alert('Need to be room creator');
      return;
    } else if ((this.props.user === null && user !== 'Guest') && !this.props.isAdmin) {
      alert('Need to be room creator');
      return;
    }
    let newName = prompt('Please enter new room name', '');
    if (newName === null) { return }
    if (newName.length === 0) {
      alert('Enter valid name');
      while (newName.length === 0) {
        newName = prompt('Please enter new room name', '');
        if (newName === null) {return}
        if (newName.length === 0) { alert('Enter valid name')}
      }
    };

    let query = this.roomsRef.orderByKey().equalTo(key);
    query.once('child_added', snapshot => {
      snapshot.ref.update({ name: newName })
    });
    let updatedRooms = this.state.rooms.map( room => {
      if (room.key === key) {
        room.name = newName;
      }
      return room;
    });
    this.setState({ rooms: updatedRooms });
    if (this.props.activeIndex === key) { this.props.changeActiveRoom(newName, key) };
  }

  render() {
    return (
      <section className="roomList">
        <table className="rooms">
          <tbody>
            {
              this.state.rooms.map( (room, index) =>
                <tr className="room" key={index}>
                  <td>
                    <span className="roomName" onClick={(e) => this.handleClick(room.name, room.key)}>{room.name}</span>
                  </td>
                  <td>
                    <input className="renameButton" type='button' value='Rename' onClick={(e) => this.renameRoom(e, room.user, room.key)}></input>
                  </td>
                  <td>
                    <input className="deleteButton" type="button" value="Delete" onClick={(e) => this.deleteRoom(room)}></input>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
        <form className="roomForm" onSubmit={ (e) => this.createRoom(e) }>
          <input className="newRoomName" type="text" placeholder="Enter New Room Name" value={this.state.newRoom} onChange={ (e) => this.handleChange(e) }></input>
          <input type="submit" value="Submit"></input>
        </form>
      </section>
    )
  }
}

export default RoomList;
