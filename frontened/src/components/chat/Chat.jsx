import { useEffect, useRef, useState, useContext } from "react";
import "./Chat.scss";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import { format } from 'timeago.js';
import { SocketContext } from "../../context/SocketContext"
import { useNotificationStore } from '../../lib/notificaton';

function Chat() {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${window.location.origin}/api/chat`, { withCredentials: true });
        setChats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${window.location.origin}/api/chat/users`, { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChats();
    fetchUsers();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await axios.get(`${window.location.origin}/api/chat/${id}`, { withCredentials: true });
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }

      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartChat = async (user) => {
    try {
      const res = await axios.post(`${window.location.origin}/api/chat`, { receiverId: user.id }, { withCredentials: true });
      setChat({ ...res.data, receiver: user });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      const res = await axios.post(`${window.location.origin}/api/message/${chat.id}`, { text }, { withCredentials: true });
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await axios.put(`${window.location.origin}/api/chat/read/${chat.id}`);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {
          users?.map(user => {
            const existingChat = chats.find(c => c.userIds.includes(user.id));
            return (
              <div
                className="message"
                key={user.id}
                style={{
                  backgroundColor: existingChat && (existingChat.seenBy.includes(currentUser.id) || chat?.id === existingChat.id) ? "white" : "#fecd514e"
                }}
                onClick={() => existingChat ? handleOpenChat(existingChat.id, user) : handleStartChat(user)}
              >
                <img
                  src={user.avatar || "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                  alt=""
                />
                <span>{user.username}</span>
                <p>{existingChat ? existingChat.lastMessage : ""}</p>
              </div>
            );
          })
        }
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver?.avatar || "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                alt=""
              />
              {chat.receiver?.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat.messages.map(message => (
              <div className="chatMessage" key={message.id}
                style={{
                  alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                  textAlign: message.userId === currentUser.id ? "right" : "left"
                }}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form className="bottom" onSubmit={handleSubmit}>
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
