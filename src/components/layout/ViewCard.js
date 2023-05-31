import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { getDateTime } from '../../utils/function';

/**
 * Renders a card component to display details with optional loading state and edit functionality.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.loading - Specifies whether the component is in a loading state.
 * @param {function} props.setModalShow - Function to toggle the modal show state.
 * @param {Object} props.data - The data object containing the details to display.
 * @param {Object} props.keyProps - An object containing key-value pairs for mapping keys to attribute names.
 * @returns {JSX.Element} The rendered card component.
 * 
 * @example
 * // Example usage of the ViewCard component
 * <ViewCard
 *   loading={false}
 *   setModalShow={handleModalToggle}
 *   data={{
 *     fullname: 'John Doe',
 *     createdAt: '2022-05-15T10:30:00Z',
 *     updatedAt: '2022-05-20T14:45:00Z',
 *   }}
 *   keyProps={{
 *     name: 'fullname',
 *     created: 'createdAt',
 *     updated: 'updatedAt',
 *   }}
 * >
 *   <CustomComponent />
 * </ViewCard>
 **/

export default function ViewCard(props) {
  console.log({ props })
  const {
    loading,
    setModalShow,
    data,
    keyProps,
  } = props;

  const fields = Object.entries(keyProps);
  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {loading ? (
            <Skeleton />
          ) : (
            `${data.fullname}`
          )}{" "}
          Details
        </Card.Title>
        <div className="card-tools">
          <FaEdit
            style={{ color: "blue" }}
            onClick={() => setModalShow(true)}
          />
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {fields && fields.map(([k, attr]) =>
            <Col key={k} md={4}>
              <p className="mb-0">
                <strong>{k}</strong>
              </p>
              <p>{loading ? <Skeleton /> : data[attr]}</p>
            </Col>
          )}
          <Col md={4}>
            <p className="mb-0">
              <strong>Created At</strong>
            </p>
            <p>
              {loading ? <Skeleton /> : getDateTime(data.createdAt)}
            </p>
          </Col>
          <Col md={4}>
            <p className="mb-0">
              <strong>Last Update</strong>
            </p>
            <p>
              {loading ? <Skeleton /> : getDateTime(data.updatedAt)}
            </p>
          </Col>
        </Row>
        {props.children}
      </Card.Body>
    </Card>
  )
}
