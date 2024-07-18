import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Form, Input, Button, Select, Table, message } from "antd";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { getAllMovies } from "../../calls/movies";
import { addShow, deleteShow, getShowsByTheatre, updateShow } from "../../calls/shows";
import moment from "moment";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ShowModal = ({ isShowModalOpen, setIsShowModalOpen, selectedTheatre }) => {
  const [view, setView] = useState("table");
  const [movies, setMovies] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const movieResponse = await getAllMovies();
      if (movieResponse.success) {
        setMovies(movieResponse.data);
      } else {
        message.error(movieResponse.message);
      }

      const showResponse = await getShowsByTheatre({ theatreId: selectedTheatre._id });
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        message.error(showResponse.message);
      }

      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;
      if (view === "form") {
        response = await addShow({ ...values, theatre: selectedTheatre._id });
      } else {
        response = await updateShow({ ...values, showId: selectedShow._id, theatre: selectedTheatre._id });
      }
      if (response.success) {
        getData();
        message.success(response.message);
        setView("table");
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    setIsShowModalOpen(false);
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(showLoading());
      const response = await deleteShow({ showId });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const columns = [
    { title: "Show Name", dataIndex: "name", key: "name" },
    {
      title: "Show Date",
      dataIndex: "date",
      render: (text, record) => moment(text).format("MMM Do YYYY"),
    },
    {
      title: "Show Time",
      dataIndex: "time",
      render: (text, record) => moment(text, "HH:mm").format("hh:mm A"),
    },
    { title: "Movie", dataIndex: "movie", render: (text, record) => record.movie.title },
    { title: "Ticket Price", dataIndex: "ticketPrice", key: "ticketPrice" },
    { title: "Total Seats", dataIndex: "totalSeats", key: "totalSeats" },
    {
      title: "Available Seats",
      dataIndex: "seats",
      render: (text, record) => record.totalSeats - record.bookedSeats.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex align-items-center gap-10">
          <Button onClick={() => {
            setView("edit");
            setSelectedMovie(record.movie);
            setSelectedShow({ ...record, date: moment(record.date).format("YYYY-MM-DD") });
          }}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDelete(record._id)}>
            <DeleteOutlined />
          </Button>
          {record.isActive && (
            <Button onClick={() => setIsShowModalOpen(true)}>
              + Shows
            </Button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      centered
      title={selectedTheatre.name}
      visible={isShowModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div className="d-flex justify-content-between">
        <h3>
          {view === "table"
            ? "List of Shows"
            : view === "form"
              ? "Add Show"
              : "Edit Show"}
        </h3>
        {view === "table" && (
          <Button type="primary" onClick={() => setView("form")}>
            Add Show
          </Button>
        )}
      </div>
      {view === "table" && <Table dataSource={shows} columns={columns} />}
      {(view === "form" || view === "edit") && (
        <Form
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={view === "edit" ? selectedShow : null}
          onFinish={onFinish}
        >
          <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
            <Col span={24}>
              <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                <Col span={8}>
                  <Form.Item
                    label="Show Name"
                    name="name"
                    className="d-block"
                    rules={[{ required: true, message: "Show name is required!" }]}
                  >
                    <Input placeholder="Enter the show name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Show Date"
                    name="date"
                    className="d-block"
                    rules={[{ required: true, message: "Show date is required!" }]}
                  >
                    <Input type="date" placeholder="Enter the show date" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Show Timing"
                    name="time"
                    className="d-block"
                    rules={[{ required: true, message: "Show time is required!" }]}
                  >
                    <Input type="time" placeholder="Enter the show time" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                <Col span={8}>
                  <Form.Item
                    label="Select the Movie"
                    name="movie"
                    className="d-block"
                    rules={[{ required: true, message: "Movie is required!" }]}
                  >
                    <Select
                      placeholder="Select Movie"
                      defaultValue={selectedMovie && selectedMovie.title}
                      options={movies.map(movie => ({
                        key: movie._id,
                        value: movie._id,
                        label: movie.title,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ticket Price"
                    name="ticketPrice"
                    className="d-block"
                    rules={[{ required: true, message: "Ticket price is required!" }]}
                  >
                    <Input type="number" placeholder="Enter the ticket price" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Total Seats"
                    name="totalSeats"
                    className="d-block"
                    rules={[{ required: true, message: "Total seats are required!" }]}
                  >
                    <Input type="number" placeholder="Enter the number of total seats" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="d-flex gap-10">
            <Button
              block
              onClick={() => setView("table")}
              htmlType="button"
            >
              <ArrowLeftOutlined /> Go Back
            </Button>
            <Button
              block
              type="primary"
              htmlType="submit"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              {view === "form" ? "Add the Show" : "Edit the Show"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ShowModal;
