import './App.css';
import { Routes,Route } from "react-router-dom";
import { useState } from 'react';
import Login  from './components/Login/Login';
import Question from './components/Question/Question';
import Compiler from './components/Compiler/Compiler';
import AddQuestion from './components/Question/AddQuestion';
import Navbar from './components/Navbar/Navbar';
import PersistLogin from './components/PersistLogin';
// import Unauthorized from './components/Unauthorized';
import NotFound from './components/NotFound';
import { ToastContainer, toast } from 'react-toastify';
import BarChart from './components/Dashboard/BarChart';
import Dashboard from './components/Dashboard/Dashboard';


function App() {
  const [role, setRole] = useState("");

  console.log("Role in App component:", role); 
  return (
    
    <div className="App">
      <Routes>
        
        <Route element={<PersistLogin/>}> 
        <Route path='/' element={<Login/>}></Route>
        <Route path='/allquestions' element={<><Navbar setRole={setRole} role={role}/><Question roles={role}/></> }></Route>
        <Route path='/question/:id' element={<><Navbar/> <Compiler/></> }></Route>
        <Route path='/addquestion' element={ <> <Navbar/> <AddQuestion/></> }></Route>
        <Route path='/dashboard' element={ <> <Navbar/> <Dashboard/> </> }></Route>
        {/* <Route path='/unauthorized' element={<Unauthorized/>}></Route> */}
        </Route> 
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
