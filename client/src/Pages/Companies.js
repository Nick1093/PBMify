import React, { useState, useEffect } from "react";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/getCompanies");
        const data = await response.json();

        console.log(data);
        setCompanies(data);
      } catch (e) {
        console.log(e);
      }
    };

    getCompanies();
  }, []);

  return (
    <>
      {companies ? (
        companies.forEach((company, index) => <p key={index}>company.name</p>)
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Companies;
