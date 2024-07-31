import axios from "axios";
import React, { useEffect, useState } from "react";
import { RestAPIURL } from "../../Config/Settings";
import { toast } from "react-toastify";
import { Avatar, Button, Card, Typography, Input } from "antd";
import { Link } from "react-router-dom";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@coreui/coreui/dist/css/coreui.min.css";
import Nodata from "../../Assets/Nodata.png";

const { Title } = Typography;
const { Search } = Input;

export default function EmpCards() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${RestAPIURL}/Grid/getall`);
      console.log(response.data);
      setEmployees(response.data);
    } catch (error) {
      toast.error(`Failed to fetch documents: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div>
      <Title level={4}>Employee list</Title>
      <div className="row">
        <div className="col-md-8 col-lg-8 "></div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px",marginTop:'20px', marginRight:'20px' }}>
        <Search
          placeholder="Search employees"
          value={searchQuery}
          onChange={handleSearch}
          enterButton
        />
      </div>
        </div>

      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        
        {loading ? (
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 285px)",
            }}
          >
            <CircularProgress color="success" />
          </div>
        ) : (
          <>
            {paginatedEmployees.length !== 0 ? (
              paginatedEmployees.map((employee, index) => (
                <Card key={index} style={{ width: 200, textAlign: "center" }}>
                  <Avatar
                    src={
                      employee.image
                        ? `${RestAPIURL}/personalinfos/get/${employee.employeeId}/image`
                        : null
                    }
                    size={64}
                  />
                  <Title level={5}>Id : {employee.employeeId}</Title>
                  <Title level={5}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </Title>
                  <Title level={5}>{employee.designation}</Title>
                  <Link to={`/employee/${employee.employeeId}`}>
                    <Button type="primary">View</Button>
                  </Link>
                </Card>
              ))
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <img src={Nodata} alt="no data" height={500} className="img w-500" />
              </div>
            )}
          </>
        )}
      </div>
      <Stack
        spacing={2}
     
      >
        <Pagination
           style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "20px",
            marginRight:'20px'
          }}
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="text"
          shape="circular"
        />
      </Stack>
    </div>
  );
}
