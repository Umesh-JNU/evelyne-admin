import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, removeHandler } from "./state/action";
import EditWarehouseModel from "./EditWarehouse.js";
import AddMangerModel from "./AddManagerModel";
import AddControllerModel from "./AddControllerModel";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getError, toastOptions } from "../../utils/error";
import { FaTrashAlt } from "react-icons/fa";
import { HiClipboardDocumentList } from "react-icons/hi2";
import axiosInstance from "../../utils/axiosUtil";
import { HiDownload } from "react-icons/hi";
import { TbReportMoney } from "react-icons/tb";

const months = new Array(12)
  .fill().map((_, index) => new Date(0, index).toLocaleString('en', { month: 'long' }));

const years = () => {
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let year = 2023; year <= currentYear; year++) yearList.push(year);
  return yearList;
}

const ViewWarehouse = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedItem, setSelectedItem] = useState("daily");

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

  const downloadPDF = async (type = "report") => {
    try {
      let url = `/api/report/${id}/?year=${year}&month=${month}&date=${date}`;
      if (type === "bond") {
        url = `/api/report/bond-report/${id}/?date=${date}`
      }

      const { data } = await axiosInstance.get(url,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf", Authorization: token
          }
        });
      
      console.log({ data })
      const filename = "report.pdf";
      const blobObj = new Blob([data], { type: "application/pdf" });
      const anchorlink = document.createElement("a");
      anchorlink.href = window.URL.createObjectURL(blobObj)
      anchorlink.setAttribute("download", filename);
      anchorlink.click();
    }
    catch (err) {
      console.log({ err });
      toast.error(getError(err), toastOptions);
    }
  }

  const [modalShow, setModalShow] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showController, setShowController] = useState(false);
  const [{ loading, error, loadingUpdate, warehouse, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useEffect(() => {
    if (success) {
      (async () => {
        await getDetails(dispatch, token, id);
      })();

      toast.success("Controller/Manager Removed Successfully.", toastOptions);
    }
  }, [success]);

  const removeManager = async (managerId) => {
    await removeHandler(dispatch, token, { managerId, warehouseId: id });
    // warehouse.manager = null;
  }

  const removeController = async (controllerId) => {
    await removeHandler(dispatch, token, { controllerId, warehouseId: id });
    // const idx = warehouse.controller.findIndex(({ id }) => {
    //   // console.log({ id, controllerId });
    //   return id === controllerId
    // });
    // // console.log({ idx });
    // if (idx >= 0) warehouse.controller.splice(idx, 1);
    // console.log(warehouse.controller);
  }

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${warehouse.name} Details`;
  useTitle(title);

  return (
    <ViewCard
      title={warehouse && `${warehouse.name} Details`}
      data={warehouse}
      setModalShow={setModalShow}
      isImage={true}
      image_url={warehouse?.image}
      keyProps={{ "Name": "name", "Description": "desc", "Capacity": "capacity", "Filled": "filled", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <Row className="mt-4">
        <h2>Manager Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowManager(true) }}>Add/Change Manager</Button>
        </Col>
      </Row>

      <div className="mt-3">
        {loading ? <Skeleton height={35} /> : warehouse.manager ?
          <Row>
            <Col md={2}><b>Manager - </b></Col>
            <Col md={2}>{warehouse.manager.fullname}</Col>
            <Col md={2}>
              <Button variant="danger" className="ms-3" disabled={loadingUpdate}
                onClick={() => removeManager(warehouse.manager.id)}
              >
                <FaTrashAlt />
              </Button>
            </Col>
          </Row>
          : <p className="p-bold">No Manager Assigned</p>
        }
      </div>

      <Row className="mt-4">
        <h2>Controller Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowController(true) }}>Add/Change Controller</Button>
        </Col>
      </Row>

      <div className="mt-3">
        {loading ? <Skeleton count={2} height={35} /> : warehouse.controller.length > 0
          ? warehouse.controller.map(({ id, fullname }, i) =>
            <Row className="mt-2" key={id}>
              <Col md={2} className="text-center"><b>{i + 1}. </b></Col>
              <Col md={2}>{fullname}</Col>
              <Col md={2}>
                <Button variant="danger" className="ms-3" disabled={loadingUpdate}
                  onClick={() => removeController(id)}
                >
                  <FaTrashAlt />
                </Button>
              </Col>
            </Row>
          )
          : <p className="p-bold">No Controller Assigned</p>
        }
      </div>

      <Row className="mt-3">
        <Col md={6}>
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
                    {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
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
        <Col md={6}>
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

              <Button variant="outline-info" size="lg" style={{ backgroundColor: "#edf4fd" }} onClick={() => downloadPDF("bond")}>
                Get Report <HiDownload />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EditWarehouseModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {showManager && <AddMangerModel
        show={showManager}
        onHide={() => setShowManager(false)}
        manager={warehouse?.manager}
        reload={async () => { await getDetails(dispatch, token, id); }}
      />}
      {showController && <AddControllerModel
        show={showController}
        onHide={() => setShowController(false)}
        controllerList={warehouse.controller}
        reload={async () => { await getDetails(dispatch, token, id); }}
      />}
      {!showController && !showManager && !modalShow && < ToastContainer />}
    </ViewCard>
  );
};

export default ViewWarehouse;
