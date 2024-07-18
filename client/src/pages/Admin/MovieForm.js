import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { addMovie, updateMovie } from '../../calls/movies';
import { showLoading, hideLoading } from '../../redux/loaderSlice';

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      'YYYY-MM-DD'
    );
  }

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;
      if (formType === 'add') {
        response = await addMovie(values);
        setSelectedMovie(null);
      } else {
        response = await updateMovie({ ...values, movieId: selectedMovie._id });
        setSelectedMovie(null);
      }
      console.log(response);
      if (response.success) {
        getData();
        message.success(response.message);
        setIsModalOpen(false);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      centered
      title={formType === 'add' ? 'Add Movie' : 'Edit Movie'}
      visible={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onFinish();
          }}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        initialValues={selectedMovie}
        onFinish={onFinish}
      >
        <Form.Item
          label="Movie Name"
          name="title"
          rules={[{ required: true, message: 'Movie name is required!' }]}
        >
          <Input placeholder="Enter the movie name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required!' }]}
        >
          <TextArea rows={4} placeholder="Enter the description" />
        </Form.Item>
        <Form.Item
          label="Movie Duration (in min)"
          name="duration"
          rules={[{ required: true, message: 'Movie duration is required!' }]}
        >
          <Input type="number" placeholder="Enter the movie duration" />
        </Form.Item>
        <Form.Item
          label="Select Movie Language"
          name="language"
          rules={[{ required: true, message: 'Movie language is required!' }]}
        >
          <Select style={{ width: '100%', height: '45px' }} onChange={handleChange}>
            {['English', 'Hindi', 'Punjabi', 'Telugu', 'Bengali', 'German'].map((lang) => (
              <Select.Option key={lang} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Release Date"
          name="releaseDate"
          rules={[{ required: true, message: 'Movie Release Date is required!' }]}
        >
          <Input type="date" placeholder="Choose the release date" />
        </Form.Item>
        <Form.Item
          label="Select Movie Genre"
          name="genre"
          rules={[{ required: true, message: 'Movie genre is required!' }]}
        >
          <Select style={{ width: '100%' }} onChange={handleChange}>
            {['Action', 'Comedy', 'Horror', 'Love', 'Patriot', 'Bhakti', 'Thriller', 'Mystery'].map((genre) => (
              <Select.Option key={genre} value={genre}>
                {genre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Poster URL"
          name="poster"
          rules={[{ required: true, message: 'Movie Poster URL is required!' }]}
        >
          <Input type="text" placeholder="Enter the poster URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieForm;
