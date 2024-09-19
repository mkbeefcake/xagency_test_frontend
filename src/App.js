import { useContext } from 'react';
import { TracingContext } from './TracingProvider';
import Messages from './Messages';

function App() {
  const { sharePath } = useContext(TracingContext);
  const dashboardUrl = `https://app.langwatch.ai/${sharePath}`;

  return (
    <div className="flex h-screen">
        <div className="w-2/5 bg-white dark:bg-gray-900">
            <div className="flex-grow h-screen p-2 rounded-md">
                <Messages/>
            </div>
        </div>
        <div className="flex-grow h-full p-2 bg-gray-200 rounded-md">
          <div style={{ height: '100vh', width: '100%' }}>
            <iframe
              src={sharePath === "" ? "" : dashboardUrl}
              title="LangWatch Dashboard"
              style={{ border: 'none', width: '100%', height: '100%' }}
            />
          </div>
        </div>
    </div>
  )
}

export default App;