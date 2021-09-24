import { Socket } from "socket.io";
import { IUserProps } from "./models/user.model";

let users: any[] = [];

const socketServer = (socket: Socket, io: any) => {
  // Connect - Disconnect
  socket.on("joinUser", (account: IUserProps) => {
    users.push({
      id: account._id,
      socketId: socket.id,
      followers: account.followers,
    });
  });

  socket.on("disconnect", () => {
    users = users.filter(user => user.socketId !== socket.id);
  });

  // Follow
  socket.on("follow", data => {
    const user = users.find(user => user.id === data.user._id);
    user && io.to(`${user.socketId}`).emit("followToClient", data);
  });

  // Unfollow
  socket.on("unfollow", data => {
    const user = users.find(user => user.id === data.user._id);
    user && io.to(`${user.socketId}`).emit("unfollowToClient", data);
  });
};

export default socketServer;
