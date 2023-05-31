import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import managerReducer from "./state/reducer";
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

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // manager/:id

  const [{ loading, error, loadingUpdate, manager, success }, dispatch] = useReducer(managerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [info, setInfo] = useState({
    fullname: "",
    email: "",
    mobile_no: "",
    country: "",
    city: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      fullname: "",
      email: "",
      mobile_no: "",
      country: "",
      city: "",
    });
  };

  useEffect(() => {
    if (manager && manager.id === parseInt(id)) {
      console.log({ manager })
      setInfo({ ...manager });
    }

    if (success) {
      toast.success("Manager Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate("/admin/managers");
      }, 3000);
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [success, id, props.show]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
    }
  }, [error]);

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
        <Modal.Title id="contained-modal-title-vcenter">Edit Manager</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="fullname">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                value={info.fullname}
                name="fullname"
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

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={info.mobile_no}
                name="mobile_no"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={info.country}
                name="country"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={info.city}
                name="city"
                onChange={handleInput}
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
