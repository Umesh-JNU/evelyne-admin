import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddWarehouse() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const warehouseData = {
    name: "",
    capacity: 1000,
    desc: ""
    // image: "",
  };
  const attr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Warehouse Name",
        placeholder: "Warehouse Name",
        name: "name",
        required: true,
      }
    }, 
    {
      type: "text",
      col: 12,
      props: {
        label: "Warehouse Description",
        placeholder: "Warehouse Description",
        name: "desc",
        required: true,
      }
    }, 
    {
      type: "number",
      col: 12,
      props: {
        type: "number",
        label: "Capacity",
        placeholder: "Warehouse Capacity",
        name: "capacity",
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(warehouseData)

  const resetForm = () => {
    setInfo(warehouseData);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Add Warehouse");
  return (
    <AddForm
      title="Add Warehouse"
      data={info}
      setData={setInfo}
      inputFieldProps={attr}
      submitHandler={submitHandler}
      target={-1}
      successMessage="Warehouse Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm >
  );
}
