import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditManagerModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // manager/:id

  const [{ loading, error, loadingUpdate, manager, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const managerData = {
    fullname: "",
    email: "",
    password: "",
    mobile_no: "",
    country: "",
    city: ""
  };
  const managerAttr = [
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
    }
  ]
  const [info, setInfo] = useState(managerData);

  useEffect(() => {
    if (manager && manager.id === parseInt(id)) {
      console.log({ manager })
      setInfo({
        fullname: manager.fullname,
        email: manager.email,
        mobile_no: manager.mobile_no,
        country: manager.country,
        city: manager.city,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(managerData); };
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
      title="Edit Manager"
      data={info}
      setData={setInfo}
      inputFieldProps={managerAttr}
      submitHandler={submitHandler}
      target="/admin/managers"
      successMessage="Manager Updated Succesfully.  Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}
