import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import managerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch, EditForm } from "../../components";

const HouseTable = ({ warehouse }) => {
  return (
    <Table responsive striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>Warehouse Id</th>
          <th>Image</th>
          <th>Name</th>
          {/* <th>Action</th> */}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-center">{warehouse.id}</td>
          <td><img
            className="td-img"
            src={warehouse.image}
            alt=""
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          /></td>
          <td>{warehouse.name}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default function AssignWarehouseModel(props) {
  console.log("AssignWarehouseModel", { props })
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // manager/:id
  const { house } = props;

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(managerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [warehouse, setWarehouse] = useState(house);
  const resetForm = () => {
    setWarehouse("");
  };

  const addWarehouseHandler = (v) => {
    if (!v) {
      toast.warning("Warehouse can't be empty", toastOptions);
      return;
    }

    setWarehouse(v);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateWarehouse(dispatch, token, { managerId: id, warehouse: warehouse.id });
    resetForm();
  };

  return (house
    ? <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Assign/Change Warehouse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="small-container">
          <p className="p-bold">Already a warehouse is assigned. To change warehouse, first remove it.</p>
          <HouseTable warehouse={house} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => { props.onHide(); }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal >

    : <EditForm
      {...props}
      title="Assign/Change Warehouse"
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={''}
      successMessage="Manager's Warehouse Updated Succesfully."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <AutocompleteSearch onSelect={addWarehouseHandler} searchType="warehouse" unassigned="managerId" />

      {warehouse && <HouseTable warehouse={warehouse} />}
      <ToastContainer />
    </EditForm>
  );
}
