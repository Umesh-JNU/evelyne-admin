import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { getOrders, create } from "./state/action";
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

  const [{ loading, loadingAdd, error, success, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const [info, setInfo] = useState({
    orderId: "",
    amount: "",
    mode: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      orderId: "",
      amount: "",
      mode: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useEffect(() => {
    if (loadingAdd)
      toast.success("Transaction Created Succesfully!", toastOptions);

    if (success)
      navigate("/admin/transactions");

    (async () => {
      await getOrders(dispatch, token);
    })();

  }, [success, loadingAdd]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
    }
  }, [error]);

  useTitle("Create Transaction");
  return (
    <MotionDiv>
      <Row
        className="mt-2 mb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col>
          <span style={{ fontSize: "xx-large" }}>Add Transaction</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as={"h4"}>Add Details</Card.Header>
            <Form onSubmit={submitHandler}>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="mr-3">Order</Form.Label>
                  <Form.Select
                    aria-label="Select Order"
                    aria-controls="orderId"
                    value={info.orderId}
                    name="orderId"
                    onChange={handleInput}
                  >
                    <option key="blankChoice" hidden value>
                      Select Order
                    </option>
                    {orders &&
                      orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.id}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="amount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={info.amount}
                    name="amount"
                    onChange={(e) => { setInfo({ ...info, amount: parseInt(e.target.value) }) }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mr-3">Mode</Form.Label>
                  <Form.Select
                    aria-label="Select Mode"
                    aria-controls="mode"
                    value={info.mode}
                    name="mode"
                    onChange={handleInput}
                  >
                    <option key="blankChoice" hidden value>
                      Select Mode
                    </option>

                    <option value={"cash"}>Cash</option>
                    <option value={"card"}>Card</option>
                    <option value={"bank"}>Bank</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button type="submit" disabled={loadingAdd ? true : false}>
                  {loadingAdd ? (
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
