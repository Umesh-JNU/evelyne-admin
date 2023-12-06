import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";
import { IoMdOpen } from "react-icons/io";

export default function Users() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, contents, contentsCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteContent = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, curPage, resultPerPage, query]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const numOfPages = Math.ceil(contentsCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
    "Contact No.",
    "Email",
    "About Us",
    "T&C",
    "Privacy Policy",
    "Action",
  ];

  useTitle("Contents");
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
          isCreateBtn={contents && contents.length === 1 ? false : true}
          createBtnProps={{ createURL: "/admin/content/create", text: "Content" }}
          isTitle={contents && contents.length === 1 ? true : false}
          title={'Content'}
        >
          {contents &&
            contents.map((content, i) => (
              <tr key={content.id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
                <td>{content.contact_no}</td>
                <td>{content.email}</td>
                <td>{content.about_us}</td>
                <td>
                  <IoMdOpen
                    className="open-model"
                    onClick={() => navigate(`/admin/view/content/${content.id}`)}
                  />
                </td>
                <td>
                  <IoMdOpen
                    className="open-model"
                    onClick={() => navigate(`/admin/view/content/${content.id}`)}
                  />
                </td>
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/content/${content.id}`)}
                  />
                  <DeleteButton onClick={() => deleteContent(content.id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}