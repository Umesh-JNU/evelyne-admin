import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create, getUsers, getWarehouses } from "./state/action";
import { useTitle, MotionDiv } from "../../components";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Spinner,
  Table,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";

export default function AddController() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, loadingAdd, error, success, users, warehouses }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [info, setInfo] = useState({
    warehouse: "",
    user: "",
    items: [],
    address: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const itemHandler = () => {
    // console.log(item, quantity, typeof quantity);
    if (!item) {
      toast.warning("Item can't be empty.", toastOptions);
      return;
    }
    if (!quantity || quantity === '0') {
      toast.warning("Quantity can't be 0.", toastOptions);
      return;
    }
    info.items.push({ name: item, quantity: parseInt(quantity) });
    setItem("");
    setQuantity("");
  };

  const resetForm = () => {
    setInfo({
      warehouse: "",
      user: "",
      items: [],
      address: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!info.warehouse) {
      toast.warning("Please select a warehouse.", toastOptions);
      return;
    }
    if (!info.user) {
      toast.warning("Please select a user.", toastOptions);
      return;
    }
    if ((info.items && info.items.length === 0) || !info.items) {
      toast.warning("Please add items to create order.", toastOptions);
      return;
    }

    await create(dispatch, token, info);
    resetForm();
  };

  useEffect(() => {
    if (loadingAdd)
      toast.success("Order Created Succesfully!", toastOptions);

    if (success) {
      navigate("/admin/orders");
    }

    (async () => {
      await getWarehouses(dispatch, token);
      await getUsers(dispatch, token);
    })();
  }, [success, loadingAdd]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  useTitle("Create Order");
  return (
    <MotionDiv>
      <Row
        className="mt-2 mb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col>
          <span style={{ fontSize: "xx-large" }}>Add Order</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as={"h4"}>Add Details</Card.Header>
            <Form onSubmit={submitHandler}>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="mr-3">Warehouse</Form.Label>
                  <Form.Select
                    aria-label="Select Warehouse"
                    aria-controls="warehouse"
                    value={info.warehouse}
                    name="warehouse"
                    onChange={handleInput}
                  >
                    <option key="blankChoice" hidden value>
                      {warehouses && warehouses.length > 0 ? "Select Warehouse" : "No Warehouse"}
                    </option>
                    {warehouses &&
                      warehouses.map((house) => (
                        <option key={house.id} value={house.id}>
                          {house.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mr-3">User</Form.Label>
                  <Form.Select
                    aria-label="Select User"
                    aria-controls="user"
                    value={info.user}
                    name="user"
                    onChange={handleInput}
                  >
                    <option key="blankChoice" hidden value>
                      {users && users.length > 0 ? "Select User" : "No User"}
                    </option>
                    {users &&
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullname}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    value={info.address}
                    name="address"
                    onChange={handleInput}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="item">
                      <Form.Label>Item</Form.Label>
                      <Form.Control
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="quantity">
                      <Form.Label>Quantity</Form.Label>
                      <Row>
                        <Col md={7}>
                          <Form.Control
                            type="number"
                            min={0}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </Col>
                        <Col md={5}>
                          <Button onClick={itemHandler}>
                            Add Item
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {info.items && info.items.length > 0 && (
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qauntity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {info.items.map(({ name, quantity }, i) => (
                          <tr key={name}       >
                            <td>{name}</td>
                            <td>{quantity}</td>
                            <td>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const index = info.items.findIndex(
                                    (i) =>
                                      i.name === name &&
                                      i.quantity === quantity
                                  );
                                  console.log({ index });
                                  if (index > -1) {
                                    // only splice array when item is found

                                    setInfo({
                                      ...info, items: [
                                        ...info.items.slice(0, index),

                                        // part of the array after the given item
                                        ...info.items.slice(index + 1),
                                      ]
                                    });
                                  }
                                }}
                                type="danger"
                                className="btn btn-danger btn-block"
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Row>
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
    </MotionDiv >
  );
}
