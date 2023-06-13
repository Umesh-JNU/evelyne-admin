import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import { Button, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch, EditForm } from "../../components";

const HouseTable = ({ warehouses, isAction, setWarehouses }) => {
  return (
    <Table responsive striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>Warehouse Id</th>
          <th>Image</th>
          <th>Name</th>
          <th>Capacity</th>
          <th>Filled</th>
          {isAction && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {warehouses.map(({ id, name, image, capacity, filled }) => (
          <tr key={id}>
            <td className="text-center">{id}</td>
            <td>{name}</td>
            <td>
              <img
                className="td-img"
                src={image}
                alt=""
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            </td>
            <td>{capacity}</td>
            <td>{filled}</td>
            {isAction && <td>
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
            </td>}
          </tr>
        ))}
      </tbody >
    </Table >
  );
};

export default function EditUserModel(props) {
  console.log("AssignWarehouseModel", { props })
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // controller/:id
  const { houses } = props;

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [warehouses, setWarehouses] = useState([]);
  const resetForm = () => {
    setWarehouses([]);
  };

  const addWarehouseHandler = (v) => {
    console.log(v);
    // console.log(item, quantity, typeof quantity);
    if (!v) {
      toast.warning("Warehouse can't be empty", toastOptions);
      return;
    }

    setWarehouses([...warehouses, v]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateWarehouse(dispatch, token, { controllerId: id, warehouses: warehouses.map(({ id }) => id) });
    resetForm();
  };

  return (
    <EditForm
      {...props}
      title="Assign/Change Warehouses"
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={''}
      successMessage="Controller's Warehouse Updated Succesfully."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      {houses.length > 0 &&
        <div className="mb-3">
          <p className="p-bold m-0">Assigned Houses</p>
          <HouseTable warehouses={houses} />
        </div>
      }

      <AutocompleteSearch onSelect={addWarehouseHandler} searchType="warehouse" />

      {warehouses && warehouses.length > 0 && <HouseTable warehouses={warehouses} isAction={true} setWarehouses={setWarehouses} />}
      
      <ToastContainer />
    </EditForm>
  );
}
