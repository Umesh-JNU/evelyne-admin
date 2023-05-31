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
} from "../../components";
import managerReducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Managers() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, managers, managersCount }, dispatch] =
    useReducer(managerReducer, {
      loading: true,
      error: "",
    });

  const deleteManager = async (id) => {
    await del(dispatch, token, id);
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

  const numOfPages = Math.ceil(managersCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Fullname",
    "Email",
    "Mobile No.",
    "Warehouse",
    "Country",
    "City",
    "Reg. Date",
    "Action",
  ];

  useTitle("Managers Table");
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
          createBtnProps={{ createURL: "/admin/manager/create", text: "Manager" }}
        >
          {managers &&
            managers.map((manager, i) => (
              <tr key={manager.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{manager.fullname}</td>
                <td>{manager.email}</td>
                <td>{manager.mobile_no}</td>
                <td>{manager.warehouse ? manager.warehouse.name : (<strong>Not Assigned</strong>)}</td>
                <td>{manager.country}</td>
                <td>{manager.city}</td>
                <td>{getDateTime(manager.createdAt)}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/manager/${manager.id}`)}
                  />
                  <DeleteButton onClick={() => deleteManager(manager.id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}