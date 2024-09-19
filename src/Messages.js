import React, {useContext, useState} from 'react'
import LangflowClient from './LangflowClient'
import { TracingContext } from './TracingProvider'

const SystemMessage = ({message}) => {
    return (
        <div className="flex justify-end">
            <div className="flex items-end w-auto bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 md:w-auto">
                <div className="p-2">
                    <div className="text-gray-200">
                        {message?.split('\n').map((line, index) => (
                            <div key={index} class="pb-3">{line}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )    
}

const UserMessage = ({message}) => {
    return (
        <div className="flex items-end w-3/4">
            <img className="w-8 h-8 m-3 rounded-full" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80" alt="avatar"/>  
            <div className="p-3 bg-gray-300 dark:bg-gray-800 mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6">
                <div className="text-gray-700 dark:text-gray-200">
                    {message}
                </div>
            </div>
        </div>
    )
}

const Messages = () => {
    const { setSharePath } = useContext(TracingContext);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");   
    const [messages, setMessages] = useState([
        {
            message: "Hello I am ChatGPT",
            sender: "ChatGPT"
        }
    ]);

    const applicationToken = process.env.REACT_APP_LANGFLOW_APP_TOKEN;
    const flowIdOrName = process.env.REACT_APP_LANGFLOW_ID_OR_NAME;
    const langflowServer = process.env.REACT_APP_LANGFLOW_SERVER;
    const langflowClient = new LangflowClient(langflowServer, applicationToken);

    const handleChange = (event)=>{
        setInput(event.target.value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            handleSend(event)
        }
    }

    const handleSend = async (event)=>{
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

        setLoading(true);
        const tweaks = {
            "File-ySsDe": {},
            "SQLExecutor-2qcpx": {},
            "ChatInput-srwuT": {},
            "Chroma-msosC": {},
            "OpenAIEmbeddings-bPq8L": {},
            "ParseData-BnYRw": {},
            "SQLExecutor-WKcpV": {},
            "OpenAIModel-cUBFW": {},
            "Prompt-hvhCX": {},
            "CustomComponent-ON2ev": {},
            "ChatOutput-jhvfM": {},
            "LangWatchEvaluatorComponent-JvSsK": {}
          };
        try {
            const response = await langflowClient.runFlow(
                flowIdOrName,
                input,
                'chat',
                'chat',
                tweaks,
                false,
                (data) => console.log(data.chunk), // onUpdate
                (message) => console.log("Stream Closed:", message), // onClose
                (error) => console.log("Stream Error:", error) // onError
            );

            if (response && response.outputs) {
                const flowOutputs = response.outputs[0];
                const firstComponentOutputs = flowOutputs.outputs[0];
                const output = firstComponentOutputs.outputs.message
                const senderName = output.message.sender_name
                const path = senderName.split("&&&")[1];
                console.log(`LangWatch Tracing Share Path: ${path}`)
                setSharePath(path)
                setMessages(
                    [
                        ...chatMessages,
                        {
                            message: output.message.text,
                            sender: "ChatGPT"
                        }
                    ]
                )
            }
        } catch (error) {
            console.error('Error:', error.message);
            setMessages(
                [
                    ...chatMessages,
                    {
                        message: "Sorry, There happened the issue on my side",
                        sender: "ChatGPT"
                    }
                ]
            )
        } finally {
            setLoading(false);
        }

    }    

    return (
        <div className="flex-grow h-full flex flex-col">
            <div className="w-full h-15 p-1 bg-gray-800 dark:bg-gray-900 shadow-md rounded-xl rounded-bl-none rounded-br-none">
                <div className="flex p-2 align-middle items-center">
                    <div className="border rounded-full border-white p-1/2">
                        <img className="w-14 h-14 rounded-full" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80" alt="avatar"/>
                    </div>
                    <div className="flex-grow p-2">
                        <div className="text-md text-gray-50 font-semibold">Me </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                            <div className="text-xs text-gray-50 ml-1">
                            Online
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex-grow bg-gray-100 dark:bg-gray-900 my-2 p-2 overflow-y-auto">
                {messages.map((message, index) => {
                    if (message.sender === "ChatGPT") {
                        return (<SystemMessage message={message.message} />)
                    }
                    else {
                        return (<UserMessage message={message.message} />)
                    }
                })}                
            </div>
            <div className="h-15  p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center">
                    <div className="p-2 text-gray-600 dark:text-gray-200 ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="search-chat flex flex-grow p-2">
                        <input className="input text-gray-700 dark:text-gray-200 text-sm p-5 focus:outline-none bg-gray-100 dark:bg-gray-800  flex-grow rounded-l-md" 
                            type="text" placeholder="Type your message ..." value={input}
                            onChange={handleChange} onKeyDown={handleKeyDown} 
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200  flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages