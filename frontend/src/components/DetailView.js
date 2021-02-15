import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export const DetailView = ({
  match: {
    params: { id },
  },
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //const [refetchFlag, setRefetchFlag] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await axios(`http://127.0.0.1:5000/door/${id}`);
      console.log(result.data)
      setData(result.data);
    } catch (error) {
      setError(true)  
    }
  }, [id] );

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      return <div> ...Loading</div>;
    }
    if (error) setError(false);
    fetchData();
  }, [error, fetchData, loading]);

  const addPermission = async (id, user_id) =>{
    try {
      const response = await axios.post(`http://127.0.0.1:5000/door/${id}/${user_id}`)
      console.log('👉 Returned data:', response)
      fetchData();
    } catch (error) {
      console.log(`😱 Axios request failed: ${error}`);
    }
  }
  

  return data.map((data) => (
    <div className="container" key={id}>
      <div className="card">
        <h3 className="card-header">Door: {id} </h3>
        <div className="card-body">
          <h5 className="card-title">
            {data.street}, {data.postal_code} {data.city}
          </h5>
          <h6 className="card-subtitle text-muted">
            Installed: {data.installation_time}
          </h6>
        </div>
        <div className="card-body">
          <h6>Sensor:</h6>
          <p className="card-text">{data.sensor_uuid}</p>
        </div>
        <div className="img-container">
          <div className="card-footer text-muted">
            <h6>Last Communication: {data.last_communication}</h6>
            <h6>Last Opening: {data.last_opening}</h6>
          </div>
        </div>
        <div className="card-body">
          <Link to="/">Return to List View</Link>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <h6>Allowed Users</h6>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col" >ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>{" "}
      <div className="container">
        <div className="row justify-content-center">
          <h6>Other Users</h6>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Add Permission</th>
              </tr>
            </thead>
            <tbody>
              {data.other_users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td><button type="button" className="btn btn-success" onClick={() =>{addPermission(id, user.id)}}>Allow</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ));
};
