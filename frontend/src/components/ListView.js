import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const ListView = () => {
  const [doors, setDoors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDoors = useCallback(async () => {
    try {
      const res = await axios(`http://127.0.0.1:5000/doors/${currentPage}`);
      setDoors(res.data);
    } catch (error) {
      setError(true);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      return <div> ...Loading</div>;
    }
    if (error) setError(false);
    fetchDoors();
  }, [error, fetchDoors, loading]);

  const setPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchDoors();
  };

  const getNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= 5) {
      setCurrentPage(nextPage);
    }
  };

  const getPreviousPage = () => {
    const previousPage = currentPage - 1;
    if (previousPage > 0) {
      setCurrentPage(previousPage);
    }
  };

  return (
    <div>
      <ol className="breadcrumb">
        <li className="breadcrumb-item active">Doors List</li>
      </ol>
      <div className="Wrapper">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Name</th>
              <th scope="col">Last Sensor Communication</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {doors.map((door) => (
              <tr className="table-dark" key={door.id}>
                <td>{door.address}</td>
                <td>{door.name}</td>
                <td>{door.last_communication}</td>
                <td>
                  <Link to={`/${door.id}`}>Detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination pagination-lg justify-content-center">
          <li className="page-item">
            <h4 className="page-link" onClick={getPreviousPage}>
              &laquo;{" "}
            </h4>
          </li>
          <li className="page-item">
            <h4
              className="page-link"
              onClick={() => {
                setPage(1);
              }}
            >
              1
            </h4>
          </li>
          <li className="page-item">
            <h4
              className="page-link"
              onClick={() => {
                setPage(2);
              }}
            >
              2
            </h4>
          </li>
          <li className="page-item">
            <h4
              className="page-link"
              onClick={() => {
                setPage(3);
              }}
            >
              3
            </h4>
          </li>
          <li className="page-item">
            <h4
              className="page-link"
              onClick={() => {
                setPage(4);
              }}
            >
              4
            </h4>
          </li>
          <li className="page-item">
            <h4
              className="page-link"
              onClick={() => {
                setPage(5);
              }}
            >
              5
            </h4>
          </li>
          <li className="page-item">
            <h4 className="page-link" onClick={getNextPage}>
              &raquo;{" "}
            </h4>
          </li>
        </ul>
      </div>
    </div>
  );
};
