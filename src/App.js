import Messages from './Messages';

function App() {
  return (
    <div className="flex h-screen">
        <div className="w-2/5 bg-white dark:bg-gray-900">
            <div className="flex-grow h-screen p-2 rounded-md">
                <Messages/>
            </div>
        </div>
        <div className="flex-grow h-full p-2 bg-gray-200 rounded-md">
          <h2 className="text-lg font-bold">LangWatch</h2>
        </div>
    </div>
  )
}

export default App;