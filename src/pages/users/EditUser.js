import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditUserModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // user/:id

  const [{ loading, error, loadingUpdate, user, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const userData = {
    fullname: "",
    email: "",
    mobile_no: "",
    country: "",
    city: "",
    role: "",
  };
  const [info, setInfo] = useState(userData);
  const userAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Manager's Fullname",
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
    },
    {
      type: "select",
      col: 12,
      props: {
        label: "Role",
        name: "role",
        placeholder: "Select Role",
        options: [{ "admin": "Admin" }, { "manager": "Manager" }, { "controller": "Controller" }, { "user": "User" },]
      }
    }
  ]

  const resetForm = () => {
    setInfo(userData);
  };

  useEffect(() => {
    if (user && user.id === parseInt(id)) {
      setInfo({
        fullname: user.fullname,
        email: user.email,
        mobile_no: user.mobile_no,
        country: user.country,
        city: user.city,
        role: user.userRole?.role,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Edit User"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target="/admin/users"
      successMessage="User Updated Succesfully.  Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}
