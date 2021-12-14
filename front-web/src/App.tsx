import './core/assets/styles/custom.scss'
import './app.scss';
import Routes from "./Routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {


    return (
      <>
        <Routes />
        <ToastContainer />
      </>
    );
}

export default App;