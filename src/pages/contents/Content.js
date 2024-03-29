
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors, clearSuccess } from "../../states/actions";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  DeleteButton,
  EditButton,
} from "../../components";
import reducer from "./state/reducer";
import { update, getContent } from "./state/action";
import { toastOptions } from "../../utils/error";
import { Button, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const ContentCard = ({ content, url, text, onEdit, onDelete, ...props }) => {
  const navigate = useNavigate();
  console.log({ c: props.children });
  return (
    <Card>
      <Card.Header>
        {content || props.children ?
          <>
            <h3 className="mb-0 d-inline">{text}</h3>
            <div className="float-end">
              <EditButton onClick={onEdit} />
              <DeleteButton onClick={onDelete} />
            </div>
          </>
          : <Button
            onClick={() => navigate(url)}
            type="success"
            className="btn btn-primary btn-block mt-1"
          >
            Add {text}
          </Button>}
      </Card.Header>
      <Card.Body style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
        {props.children}
      </Card.Body>
    </Card >
  )
};

export default function Content() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, loadingUpdate, error, content, success }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUpdate: false,
      error: "",
    });

  const deleteContent = async (info) => {
    await update(dispatch, token, info);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getContent(dispatch, token);
    }
    fetchData();
  }, [token, loadingUpdate]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }

    if (success) {
      toast.success("Content Deleted Successfully.", toastOptions);
      clearSuccess(dispatch);
    }
  }, [error, success]);

  useTitle("Contents");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (loading ? <Skeleton count={5} height={40} /> :
        <>
          <ContentCard
            content={content?.terms_and_cond}
            url="/admin/content/create/?TYPE=TC"
            text="Terms & Conditions"
            onEdit={() => navigate("/admin/content/edit/?TYPE=TC")}
            onDelete={() => deleteContent({ terms_and_cond: "" })}
          />
          <br />
          <ContentCard
            content={content?.privacy_policy}
            url="/admin/content/create/?TYPE=PP"
            text="Privacy Policy"
            onEdit={() => navigate("/admin/content/edit/?TYPE=PP")}
            onDelete={() => deleteContent({ privacy_policy: "" })}
          />
          <br />
          <ContentCard
            content={content?.about_us}
            url="/admin/content/create/?TYPE=ABOUT_US"
            text="About Us"
            onEdit={() => navigate("/admin/content/edit/?TYPE=ABOUT_US")}
            onDelete={() => deleteContent({ about_us: "" })}
          />
          <br />
          <ContentCard
            url="/admin/content/create/?TYPE=CONTACT_US"
            text="Contact Us"
            onEdit={() => navigate("/admin/content/edit/?TYPE=CONTACT_US")}
            onDelete={() => deleteContent({
              email: "", contact_no: ""
            })}
          >
            {content && content.email && content.contact_no &&
              <>
                <p className="p-bold">Email: {content.email}</p>
                <p className="p-bold">Contact No.: {content.contact_no}</p>
              </>
            }
          </ContentCard>
        </>
      )}
      <ToastContainer />
    </MotionDiv >
  );
}
