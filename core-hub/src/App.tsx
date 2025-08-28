import './App.css'
import {RouterProvider} from "react-router-dom";
import index from './router';

function App() {
  return (
    <RouterProvider router={index} />
  )
}

export default App
