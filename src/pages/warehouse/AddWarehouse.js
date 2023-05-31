import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import warehouseReducer from "./state/reducer";
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
import { clearErrors } from "../../states/actions";

export default function AddWarehouse() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(warehouseReducer, {
    loading: false,
    error: "",
  });

  const [info, setInfo] = useState({
    name: "",
    capacity: "",
  })

  const resetForm = () => {
    setInfo({
      name: "",
      capacity: "",
    })
  };

  const inputHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useEffect(() => {
    if (loading) {
      toast.success("Warehouse Added Succesfully", toastOptions);
    }
    if (success) {
      navigate(-1);
    }
  }, [success, loading]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  useTitle("Add Warehouse");
  return (
    <MotionDiv>
      <Row
        className="mt-2 mb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col>
          <span style={{ fontSize: "xx-large" }}>Add Warehouse</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as={"h4"}>Add Details</Card.Header>
            <Form onSubmit={submitHandler}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={info.name}
                    name="name"
                    placeholder="Warehouse Name"
                    onChange={inputHandler}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="capacity">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={info.capacity}
                    name="capacity"
                    placeholder="Warehouse Capacity"
                    onChange={(e) => { setInfo({ ...info, capacity: parseInt(e.target.value) }) }}
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
    </MotionDiv >
  );
}
