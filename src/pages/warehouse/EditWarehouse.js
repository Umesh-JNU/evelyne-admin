import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditWarehouse(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [{ loading, error, loadingUpdate, warehouse, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
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
    }, {
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


  useEffect(() => {
    if (warehouse && warehouse.id === parseInt(id)) {
      setInfo({
        name: warehouse.name,
        capacity: warehouse.capacity,
        desc: warehouse.desc
      })
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(warehouseData); }
  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, { ...info, capacity: parseInt(info.capacity) });
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit Warehouse"
      data={info}
      setData={setInfo}
      inputFieldProps={attr}
      submitHandler={submitHandler}
      target="/admin/warehouses"
      successMessage="Warehouse Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}
