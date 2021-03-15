const generateMessage = (user, message, room) => {
  let today = new Date();
  let hour = today.getHours();
  let minute = today.getMinutes();
  let hours = hour < 10 ? "0" + hour : hour;
  let minutes = minute < 10 ? "0" + minute : minute;
  if (hours < 12) {
    date = hours + ":" + minutes + " am";
  } else {
    date = hours + ":" + minutes + " pm";
  }

  return {
    user,
    message,
    room,
    createdAt: date,
  };
};

module.exports = {
  generateMessage,
};
