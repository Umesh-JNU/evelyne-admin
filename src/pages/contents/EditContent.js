import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Store } from "../../states/store";
import { useSearchParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getContent, update } from "./state/action";
import { AddForm, TextInput } from "../../components";
import { ToastContainer } from "react-toastify";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

const key = {
  TC: 'terms_and_cond',
  PP: 'privacy_policy',
  ABOUT_US: 'about_us'
};

export default function EditContent() {
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

  const [{ loading, error, loadingUpdate, content, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const editor = useRef();
  const [value, setValue] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Write your content here...'
  }), []);

  useEffect(() => {
    (async () => {
      await getContent(dispatch, token);
    })();
  }, []);

  useEffect(() => {
    if (content) {
      console.log({ content })
      if (contentType === 'CONTACT_US') {
        setEmail(content.email);
        setContact(content.contact_no);
      } else {
        setValue(content[key[contentType]]);
      }
    }
  }, [content]);

  const resetForm = () => {
    setValue("");
    setEmail("");
    setContact("");
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, contentType === 'CONTACT_US' ? { email, contact_no: contact } : { [key[contentType]]: value });
    if (success) {
      resetForm();
    }
  };

  return (
    <AddForm
      addEditText={'Edit'}
      title={`Edit ${title}`}
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target="/admin/contents"
      successMessage={`${title} Updated Successfully! Redirecting...`}
      reducerProps={{ loading: loadingUpdate, error, success, dispatch }}
    >
      {loading ? <Skeleton count={5} height={40} /> : contentType === 'CONTACT_US' ?
        <>
          <TextInput placeholder="Enter Email" label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required={true} />
          <TextInput placeholder="Enter Contact Number" label="Contact No." name="contact_no" value={contact} onChange={(e) => setContact(e.target.value)} required={true} />
        </> :
        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          tabIndex={1} // tabIndex of textarea
          // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={newContent => setValue(newContent)}
        />}
      {/* {content} */}
      <ToastContainer />
    </AddForm>
  );
}