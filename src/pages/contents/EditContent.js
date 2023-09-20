import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm } from "../../components";

export default function EditUserModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // content/:id

  const [{ loading, error, loadingUpdate, content, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const contentData = {
    contact_no: "",
    email: "",
    about_us: "",
    terms_and_cond: "",
    privacy_policy: "",
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
    },
    {
      type: "text",
      col: 12,
      props: {
        as: "textarea",
        rows: 3,
        label: "Terms and Conditions",
        name: "terms_and_cond",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        as: "textarea",
        rows: 3,
        label: "Privacy Policy",
        name: "privacy_policy",
        required: true,
      }
    }
  ]
  const [info, setInfo] = useState(contentData);

  useEffect(() => {
    if (content && content.id === parseInt(id)) {
      console.log({ content })
      setInfo({
        contact_no: content.contact_no,
        email: content.email,
        about_us: content.about_us,
        terms_and_cond: content.terms_and_cond,
        privacy_policy: content.privacy_policy,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  const resetForm = () => { setInfo(contentData); };
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
      title="Edit Content"
      data={info}
      setData={setInfo}
      inputFieldProps={contentAttr}
      submitHandler={submitHandler}
      target="/admin/contents"
      successMessage="Content Updated Successfully! Redirecting..."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    />
  );
}
