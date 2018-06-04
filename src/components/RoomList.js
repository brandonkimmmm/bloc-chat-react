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
    if(!this.state.newRoom) { return }
    let user = '';
    if(this.props.user === null) {
      user = 'Guest';
    } else {
      user = this.props.user.displayName;
    }
    this.roomsRef.push({
      name: this.state.newRoom,
      user: user
    });
  }

  handleChange(event) {
    this.setState({ newRoom: event.target.value });
  }

  handleClick(name, key) {
    this.props.changeActiveRoom(name, key);
  }

  deleteRoom(room) {
    if(this.props.user !== null && this.props.user.displayName !== room.user) {
      alert("Need to be room creator");
      return;

    } else if (this.props.user === null && room.user !== 'Guest') {
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
    if (this.props.user !== null && user !== this.props.user.displayName) {
      alert('Need to be room creator');
      return;
    } else if (this.props.user === null && user !== 'Guest') {
      alert('Need to be room creator');
      return;
    }
    let newName = prompt('Please enter new room name', '');
    if (newName === null) { return }
    if (newName.length === 0) {
      alert('Enter valid name');
      while (newName.length === 0)
      newName = prompt('Please enter new room name', '');
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
        {
          this.state.rooms.map( (room, index) =>
            <div className="room" key={index}>
              <span className="roomName" onClick={(e) => this.handleClick(room.name, room.key)}>{room.name}</span>
              <input className="renameButton" type='button' value='Rename' onClick={(e) => this.renameRoom(e, room.user, room.key)}></input>
              <input className="deleteButton" type="button" value="Delete" onClick={(e) => this.deleteRoom(room)}></input>
            </div>
          )
        }
        <form className="roomForm" onSubmit={ (e) => this.createRoom(e) }>
          <input className="newRoomName" type="text" placeholder="Enter New Room Name" value={this.state.newRoom} onChange={ (e) => this.handleChange(e) }></input>
          <input type="submit" value="Submit"></input>
        </form>
      </section>
    )
  }
}

export default RoomList;
