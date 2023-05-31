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
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import EditContentModel from "./EditContent";
import { getDateTime } from "../../utils/function";

const ViewContent = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, content }, dispatch] = useReducer(reducer, {
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

  useTitle("Content Details");

  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Card>
            <Card.Header>
              <Card.Title>Content Details</Card.Title>
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
                    <strong>Contact No.</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : content.contact_no}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Email</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : content.email}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>About Us</strong>
                  </p>
                  <p>{loading ? <Skeleton /> : content.about_us}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(content.createdAt)}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>
                    {loading ? <Skeleton /> : getDateTime(content.updatedAt)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditContentModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
};

export default ViewContent;
