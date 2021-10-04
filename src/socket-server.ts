import { Socket } from "socket.io";
import { INotifyProps } from "./models/notify.model";
import { IPostProps } from "./models/post.model";
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

  // Create notify
  socket.on("createNotify", (notify: INotifyProps) => {
    const client = users.find(user => notify.recipients.includes(user.id));
    client && io.to(`${client.socketId}`).emit("createNotifyToClient", notify);
  });

  // Delete notify
  socket.on("deleteNotify", (notify: INotifyProps) => {
    const client = users.find(user => notify.recipients.includes(user.id));
    client && io.to(`${client.socketId}`).emit("deleteNotifyToClient", notify);
  });

  // Like post
  socket.on("likePost", (post: IPostProps) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter(user => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach(client => {
        io.to(`${client.socketId}`).emit("likeToClient", post);
      });
    }
  });

  // Unlike post
  socket.on("unlikePost", (post: IPostProps) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter(user => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach(client => {
        io.to(`${client.socketId}`).emit("unlikeToClient", post);
      });
    }
  });

  // Create comment
  socket.on("createComment", (post: IPostProps) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter(user => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach(client => {
        io.to(`${client.socketId}`).emit("createCommentToClient", post);
      });
    }
  });

  // Delete comment
  socket.on("deleteComment", (post: IPostProps) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter(user => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach(client => {
        io.to(`${client.socketId}`).emit("deleteCommentToClient", post);
      });
    }
  });
};

export default socketServer;
