import "./App.css";
import { BrowserRouter as Router, Route} from "react-router-dom";
import {ListView} from './components/ListView';
import {DetailView} from './components/DetailView';


//const API = "http://127.0.0.1:5000";


//import { Pagination } from "./components/Pagination";

const App = () => {

  // const setPage = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  //   fetchDoors();
  // }

  // const nextPage = () => {
  //   setPage(currentPage+1)
  // };

  // const previousPage = () => {
  //   setPage(currentPage-1)
  // };


  return (
    //   <div className="App">
    //  
    //     <div className="Wrapper">
    //       <table className="table table-striped">
    //         <thead>
    //           <tr>
    //             <th>Address</th>
    //             <th>Name</th>
    //             <th>Last Sensor Communication</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {doors.map((door) => (
    //             <tr key={door.id}>
    //               <td>{door.address}</td>
    //               <td>{door.name}</td>
    //               <td>{door.last_communication}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    //   <button type="button" className="btn btn-primary" onClick={ ()=>{previousPage()}}>
    //     Previous Page!
    //   </button>
    //   <button type="button" className="btn btn-primary" onClick={ () => {nextPage()}}>
    //     Next Page!
    //   </button>

    //   {/* <Pagination nextPage={nextPage} setPage={setPage}/> */}
    <Router className="App">
      <Route exact path ='/' component={ListView}/>
      <Route path='/:id' component ={DetailView}/>
    </Router>
  );
}

export default App;
