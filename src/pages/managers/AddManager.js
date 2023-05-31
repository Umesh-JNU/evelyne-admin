import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import managerReducer from "./state/reducer";
import { create, getWarehouses } from "./state/action";
import { useTitle, MotionDiv, AutocompleteSearch } from "../../components";
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

  const [{ loading, loadingAdd, error, success }, dispatch] = useReducer(managerReducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const [info, setInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile_no: "",
    country: "",
    city: ""
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      fullname: "",
      email: "",
      password: "",
      mobile_no: "",
      country: "",
      city: ""
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    await create(dispatch, token, info);
    resetForm();
  };

  useEffect(() => {
    console.log({loadingAdd, error})
    if (loadingAdd)
      toast.success("Manager Created Succesfully!", toastOptions);

    if (success)
      navigate("/admin/managers");

    (async () => {
      await getWarehouses(dispatch);
    })();
  }, [success, loadingAdd]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  useTitle("Create Manager");
  return (
    <MotionDiv>
      <Row
        className="mt-2 mb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col>
          <span style={{ fontSize: "xx-large" }}>Add Manager</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as={"h4"}>Add Details</Card.Header>
            <Form onSubmit={submitHandler}>
              <Card.Body>
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

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    value={info.password}
                    name="password"
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
