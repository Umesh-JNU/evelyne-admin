import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm } from "../../components";

export default function AddController() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, loadingAdd, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const controllerData = {
    fullname: "",
    email: "",
    password: "",
    mobile_no: "",
    country: "",
    city: ""
  };
  const controllerAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Controller's Fullname",
        name: "fullname",
        required: true,
      }
    },
    {
      type: "email",
      col: 12,
      props: {
        type: "email",
        label: "Email",
        name: "email",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Mobile No.",
        name: "mobile_no",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Password",
        name: "password",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Country",
        name: "country",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "City",
        name: "city",
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(controllerData);

  const resetForm = () => {
    setInfo(controllerData);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Controller");
  return (
    <AddForm
      title="Add Controller"
      data={info}
      setData={setInfo}
      inputFieldProps={controllerAttr}
      submitHandler={submitHandler}
      target="/admin/controllers"
      successMessage="Controller Created Successfully!"
      reducerProps={{ loading: loadingAdd, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}
