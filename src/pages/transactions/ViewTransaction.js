import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv } from "../../components";
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
import Skeleton from "react-loading-skeleton";
import EditTransactionModel from "./EditTransaction";
import { getDateTime } from "../../utils/function";

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // transaction/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
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

  useTitle("Transaction Details");
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
                  `${transaction.id}`
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
                    <strong>Transaction Id</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.id}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Amount</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.amount}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Payer Name</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.order?.user?.fullname}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>OrderId</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.order?.id}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Payment Mode</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.mode}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Status</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : transaction.status}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(transaction.createdAt)}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(transaction.updatedAt)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditTransactionModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
};

export default ViewTransaction;
