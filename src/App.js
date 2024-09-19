import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
  ]);

  const handleChange = (event)=>{
      setInput(event.target.value)
  }

  const handleSend = async (event)=>{
      event.preventDefault()
      const newMessage = {
          message: input,
          sender: "user"
      }

      const newMessages = [...messages,newMessage];

      setMessages(newMessages);
      setInput('');
      await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    setMessages(
        [
            ...chatMessages,
            {
                message: "Hi ",
                sender: "ChatGPT"
            }
        ]
    )
  }

  return (
    <div className="container">
      <div className="response-area">
        {messages.map((message, index) => {
            return(
                <div className={message.sender==="ChatGPT" ? 'gpt-message message' : 'user-message message'}>{message.message}</div>
            );
        })}
      </div>
      <div className="prompt-area">
        <input type="text" placeholder="Send a message..." value={input} onChange={handleChange}/>
        <button className="submit" type="submit" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
