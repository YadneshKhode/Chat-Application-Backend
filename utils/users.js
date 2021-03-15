const users = [];

const addUser = ({ id, username, room, displayPhoto, email }) => {
  //clean data
  // username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //validate data
  if (!username || !room) {
    return {
      error: "Username and Room are required",
    };
  }
  //check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.email === email;
  });
  //validate username
  // if (existingUser) {
  //   return {user}
  // }
  //Store
  const user = { id, username, room, displayPhoto, email };
  if (existingUser) {
    return {user}
  }
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0]; // splice returns array and we want the removed  user object so[0] splice resaves removed object in 0th index
  }
};
const removeUserFromRoom = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index].room = null;
    return;
  }
  return;
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  removeUserFromRoom
};
