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
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
  }

  createRoom() {
    this.roomsRef.push({
      name: this.state.newRoom
    });
  }

  handleChange(event) {
    this.setState({ newRoom: event.target.value });
  }

  render() {
    return (
      <section className="roomList">
        {
          this.state.rooms.map( (room, index) =>
            <div className="room" key={index}>
              {room.name}
            </div>
          )
        }
        <form className="roomForm" onSubmit={ () => this.createRoom() }>
          <input className="newRoomName" type="text" value={this.state.newRoom} onChange={ (e) => this.handleChange(e) }></input>
          <input type="submit" value="Submit"></input>
        </form>
      </section>
    )
  }
}

export default RoomList;
