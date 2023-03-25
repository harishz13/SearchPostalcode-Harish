import React, { useState } from "react";
import axios from "axios";

function App() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleLookupClick = () => {
    if (pincode.length !== 6) {
      setError("Postal code should be 6 digits.");
      setData(null);
    } else {
      setLoading(true);
      setError(null);
      setData(null);
      axios .get(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((response) => {
          setLoading(false);
          const responseData = response.data;
          if (responseData && responseData.length > 0) {
            const postOfficeData = responseData[0].PostOffice;
            setData(
                postOfficeData.filter((postOffice) =>
                postOffice.Name.toLowerCase().includes(filter.toLowerCase())
              )
            );
            setData(postOfficeData);
          } else {
            setData([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error.message);
          setData(null);
        });
    }
  };

  return (
    <div>
      
      <div className="pinc">
      <label>
        <h3>Enter Pincode</h3>
        <input type="text" placeholder="Pincode" value={pincode} onChange={handlePincodeChange} />
      </label>
      <br />
      <button className="btn1" onClick={handleLookupClick}>Lookup</button>
      <br />
      </div>
      
      <br />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && data && (
        <div>
          <h2>Postal Code Details</h2>
          {data.length === 0 ? (
            <div>Couldn’t find the postal data you’re looking for…</div>
          ) : (
            <div>
            <label>
                 <b>Filter :- </b>
                 <input type="text" value={filter} onChange={handleFilterChange} />
               </label>
               <div className="users">
            
              {data.map((postOffice) => (
               
                 
                <div key={postOffice.Name}>
                  <h4>Name: {postOffice.Name}</h4>
                  <h4>Pincode: {postOffice.Pincode}</h4>
                  <h4>District :{postOffice.District}</h4>
                  <h4>State :{postOffice.State}</h4>
                </div>
                
              ))}
           
            </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
