import React from 'react';
import PropTypes from 'prop-types';

const Room = (props) => {
  const { locationName, letters} = props;

  return (
    <div >
            <div className="location" >You see before you, looming out of the darkness, another point of interest in your lonely journey: the {locationName}.</div>
            <p />
            <div className="room" >{letters}</div>
    </div>


  );
};

Room.propTypes = {
  letter: PropTypes.string,
};

export default Room;
