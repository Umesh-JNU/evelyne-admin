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

  const userData = {
    fullname: "",
    email: "",
    password: "",
    mobile_no: "",
    country: "",
    city: ""
  };
  const userAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "User's Fullname",
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
  const [info, setInfo] = useState(userData);

  const resetForm = () => {
    setInfo(userData);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create User");
  return (
    <AddForm
      title="Add User"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target="/admin/users"
      successMessage="User Created Successfully!"
      reducerProps={{ loading: loadingAdd, error, success, dispatch }}
    >
      <ToastContainer />
    </AddForm>
  );
}
