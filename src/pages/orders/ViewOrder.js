import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ArrayView } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import {
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import { FaEdit } from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import EditOrderModel from "./EditOrder";
import { getDateTime } from "../../utils/function";

const ViewOrder = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // order/:id

  const [modalShow, setModalShow] = useState(false);
  const [arrModalShow, setArrModalShow] = useState(false);
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
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
    }
  }, [error])

  useTitle("Order Details");
  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Card>
            <Card.Header>
              <Card.Title>
                {loading ? (
                  <Skeleton />
                ) : (
                  `Order - ${order.id}`
                )}{" "}
                Details
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
                    <strong>Order Id</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : order.id}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Items</strong>
                  </p>
                  <p>
                    {loading ?
                      <Skeleton /> :
                      <IoMdOpen
                        className="open-model"
                        onClick={() => setArrModalShow(true)}
                      />}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>User</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : order.user?.fullname}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Warehouse</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : order.warehouse?.name}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Address</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : order.address}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Status</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : order.status}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(order.createdAt)}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(order.updatedAt)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditOrderModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          {arrModalShow ? (
            <ArrayView
              show={arrModalShow}
              onHide={() => setArrModalShow(false)}
              arr={order.items}
              column={{ "Item": "name", "Quantity": "quantity" }}
              title="Item List"
            />
          ) : (
            <></>
          )}
          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
};

export default ViewOrder;
