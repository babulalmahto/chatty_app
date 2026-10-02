import Friendship from "../models/FriendShip.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

import { getChatRoom } from "./helpers.js";
import RedisService from "../services/RedisService.js";

export const notifyConversationOnlineStatus = async (io, socket, online) => {
  try {
    const userId = socket.userId;
    const user = socket.user;

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
    });

    friendships.forEach((friendship) => {
      const isRequester =
        friendship.requester._id.toString() === userId.toString();
      const friendId = isRequester
        ? friendship.recipient._id
        : friendship.requester._id;
      console.log("emit:conversation:online-status");
      io.to(friendId.toString()).emit("conversation:online-status", {
        friendId: userId,
        username: user.username,
        online,
      });
    });
  } catch (error) {
    console.error("notifying conversation online status:", error);
  }
};

export const conversationRequest = async (io, socket, data) => {
  try {
    const userId = socket.userId;
    const user = socket.user;
    const { connectCode } = data;
    console.log(data, "newUser=====>", userId, user, connectCode);

    const friend = await User.findOne({ connectCode });
    if (!friend) {
      return socket.emit("conversation:request:error", {
        error: "Unable to find conversation",
      });
      return;
    }

    if (friend._id.toString() === userId.toString()) {
      socket.emit("conversation:request:error", {
        error: "You cannot start a conversation with yourself",
      });
      return;
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: friend._id },
        { requester: friend._id, recipient: userId },
      ],
    });
    if (existingFriendship) {
      socket.emit("conversation:request:error", {
        error: "You are already friends with this user",
      });
      return;
    }

    const friendship = await Friendship.create({
      requester: userId,
      recipient: friend._id,
    });

    const conversation = await Conversation.create({
      participants: [userId, friend._id.toString()],
    });

    socket.join(getChatRoom(userId, friend._id.toString()));

    const conversationData = {
      conversationId: conversation._id.toString(),
      lastMessage: null,
      unreadCounts: {
        [userId.toString()]: 0,
        [friend._id.toString()]: 0,
      },
    };

    io.to(userId.toString()).emit("conversation:accept", {
      ...conversationData,
      friend: {
        id: friend.id,
        fullName: friend.fullName,
        username: friend.username,
        connectCode: friend.connectCode,
        online: await RedisService.isUserOnline(friend._id.toString()),
      },
    });
    io.to(friend._id.toString()).emit("conversation:accept", {
      ...conversationData,
      friend: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        connectCode: user.connectCode,
        online: await RedisService.isUserOnline(user._id.toString()),
      },
    });
  } catch (error) {
    console.error("Error conversation:request:", error);
    socket.emit("conversation:request:error", {
      error: "Error conversation:request",
    });
  }
};
