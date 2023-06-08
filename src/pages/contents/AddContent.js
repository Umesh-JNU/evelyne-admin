import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, MotionDiv, CustomForm } from "../../components";

export default function AddController() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const contentData = {
    contact_no: "",
    email: "",
    about_us: "",
  };
  const contentAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Contact No.",
        name: "contact_no",
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
        label: "About Us",
        name: "about_us",
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(contentData);

  const resetForm = () => {
    setInfo(contentData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Content");
  return (
    <MotionDiv>
      <CustomForm
        title="Add Content"
        data={info}
        setData={setInfo}
        inputFieldProps={contentAttr}
        submitHandler={submitHandler}
        target="/admin/contents"
        successMessage="Content Created Successfully!"
        reducerProps={{ loading, error, success, dispatch }}
      />
      <ToastContainer />
    </MotionDiv>
  );
}

