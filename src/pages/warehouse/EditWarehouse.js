import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import warehouseReducer from "./state/reducer";
import { getDetails, update } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Container,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function EditWarehouse(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [{ loading, error, loadingUpdate, warehouse, success }, dispatch] = useReducer(warehouseReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [info, setInfo] = useState({
    name: "",
    capacity: "",
    filled: "",
  })

  const resetForm = () => {
    setInfo({
      name: "",
      capacity: "",
      filled: "",
    })
  };

  const inputHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (warehouse && warehouse.id === parseInt(id)) {
      setInfo({
        name: warehouse.name,
        capacity: warehouse.capacity,
        filled: warehouse.filled,
      })
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  useEffect(() => {
    if (success) {
      toast.success("Warehouse Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate("/admin/warehouses");
      }, 3000);
    }

    if (error) {
      toast.error(error, toastOptions);
    }
  }, [error, success]);

  const submitHandler = async (e) => {
    e.preventDefault();

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
        <Modal.Title id="contained-modal-title-vcenter">Edit Warehouse</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
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
                onChange={(e) => {setInfo({...info, capacity: parseInt(e.target.value)})}}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="filled">
              <Form.Label>Filled</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={info.filled}
                name="filled"
                placeholder="Warehouse Occupied value"
                onChange={(e) => {setInfo({...info, filled: parseInt(e.target.value)})}}
                required
              />
            </Form.Group>

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
