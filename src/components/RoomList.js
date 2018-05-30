import React, { Component } from 'react';


class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoom: ""
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ), newRoom: "" });
    });
  }

  createRoom(e) {
    e.preventDefault();
    if (!this.state.newRoom) { return }
    this.roomsRef.push({
      name: this.state.newRoom
    });
  }

  handleChange(event) {
    this.setState({ newRoom: event.target.value });
  }

  handleClick(name, key) {
    // console.log(name.toString());
    this.props.changeActiveRoom(name, key);
  }

  render() {
    return (
      <section className="roomList">
        {
          this.state.rooms.map( (room, index) =>
            <div className="room" key={index} onClick={(e) => this.handleClick(room.name, room.key)}>
              {room.name}
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
