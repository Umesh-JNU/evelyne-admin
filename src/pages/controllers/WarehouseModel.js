import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { getDetails, updateWarehouse } from "./state/action";

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
import { AutocompleteSearch } from "../../components";
import { clearErrors } from "../../states/actions";

export default function EditUserModel(props) {
  console.log(props.show)
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // controller/:id

  const [{ loading, error, loadingUpdate, controller, success }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [house, setHouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const resetForm = () => {
    setHouse("");
    setWarehouses([]);
  };

  const addWarehouseHandler = (v) => {
    console.log(v);
    // console.log(item, quantity, typeof quantity);
    if (!v) {
      toast.warning("Warehouse can't be empty", toastOptions);
      return;
    }

    setWarehouses([...warehouses, { name: v.name, id: parseInt(v.id) }]);
    setHouse("");
  };

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  useEffect(() => {
    if (success) {
      toast.success("controller's Warehouse Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }

    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [success, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    resetForm();
    await updateWarehouse(dispatch, token, { controllerId: controller.id, warehouses: warehouses.map(({ id, name }) => id) });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Assign/Change Warehouse</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            {/* <Row> */}
            {/* <Col md={8}> */}
            <AutocompleteSearch value={house.name} onSelect={addWarehouseHandler} />
            {/* </Col> */}
            {/* <Col md={4}>
                <Button onClick={addWarehouseHandler}>
                  Add Warehouse
                </Button>
              </Col> */}
            {/* </Row> */}
            <Row className="mt-3">
              {warehouses && warehouses.length > 0 && (
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Warehouse Id</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.map(({ id, name }, i) => (
                      <tr key={id}       >
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              const index = warehouses.findIndex(
                                (i) =>
                                  i.id === id &&
                                  i.name === name
                              );
                              console.log({ index });
                              if (index > -1) {
                                // only splice array when item is found

                                setWarehouses([
                                  // part of the array before the given item
                                  ...warehouses.slice(0, index),

                                  // part of the array after the given item
                                  ...warehouses.slice(index + 1),
                                ]);
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
          <Button variant="danger" onClick={() => { props.onHide(); setWarehouses([]) }}>
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
    </Modal >
  );
}
