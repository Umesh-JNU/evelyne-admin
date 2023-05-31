import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate, useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, getUsers, getWarehouses, update } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // order/:id

  const [{ loading, error, loadingUpdate, order, users, warehouses, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
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

  useEffect(() => {
    if (order && order.id === parseInt(id)) {
      console.log({ order })
      setInfo({
        warehouse: order.warehouse?.id,
        user: order.user?.id,
        items: [...order.items],
        address: order.address
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
      await getWarehouses(dispatch, token);
      await getUsers(dispatch, token);
    })();
  }, [id, props.show]);

  useEffect(() => {
    if (success) {
      toast.success("Order Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate("/admin/orders");
      }, 3000);
    }

    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error, success]);

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

    await update(dispatch, token, id, info);
    resetForm();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit order</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
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
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" type="submit" disabled={loadingUpdate ? true : false}>
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
