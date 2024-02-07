import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";
import { getDateTime } from "../../utils/function";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
  EditButton,
} from "../../components";
import userReducer from "./state/reducer";
import { getAll, del, unDelete } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Users() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, users, usersCount }, dispatch] =
    useReducer(userReducer, {
      loading: true,
      error: "",
    });

  const deleteUser = async (id) => {
    await del(dispatch, token, id);
  };

  const reCreateUser = async (id) => {
    await unDelete(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, curPage, resultPerPage, query]);

  useEffect(() => {
    if (error) toast.error(error, toastOptions);
  }, [error]);

  const numOfPages = Math.ceil(usersCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Image",
    "Fullname",
    "Email",
    "Mobile No.",
    "Country",
    "City",
    // "Role",
    "Reg. Date",
    "Action",
  ];

  console.log({ loading })
  useTitle("Users Table");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <CustomTable
          loading={loading}
          column={column}
          rowNo={resultPerPage}
          rowProps={{ setResultPerPage }}
          paging={numOfPages > 0}
          pageProps={{ numOfPages, curPage }}
          pageHandler={curPageHandler}
          search={true}
          searchProps={{ searchInput, setSearchInput, setQuery }}
          isCreateBtn={true}
          createBtnProps={{ createURL: "/admin/user/create", text: "User" }}
        >
          {users &&
            users.map((user, i) => (
              <tr key={user.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>
                  <img
                    className="td-img"
                    src={user.avatar}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.mobile_no}</td>
                <td>{user.country}</td>
                <td>{user.city}</td>
                {/* <td>{user.userRole?.role}</td> */}
                <td>{getDateTime(user.createdAt)}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/user/${user.id}`)}
                  />
                  {user.deletedAt ?
                    <EditButton onClick={() => reCreateUser(user.id)} margin="ms-2" /> :
                    <DeleteButton onClick={() => deleteUser(user.id)} />
                  }
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}