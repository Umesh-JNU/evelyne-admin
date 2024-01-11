import React, { useContext, useMemo, useReducer, useRef, useState } from "react";
import { Store } from "../../states/store";
import { useSearchParams } from "react-router-dom";
import JoditEditor from 'jodit-react';

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, TextInput } from "../../components";

const key = {
  TC: 'terms_and_cond',
  PP: 'privacy_policy',
  ABOUT_US: 'about_us'
};

export default function AddContent() {
  const { state } = useContext(Store);
  const { token } = state;

  const [searchParams, _] = useSearchParams(document.location.search);
  const contentType = searchParams.get('TYPE');
  const title = {
    TC: 'Terms & Conditions',
    PP: 'Privacy Policy',
    ABOUT_US: 'About Us',
    CONTACT_US: 'Contact Us'
  }[contentType];

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const editor = useRef();
  const [content, setContent] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Write your content here...'
  }), []);

  const resetForm = () => {
    setContent("");
    setEmail("");
    setContact("");
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, contentType === 'CONTACT_US' ? { email, contact_no: contact } : { [key[contentType]]: content });
    resetForm();
  };

  useTitle(`Content | ${title}`);
  return (
    <AddForm
      title={`Add ${title}`}
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/contents"
      successMessage={`${title} Created Successfully!`}
      reducerProps={{ loading, error, success, dispatch }}
    >
      {contentType === 'CONTACT_US' ?
        <>
          <TextInput placeholder="Enter Email" label="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
          <TextInput placeholder="Enter Contact Number" label="Contact No." onChange={(e) => setContact(e.target.value)} />
        </> :
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1} // tabIndex of textarea
          // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={newContent => setContent(newContent)}
        />
      }
      {/* {content} */}
      <ToastContainer />
    </AddForm>
  );
}