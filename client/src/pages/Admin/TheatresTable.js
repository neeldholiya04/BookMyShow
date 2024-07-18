import React, { useState, useEffect } from 'react';
import { getAllTheatresForAdmin, updateTheatre } from '../../calls/theatres';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import { message, Button, Table } from 'antd';

const TheatresTable = () => {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const fetchTheatres = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresForAdmin();
      if (response.success) {
        const allTheatres = response.data.map(item => ({ ...item, key: `theatre${item._id}` }));
        setTheatres(allTheatres);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(showLoading());
      const updatedTheatre = { ...theatre, isActive: !theatre.isActive };
      const response = await updateTheatre(updatedTheatre);
      if (response.success) {
        message.success(response.message);
        fetchTheatres();
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Owner',
      dataIndex: 'owner',
      render: (owner) => owner && owner.name,
    },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive) => isActive ? 'Approved' : 'Pending/Blocked',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, theatre) => (
        <Button onClick={() => handleStatusChange(theatre)}>
          {theatre.isActive ? 'Block' : 'Approve'}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <Table dataSource={theatres} columns={columns} />
  );
};

export default TheatresTable;
