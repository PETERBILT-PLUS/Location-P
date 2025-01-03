import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import myStore, { persistor } from './Configuration/store.ts';
import { Provider } from 'react-redux';
import SocketContextProvider from './Context/SocketContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={myStore}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketContextProvider>
        <ToastContainer />
        <App />
      </SocketContextProvider>
    </PersistGate>
  </Provider>,
)
