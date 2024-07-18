import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import MovieForm from "./MovieForm";
import DeleteMovieModal from "./DeleteMovieModal";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../calls/movies";
import { useDispatch } from "react-redux";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function MovieList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const fetchMovies = async () => {
    dispatch(showLoading());
    try {
      const response = await getAllMovies();
      const updatedMovies = response.data.map((movie) => ({
        ...movie,
        key: `movie${movie._id}`,
      }));
      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    setIsModalOpen(true);
    setFormType("add");
  };

  const handleEditMovie = (movie) => {
    setIsModalOpen(true);
    setSelectedMovie(movie);
    setFormType("edit");
  };

  const handleDeleteMovie = (movie) => {
    setIsDeleteModalOpen(true);
    setSelectedMovie(movie);
  };

  const tableColumns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (posterUrl) => (
        <img
          src={posterUrl}
          alt="Poster"
          style={{ width: 75, height: 115, objectFit: "cover" }}
        />
      ),
    },
    { title: "Movie Name", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration) => `${duration} Min`,
    },
    { title: "Genre", dataIndex: "genre" },
    { title: "Language", dataIndex: "language" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (releaseDate) =>
        moment(releaseDate).format("MM-DD-YYYY"),
    },
    {
      title: "Action",
      render: (_, movie) => (
        <div>
          <Button onClick={() => handleEditMovie(movie)}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDeleteMovie(movie)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleAddMovie}>Add Movie</Button>
      </div>
      
      <Table dataSource={movies} columns={tableColumns} />

      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          formType={formType}
          setSelectedMovie={setSelectedMovie}
          getData={fetchMovies}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedMovie={selectedMovie}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedMovie={setSelectedMovie}
          getData={fetchMovies}
        />
      )}
    </>
  );
}

export default MovieList;
