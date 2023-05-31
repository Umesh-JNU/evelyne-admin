import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv } from "../../components";
import warehouseReducer from "./state/reducer";
import { getDetails } from "./state/action";
import {
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import EditWarehouseModel from "./EditWarehouse.js";
import { getDateTime } from "../../utils/function";

const ViewWarehouse = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [modalShow, setModalShow] = useState(false);
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
        <>
          <Card>
            <Card.Header>
              <Card.Title>
                {loading ? <Skeleton /> : `${warehouse.name} Details`}
              </Card.Title>
              <div className="card-tools">
                <FaEdit
                  style={{ color: "blue" }}
                  onClick={() => setModalShow(true)}
                />
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Name</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : warehouse.name}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Capacity</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : warehouse.capacity}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Filled</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : warehouse.filled}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Manager</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : warehouse.manager ? warehouse.manager.fullname : (<strong>Not Assigned</strong>)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Controller</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : warehouse.controller ? warehouse.controller.fullname : (<strong>Not Assigned</strong>)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : getDateTime(warehouse.createdAt)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : getDateTime(warehouse.updatedAt)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditWarehouseModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
};

export default ViewWarehouse;
