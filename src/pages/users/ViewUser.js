import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditUserModel from "./EditUser.js";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${user.fullname} Details`;
  useTitle(title);

  console.log({ user });
  return (
    <ViewCard
      title={user && `${user.fullname} Details`}
      data={{ ...user, role: user?.userRole?.role }}
      setModalShow={setModalShow}
      isImage={true}
      image_url={user?.avatar}
      keyProps={{ "Fullname": "fullname", "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city", "Role": "role", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <EditUserModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewUser;
