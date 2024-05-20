import './App.css';
import { Routes,Route } from "react-router-dom";

import Login  from './components/Login/Login';
import Question from './components/Question/Question';
import Compiler from './components/Compiler/Compiler';
import AddQuestion from './components/Question/AddQuestion';
import Navbar from './components/Navbar/Navbar';
import PersistLogin from './components/PersistLogin';
import Unauthorized from './components/Unauthorized';
import NotFound from './components/NotFound';
// import PersistLogin from './components/PersistLogin';

function App() {
  return (
    
    <div className="App">
      <Routes>
        
        {/* <Route element={<PersistLogin/>}> */}
        <Route element={<PersistLogin/>}> 
        <Route path='/' element={<Login/>}></Route>
        <Route path='/allquestions' element={<><Navbar/><Question/></> }></Route>
        <Route path='/question/:id' element={<><Navbar/> <Compiler/></> }></Route>
        <Route path='/addquestion' element={ <> <Navbar/> <AddQuestion/></> }></Route>
        <Route path='/unauthorized' element={<Unauthorized/>}></Route>
        </Route> 
        <Route path='*' element={<NotFound/>}></Route>

        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
