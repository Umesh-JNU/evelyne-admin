import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditControllerModel from "./EditController";
import WarehouseModel from "./WarehouseModel";
import { Button, Col, Row, Table } from "react-bootstrap";

const ViewController = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // controller/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, controller }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${controller.fullname} Details`;
  useTitle(title);

  return (

    <ViewCard
      title={controller && `${controller.fullname} Details`}
      data={controller}
      setModalShow={setModalShow}
      isImage={true}
      image_url={controller?.avatar}
      keyProps={{ "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <Row className="my-4">
        <h2>Warehouse Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowHouseModel(true) }}>Add/Change Warehouse</Button>
        </Col>
      </Row>
      {controller?.warehouses &&
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Warehouse Id</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Filled</th>
            </tr>
          </thead>
          <tbody>
            {controller.warehouses.map(({ id, name, capacity, filled }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{capacity}</td>
                <td>{filled}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
      <EditControllerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
      />
      <ToastContainer />
    </ViewCard>
  );
};

export default ViewController;
