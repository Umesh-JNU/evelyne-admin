import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
  ArrayView
} from "../../components";
import warehouseReducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { IoMdOpen } from "react-icons/io";

export default function Warehouse() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);
  const [modalShow, setModalShow] = useState(false);
  const [controllers, setControllers] = useState([]);
  const showModelHandler = (ls) => {
    // // console.log("product_list", ls);
    setControllers([...ls]);
    setModalShow(true);
  };

  const [{ loading, error, warehouses, warehousesCount }, dispatch] =
    useReducer(warehouseReducer, {
      loading: true,
      error: "",
    });

  const deleteWarehouse = async (id) => {
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

  const numOfPages = Math.ceil(warehousesCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Image",
    "Name",
    "Capacity",
    "Filled",
    "Manager",
    "Controller",
    "Action",
  ];

  useTitle("Warehouse Table");
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
          createBtnProps={{ createURL: "/admin/warehouse/create", text: "Warehouse" }}
        >
          {warehouses &&
            warehouses.map((warehouse, i) => (
              <tr key={warehouse.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>
                  <img
                    className="td-img"
                    src={warehouse.image}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{warehouse.name}</td>
                <td>{warehouse.capacity}</td>
                <td>{warehouse.filled}</td>
                <td>{warehouse.manager ? warehouse.manager.fullname : (<strong>Not Assigned</strong>)}</td>
                <td>
                  <IoMdOpen
                    className="open-model"
                    onClick={() => showModelHandler(warehouse.controller)}
                  />
                </td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/warehouse/${warehouse.id}`)}
                  />
                  <DeleteButton onClick={() => deleteWarehouse(warehouse.id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      {controllers && modalShow ? (
        <ArrayView
          show={modalShow}
          onHide={() => setModalShow(false)}
          arr={controllers}
          column={{ "Id": "id", "Fullname": "fullname" }}
          title="Controllers List"
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
