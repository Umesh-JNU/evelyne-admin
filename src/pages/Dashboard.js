import React, { useContext, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
// icons
import { MdManageAccounts } from "react-icons/md";
import { FaArrowCircleRight, FaWarehouse, FaUserCircle, FaShoppingBasket } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa6";

import Skeleton from "react-loading-skeleton";
import axiosInstance from "../utils/axiosUtil";
import { getError } from "../utils/error";
import { MotionDiv, MessageBox, CountUp } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const card = [
  {
    key: "warehouse",
    bg: "primary",
    icon: <FaWarehouse />,
    text: "Warehouse",
    url: "/admin/warehouses"
  },
  {
    key: "manager",
    bg: "warning",
    icon: <MdManageAccounts />,
    text: "Managers",
    url: "/admin/managers"
  },
  {
    key: "controller",
    bg: "warning",
    icon: <FaHouseUser />,
    text: "Controllers",
    url: "/admin/controllers"
  },
  {
    key: "user",
    bg: "warning",
    icon: <FaUserCircle />,
    text: "Users",
    url: "/admin/users"
  },
  {
    key: "in-bound",
    bg: "info",
    icon: <FaShoppingBasket />,
    text: "In-bound Order",
    url: "/admin/orders"
  },
  {
    key: "out-bound",
    bg: "info",
    icon: <FaShoppingBasket />,
    text: "Out-bound Order",
    url: "/admin/orders"
  },
  {
    key: "arrived",
    bg: "info",
    icon: <FaShoppingBasket />,
    text: "Arrived Order",
    url: "/admin/orders"
  },
  {
    key: "exit",
    bg: "info",
    icon: <FaShoppingBasket />,
    text: "Exit Order",
    url: "/admin/orders"
  },
  {
    key: "tranship",
    bg: "info",
    icon: <FaShoppingBasket />,
    text: "Tranship Order",
    url: "/admin/orders"
  },
  {
    key: "discarded",
    bg: "danger",
    icon: <FaShoppingBasket />,
    text: "Discarded Order",
    url: "/admin/orders"
  }
];

const ViewCard = ({ loading, data, bg, icon, text, url }) => {
  return (
    <div>
      {loading ? (
        <Skeleton count={5} />
      ) : (
        <div className={`small-box bg-${bg}`}>
          {/* <div className="inner p-sm-1 p-md-2 p-lg-3"> */}
          <div className="inner">
            <CountUp start={0} end={data} duration={2} />
            {/* <h1>
              {data && data[0] ? data[0].total : 0}
            </h1> */}
            <h5 style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap', 
              textOverflow: 'ellipsis'
            }}>{text}</h5>
          </div>
          <div className="icon">
            {icon}
          </div>
          <Link to={url} className="small-box-footer">
            More info {<FaArrowCircleRight />}
          </Link>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axiosInstance.get(
          `/api/admin/summary`,
          {
            headers: { Authorization: token },
          }
        );
        console.log({ data })
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    })();
  }, [token]);

  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row
            className="my-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
          >
            <Col md={6}>
              <h3>Dashboard</h3>
            </Col>
            <Col md={6}></Col>
          </Row>

          <Row className="m-0 mb-3">
            {card.map(({ key, bg, icon, text, url }) => (
              <Col key={url} lg={4} md={6} sm={12} className="p-sm-1 p-md-2 p-lg-3">
                <ViewCard loading={loading} data={summary && summary[key]} bg={bg} icon={icon} text={text} url={url} />
              </Col>
            ))}
          </Row>
          <ToastContainer />
        </>
      )}
    </MotionDiv >
  );
}
