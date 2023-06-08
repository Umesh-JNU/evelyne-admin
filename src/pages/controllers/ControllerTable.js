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
  ArrayView,
} from "../../components";
import controllerReducer from "./state/reducer";
import { IoMdOpen } from "react-icons/io"
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Controllers() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);
  const [modalShow, setModalShow] = useState(false);
  const [houses, setHouses] = useState([]);
  const showModelHandler = (ls) => {
    // // console.log("product_list", ls);
    setHouses([...ls]);
    setModalShow(true);
  };

  const [{ loading, error, controllers, controllersCount }, dispatch] =
    useReducer(controllerReducer, {
      loading: true,
      error: "",
    });

  const deleteController = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, curPage, resultPerPage, query]);

  useEffect(() => {
    if(error) toast.error(error, toastOptions);
  }, [error]);

  const numOfPages = Math.ceil(controllersCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Image",
    "Fullname",
    "Email",
    "Mobile No.",
    "Warehouses",
    "Country",
    "City",
    "Reg. Date",
    "Action",
  ];

  useTitle("Controllers Table");
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
          createBtnProps={{ createURL: "/admin/controller/create", text: "Controller" }}
        >
          {controllers &&
            controllers.map((controller, i) => (
              <tr key={controller.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>
                  <img
                    className="td-img"
                    src={controller.avatar}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{controller.fullname}</td>
                <td>{controller.email}</td>
                <td>{controller.mobile_no}</td>
                <td>
                <IoMdOpen
                    className="open-model"
                    onClick={() => showModelHandler(controller.warehouses)}
                  />
                </td>
                <td>{controller.country}</td>
                <td>{controller.city}</td>
                <td>{getDateTime(controller.createdAt)}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/controller/${controller.id}`)}
                  />
                  <DeleteButton onClick={() => deleteController(controller.id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      {houses && modalShow ? (
        <ArrayView
          show={modalShow}
          onHide={() => setModalShow(false)}
          arr={houses}
          column={{ "Warehoue Id": "id", "Name": "name", "Capacity": "capacity", "Filled": "filled" }}
          title="Warehouse List"
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
