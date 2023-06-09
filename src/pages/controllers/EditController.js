import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditControllerModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // controller/:id

  const [{ loading, error, loadingUpdate, controller, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const controllerData = {
    fullname: "",
    email: "",
    mobile_no: "",
    country: "",
    city: "",
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

  useEffect(() => {
    if (controller && controller.id === parseInt(id)) {
      setInfo({
        fullname: controller.fullname,
        email: controller.email,
        mobile_no: controller.mobile_no,
        country: controller.country,
        city: controller.city,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(controllerData); };
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
      title="Edit Controller"
      data={info}
      setData={setInfo}
      inputFieldProps={controllerAttr}
      submitHandler={submitHandler}
      target="/admin/controllers"
      successMessage="Controller Updated Succesfully.  Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}
