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
import reducer from "./state/reducer";
import { IoMdOpen } from "react-icons/io"
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Orders() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);
  const [modalShow, setModalShow] = useState(false);
  const [items, setItems] = useState([]);
  const showModelHandler = (ls) => {
    // // console.log("product_list", ls);
    setItems([...ls]);
    setModalShow(true);
  };

  const [{ loading, error, orders, ordersCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteOrder = async (id) => {
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

  const numOfPages = Math.ceil(ordersCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Order Id",
    "Items",
    "User",
    "Warehouse",
    "Address",
    "Status",
    "Action",
  ];

  useTitle("orders Table");
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
          createBtnProps={{ createURL: "/admin/order/create", text: "Order" }}
        >
          {orders &&
            orders.map((order, i) => (
              <tr key={order.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{order.id}</td>
                <td>
                  <IoMdOpen
                    className="open-model"
                    onClick={() => showModelHandler(order.items)}
                  />
                </td>
                <td>{order.user?.fullname}</td>
                <td>{order.warehouse?.name}</td>
                <td>{order.address}</td>
                <td>{order.status}</td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/order/${order.id}`)}
                  />
                  <DeleteButton onClick={() => deleteOrder(order.id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      {items && modalShow ? (
        <ArrayView
          show={modalShow}
          onHide={() => setModalShow(false)}
          arr={items}
          column={{ "Item": "name", "Quantity": "quantity" }}
          title="Item List"
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}