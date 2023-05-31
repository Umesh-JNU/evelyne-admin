import React, { useContext, useReducer, useEffect, useState } from "react";
import Chart from "react-google-charts";
import Skeleton from "react-loading-skeleton";
import { Form, Container, Card, Row, Col, ButtonGroup, Button, Nav } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { IoIosPerson, IoIosPersonAdd, IoMdPie } from "react-icons/io";
import { GiNetworkBars } from "react-icons/gi";
import { FaArrowCircleRight } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { HiDownload } from "react-icons/hi";
import { TbReportMoney } from "react-icons/tb";

import { useTitle, MessageBox, MotionDiv } from "../components";
import { getSummary } from "../states/actions";
import { Store } from "../states/store";
import { getError } from "../utils/error";
import axiosInstance from "../utils/axiosUtil";

const months = new Array(12)
  .fill().map((_, index) => new Date(0, index).toLocaleString('en', { month: 'long' }));

const years = () => {
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let year = 2023; year <= currentYear; year++) yearList.push(year);
  return yearList;
}

export default function Dashboard() {
  // const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
  //   loading: true,
  //   error: "",
  // });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("weekly");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedItem, setSelectedItem] = useState("daily");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: "FETCH_REQUEST" });
  //       const { data } = await axiosInstance.get(
  //         `/api/admin/statistics/${time}`,
  //         {
  //           headers: { Authorization: token },
  //         }
  //       );
  //       dispatch({ type: "FETCH_SUCCESS", payload: data });
  //     } catch (err) {
  //       dispatch({
  //         type: "FETCH_FAIL",
  //         payload: getError(err),
  //       });
  //       toast.error(getError(err), {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     }
  //   };
  //   fetchData();
  // }, [token, time]);

  const handleReportTime = (time) => {
    setSelectedItem(time);
    switch (time) {
      case "daily":
        setYear("");
        setMonth("");
        break;
      case "monthly":
        setYear("");
        setDate("");
        break;
      case "yearly":
        setDate("");
        setMonth("");
        break;
      default:
        setYear("");
        setMonth("");
        setDate("");
        break;
    }
  }

  const downloadPDF = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/report/?year=${year}&month=${month}&date=${date}`, 
      {
        responseType: "blob",
        headers: { Accept: "application/pdf" }
      });

      const filename = "report.pdf";
      const blobObj = new Blob([data], { type: "application/pdf" });
      const anchorlink = document.createElement("a");
      anchorlink.href = window.URL.createObjectURL(blobObj)
      anchorlink.setAttribute("download", filename);
      anchorlink.click();
    }
    catch (err) {
      setError(getError(err));
    }
  }

  useTitle("Dashboard");

  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Card>
                <Card.Header as="h5" className="card-header-primary">
                  <HiClipboardDocumentList style={{ fontSize: "2rem" }} />{" "}
                  Warehouse Report
                </Card.Header>
                <Card.Body className="f-center" style={{ flexDirection: "column" }}>
                  <h6 className="mb-3">Get every single report of your warehouse for all orders in format of Daily/Monthly/Yearly reports .</h6>
                  <div style={{ padding: "0.7rem", backgroundColor: "#f3efefba", display: "flex", justifyContent: "space-evenly", borderRadius: "0.5rem", width: "90%" }}>
                    {["daily", "monthly", "yearly"].map((t) => (
                      <div key={t} className={`bg-color ${t === selectedItem ? "active" : ''}`} onClick={() => handleReportTime(t)}>
                        {t[0].toUpperCase() + t.slice(1)}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 w-100">
                    {selectedItem === "daily" &&
                      <Form.Group className="mb-3">
                        <Form.Control
                          value={date}
                          type="date"
                          placeholder="Select Date"
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </Form.Group>
                    }

                    {selectedItem === "monthly" &&
                      <Form.Select className="mb-3" onChange={(e) => setMonth(e.target.value)}>
                        <option key="blankChoice" hidden value>
                          Select Month
                        </option>
                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                      </Form.Select>
                    }

                    {selectedItem === "yearly" &&
                      <Form.Select className="mb-3" onChange={(e) => setYear(e.target.value)}>
                        <option key="blankChoice" hidden value>Select Year</option>
                        {years().map((y) => <option key={y} value={y}>{y}</option>)}
                      </Form.Select>
                    }
                  </div>

                  <Button variant="outline-info" size="lg" style={{ backgroundColor: "#edf4fd" }} onClick={downloadPDF}>
                    Get Report <HiDownload />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Header as="h5" className="card-header-primary">
                  <TbReportMoney style={{ fontSize: "2rem" }} />{" "}
                  Bond Report
                </Card.Header>
                <Card.Body className="f-center" style={{ flexDirection: "column" }}>
                  <h6>Get every single detail for Bond report of orders that you are managing.</h6>
                  <p className="m-3">Select the date for bond Report</p>

                  <div className="mt-3 w-100">
                    <Form.Group className="mb-3">
                      <Form.Control
                        value={date}
                        type="date"
                        placeholder="Select Date"
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </Form.Group>
                  </div>

                  <Button variant="outline-info" size="lg" style={{ backgroundColor: "#edf4fd" }} onClick={downloadPDF}>
                    Get Report <HiDownload />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {
          /*<Row
            className="mb-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
          >
            <Col md={6}>
              <h3>Dashboard</h3>
            </Col>
            <Col md={6}>
              <div className="float-md-end d-flex align-items-center">
                <p className="p-bold m-0 me-3">Statistics For</p>
                <Form.Group controlId="time">
                  <Form.Select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                    aria-label="Default select example"
                  >
                    <option key="blankChoice" hidden value>
                      Select Time
                    </option>
                    <option value="all">All Time Statistics</option>
                    <option value="daily">Daily Statistics</option>
                    <option value="weekly">Weekly Statistics</option>
                    <option value="monthly">Monthly Statistics</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={3} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>
                      {summary.users && summary.users[0]
                        ? summary.users[0].total
                        : 0}
                    </h3>
                    <p>Users</p>
                  </div>
                  <div className="icon">
                    <IoIosPersonAdd />
                  </div>
                  <Link to="/admin/users" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={3} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>
                      {summary.orders && summary.orders[0]
                        ? summary.orders[0].total
                        : 0}
                      <sup style={{ fontSize: 20 }}></sup>
                    </h3>
                    <p>Orders</p>
                  </div>
                  <div className="icon">
                    <IoIosPerson />
                  </div>
                  <Link to="/admin/orders" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={3} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>
                      {summary.payments && summary.payments[0]
                        ? summary.payments[0].total
                        : 0}
                    </h3>
                    <p>Total Orders Price</p>
                  </div>
                  <div className="icon">
                    <GiNetworkBars />
                  </div>
                  <Link to="/admin/orders" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={3} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>
                      {summary.quantity && summary.quantity[0]
                        ? summary.quantity[0].total
                        : 0}
                    </h3>
                    <p>Total Orders Product Quantity</p>
                  </div>
                  <div className="icon">
                    <IoMdPie />
                  </div>
                  <Link to="/admin/orders" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
          </Row>

          <Row className="my-4">
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">User</Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyUsers.length === 0 ? (
                    <MessageBox>No Users Added</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Users...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#00ab41"],
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyUsers.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Orders
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyOrders.length === 0 ? (
                    <MessageBox>No Orders</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Orders...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#00c04b"],
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyOrders.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Total Order Amount
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyPayments.length === 0 ? (
                    <MessageBox>No Payments Added</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Payments...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#90EE90"],
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyPayments.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Total Product Quantity
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyQuantity.length === 0 ? (
                    <MessageBox>No Orders</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Products...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#90EE90"],
                        // title: "Subscriptions",
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyQuantity.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>*/}

          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
}
