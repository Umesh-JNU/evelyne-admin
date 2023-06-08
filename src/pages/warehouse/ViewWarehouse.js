import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ViewCard } from "../../components";
import warehouseReducer from "./state/reducer";
import { getDetails } from "./state/action";
import { Card, Row, Col, Button } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import Skeleton from "react-loading-skeleton";
import EditWarehouseModel from "./EditWarehouse.js";
import AddMangerModel from "./AddManagerModel";
import AddControllerModel from "./AddControllerModel";

const ViewWarehouse = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [modalShow, setModalShow] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showController, setShowController] = useState(false);
  const [{ loading, error, warehouse }, dispatch] = useReducer(warehouseReducer, {
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
    : `${warehouse.name} Details`;
  useTitle(title);

  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ViewCard
          title={warehouse && `${warehouse.name} Details`}
          data={warehouse}
          loading={loading}
          setModalShow={setModalShow}
          isImage={true}
          image_url={warehouse?.image}
          keyProps={{ "Name": "name", "Capacity": "capacity", "Filled": "filled", "Created At": "createdAt", "Last Update": "updatedAt" }}
        >
          <Row className="mt-4">
            <h2>Manager Details</h2>
            <Col md={3}>
              <Button onClick={() => { setShowManager(true) }}>Add/Change Manager</Button>
            </Col>
          </Row>

          <div className="mt-3">
            {warehouse?.manager
              ? <><b>Manager - </b> {warehouse.manager.fullname}</>
              : "No Manager Assigned"
            }
          </div>

          <Row className="mt-4">
            <h2>Controller Details</h2>
            <Col md={3}>
              <Button onClick={() => { setShowController(true) }}>Add/Change Controller</Button>
            </Col>
          </Row>

          <div className="mt-3">
            {warehouse?.controller.length > 0
              ? <ol>{warehouse.controller.map(({ id, fullname }) => <li>{fullname}</li>)}</ol>
              : "No Controller Assigned"
            }
          </div>
        </ViewCard>
      )}

      <EditWarehouseModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <AddMangerModel
        show={showManager}
        onHide={() => setShowManager(false)}
      />
      <AddControllerModel
        show={showController}
        onHide={() => setShowController(false)}
      />
      <ToastContainer />
    </MotionDiv>
  );
};

export default ViewWarehouse;
