import React from 'react';
import { Modal, message } from 'antd';
import { deleteMovie } from '../../calls/movies';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { useDispatch } from 'react-redux';

const DeleteMovieModal = ({ isDeleteModalOpen, setIsDeleteModalOpen, selectedMovie, setSelectedMovie, getData }) => {
    const dispatch = useDispatch();

    const handleOk = async () => {
        try {
            dispatch(showLoading());
            const movieId = selectedMovie._id;
            const response = await deleteMovie({ movieId });

            if (response.success) {
                message.success(response.message);
                getData();
            } else {
                message.error(response.message);
                setSelectedMovie(null);
            }

            setIsDeleteModalOpen(false);
        } catch (err) {
            message.error(err.message);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <Modal
            title="Delete Movie?"
            visible={isDeleteModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Delete"
            cancelText="Cancel"
        >
            <p className="pt-3 fs-18">Are you sure you want to delete this movie?</p>
            <p className="pb-3 fs-18">This action can't be undone and you'll lose this movie data.</p>
        </Modal>
    );
};

export default DeleteMovieModal;
