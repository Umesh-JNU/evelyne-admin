import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ViewCard } from "../../components";
import controllerReducer from "./state/reducer";
import { getDetails } from "./state/action";
import { Row, Col, Button, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import EditControllerModel from "./EditController";
import WarehouseModel from "./WarehouseModel";

const ViewController = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, controller }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error])

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${controller.fullname} Details`;
  useTitle(title);

  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ViewCard
          data={controller}
          loading={loading}
          setModalShow={setModalShow}
          keyProps={{ "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city" }}
        >
          <Row className="mb-3">
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
        </ViewCard>
      )}
      <EditControllerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
      />
      <ToastContainer />
    </MotionDiv>
  );
};

export default ViewController;
