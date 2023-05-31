import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv } from "../../components";
import managerReducer from "./state/reducer";
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
import EditInvoiceModel from "./EditInvoice";
import { getDateTime } from "../../utils/function";

const ViewInvoice = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, manager }, dispatch] = useReducer(managerReducer, {
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

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${manager.fullname} Details`;
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
                {loading ? (
                  <Skeleton />
                ) : (
                  `${manager.fullname}`
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
                    <strong>Fullname</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.fullname}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Email</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.email}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Mobile No.</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.mobile_no}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Country</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.country}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>City</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.city}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Role</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : manager.role}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(manager.createdAt)}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(manager.updatedAt)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditInvoiceModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
};

export default ViewInvoice;
