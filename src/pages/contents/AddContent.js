import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, MotionDiv } from "../../components";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function AddController() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [info, setInfo] = useState({
    contact_no: "",
    email: "",
    about_us: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      contact_no: "",
      email: "",
      about_us: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
    }

    if (loading)
      toast.success("Content Created Succesfully!", toastOptions);

    if (success) {
      navigate("/admin/contents");
    }
  }, [success, error, loading]);

  useTitle("Create Content");
  return (
    <MotionDiv>
      <Row
        className="mt-2 mb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col>
          <span style={{ fontSize: "xx-large" }}>Add Content</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as={"h4"}>Add Details</Card.Header>
            <Form onSubmit={submitHandler}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="contact_no">
                  <Form.Label>Contact No.</Form.Label>
                  <Form.Control
                    value={info.contact_no}
                    name="contact_no"
                    onChange={handleInput}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={info.email}
                    name="email"
                    onChange={handleInput}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="about_us">
                  <Form.Label>About Us</Form.Label>
                  <Form.Control
                    value={info.about_us}
                    name="about_us"
                    onChange={handleInput}
                    required
                  />
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button type="submit" disabled={loading ? true : false}>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Card.Footer>
              <ToastContainer />
            </Form>
          </Card>
        </Col>
      </Row>
    </MotionDiv>
  );
}
