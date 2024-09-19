import React, {useState} from 'react'
import LangflowClient from './LangflowClient'

const SystemMessage = ({message}) => {
    return (
        <div className="flex justify-end">
            <div className="flex items-end w-auto bg-gray-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 md:w-auto">
                <div className="p-2">
                    <div className="text-gray-200">
                        {message}
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

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");   
    const [messages, setMessages] = useState([
        {
            message: "Hello I am ChatGPT",
            sender: "ChatGPT"
        }
    ]);

    const applicationToken = process.env.LANGFLOW_APP_TOKEN;
    const flowIdOrName = process.env.LANGFLOW_ID_OR_NAME;
    const langflowClient = new LangflowClient('http://127.0.0.1:7860',applicationToken);

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
        // const tweaks = {
        //     "File-ySsDe": {
        //       "path": "",
        //       "silent_errors": true
        //     },
        //     "SQLExecutor-2qcpx": {
        //       "add_error": false,
        //       "database_url": "postgresql://postgres:rootroot@localhost:5432/mydatabase",
        //       "include_columns": false,
        //       "passthrough": false,
        //       "table_name": "tiktok_profile_scripts_table"
        //     },
        //     "ChatInput-srwuT": {
        //       "files": "",
        //       "input_value": "let me know more about Midjourney",
        //       "sender": "User",
        //       "sender_name": "User",
        //       "session_id": "",
        //       "should_store_message": true
        //     },
        //     "Chroma-msosC": {
        //       "allow_duplicates": false,
        //       "chroma_server_cors_allow_origins": "",
        //       "chroma_server_grpc_port": null,
        //       "chroma_server_host": "",
        //       "chroma_server_http_port": null,
        //       "chroma_server_ssl_enabled": false,
        //       "collection_name": "langflow",
        //       "limit": null,
        //       "number_of_results": 2,
        //       "persist_directory": "",
        //       "search_query": "",
        //       "search_type": "Similarity"
        //     },
        //     "OpenAIEmbeddings-bPq8L": {
        //       "chunk_size": 1000,
        //       "client": "",
        //       "default_headers": {},
        //       "default_query": {},
        //       "deployment": "",
        //       "dimensions": null,
        //       "embedding_ctx_length": 1536,
        //       "max_retries": 3,
        //       "model": "text-embedding-3-small",
        //       "model_kwargs": {},
        //       "openai_api_base": "",
        //       "openai_api_key": process.env.OPENAI_KEY,
        //       "openai_api_type": "",
        //       "openai_api_version": "",
        //       "openai_organization": "",
        //       "openai_proxy": "",
        //       "request_timeout": null,
        //       "show_progress_bar": false,
        //       "skip_empty": false,
        //       "tiktoken_enable": true,
        //       "tiktoken_model_name": ""
        //     },
        //     "ParseData-BnYRw": {
        //       "table_name": "tiktok_profile_scripts_table"
        //     },
        //     "SQLExecutor-WKcpV": {
        //       "add_error": true,
        //       "database_url": "postgresql://postgres:rootroot@35.224.13.19:5432/mydatabase",
        //       "include_columns": false,
        //       "max_string_length": 1000,
        //       "passthrough": false,
        //       "query": ""
        //     },
        //     "OpenAIModel-cUBFW": {
        //       "api_key": process.env.OPENAI_KEY,
        //       "input_value": "",
        //       "json_mode": false,
        //       "max_tokens": null,
        //       "model_kwargs": {},
        //       "model_name": "gpt-3.5-turbo",
        //       "openai_api_base": "",
        //       "output_schema": {},
        //       "seed": 1,
        //       "stream": false,
        //       "system_message": "",
        //       "temperature": 0.1
        //     },
        //     "Prompt-hvhCX": {
        //       "template": "{reference}\n\n---\n\nYou are an expert social media content creator. Please generate a response in JSON format that includes the following fields:\n\n- `transcript`: A social media post based on the user's request, using the reference text as a foundation. The post should be well-organized, engaging and thoughtful. Please include around {sentences} sentences detailed explanations within the transcript to provide a comprehensive view. Feel free to incorporate additional insights or enhancements to make the post more compelling.\n- `caption`: A concise, one-sentence title for the transcript.\n- `hashtags`: A list of relevant hashtags, each starting with the `#` symbol.\n- `need_video`: A boolean value indicating whether a video is required.\n- `need_audio`: A boolean value indicating whether audio is required.\n\nEnsure that the response is in valid JSON format with no additional text or explanation.\n\n{question}",
        //       "reference": "",
        //       "sentences": "15",
        //       "question": ""
        //     },
        //     "CustomComponent-ON2ev": {
        //       "input_value": ""
        //     },
        //     "ChatOutput-jhvfM": {
        //       "data_template": "{text}",
        //       "input_value": "",
        //       "sender": "Machine",
        //       "sender_name": "AI",
        //       "session_id": "",
        //       "should_store_message": true
        //     },
        //     "LangWatchEvaluatorComponent-JvSsK": {
        //       "answer": "",
        //       "question": "",
        //       "question_id": "",
        //       "user_cpf": "",
        //       "user_email": "",
        //       "user_name": ""
        //     }
        // };
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages