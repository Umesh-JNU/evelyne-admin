import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { getProfile, updateProfile } from "../states/actions";
import { EditForm, TextInput } from "../components";
import { uploadImage } from "../utils/uploadImage";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { toast } from "react-toastify";

export default function EditUserModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;

  const [{ loading, error, loadingUpdate, data: user, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const userData = {
    fullname: "",
    email: "",
    mobile_no: "",
    city: "",
    country: ""
  };
  const userAttr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Fullname",
        name: "fullname",
        required: true
      }
    },
    {
      type: "text",
      col: 12,
      props: {
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
        required: true
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "City",
        name: "city",
        required: true
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
    }
  ];
  const [info, setInfo] = useState(userData);

  useEffect(() => {
    if (user) {
      console.log({ user })
      setInfo({
        fullname: user.fullname,
        email: user.email,
        // password: user.password,
        mobile_no: user.mobile_no,
        city: user.city,
        country: user.country,
      });
    }

    (async () => {
      await getProfile(dispatch, token);
    })();
  }, [token, props.show]);

  const resetForm = () => { setInfo(userData); };
  const submitHandler = async (e) => {
    e.preventDefault();

    await updateProfile(ctxDispatch, dispatch, token, {
      fullname: info.fullname,
      email: info.email,
      mobile_no: info.mobile_no,
      city: user.city,
      country: user.country
    });
    if (success) {
      resetForm();
    }
  };

  return (
    <EditForm
      {...props}
      title="Update Profile"
      data={info}
      setData={setInfo}
      inputFieldProps={userAttr}
      submitHandler={submitHandler}
      target=""
      successMessage="User Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}