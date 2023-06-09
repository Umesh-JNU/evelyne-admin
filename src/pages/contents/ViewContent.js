import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditContentModel from "./EditContent";

const keyProps = {
  "Content Id": "id", "Contact No.": "contact_no", "Email": "email", "About Us": "about_us", "Created At": "createdAt", "Last Update": "updatedAt"
};

const ViewContent = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // content/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, content }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useTitle("Content Details");
  return (
    <ViewCard
      title={"Content Details"}
      data={content}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditContentModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {!modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewContent;
