import React from "react";
import { Link } from "react-router-dom";

export const Pagination = (nextPage, setPage) => (

  
  <div>
    <ul className="pagination pagination-lg">
      <li className="page-item disabled">
        <h4 className="page-link">&laquo; </h4>
      </li>
      <li className="page-item active">
        <Link className="page-link" >
          1
        </Link>
      </li>
      <li className="page-item">
        <Link className="page-link" >
          2
        </Link>
      </li>
      <li className="page-item">
        <Link className="page-link" >
          3
        </Link>
      </li>
      <li className="page-item">
        <Link className="page-link">
          4
        </Link>
      </li>
      <li className="page-item">
        {/* <h4 className="page-link" onClick={()=>{
          
          console.log( typeof setPage)
          
          }}>
          5
        </h4> */}
      </li>
      <li className="page-item" onClick={nextPage} >
        <Link className="page-link" >
          &raquo;
        </Link>
      </li>
    </ul>
  </div>
);

