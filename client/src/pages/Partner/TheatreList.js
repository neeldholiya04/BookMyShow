import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import TheatreFormModal from './TheatreFormModal';
import DeleteTheatreModal from './DeleteTheatreModal';
import ShowModal from './ShowModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllTheatres } from '../../calls/theatres';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/loaderSlice';

const TheatreList = () => {
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState(null);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatres({ owner: user._id });
      if (response.success) {
        const allTheatres = response.data.map(item => ({ ...item, key: `theatre${item._id}` }));
        setTheatres(allTheatres);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, data) => data.isActive ? 'Approved' : 'Pending/Blocked'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, data) => (
        <div className='d-flex align-items-center gap-10'>
          <Button onClick={() => handleEdit(data)}><EditOutlined /></Button>
          <Button onClick={() => handleDelete(data)}><DeleteOutlined /></Button>
          {data.isActive && <Button onClick={() => handleShow(data)}>+ Shows</Button>}
        </div>
      )
    },
  ];

  const handleEdit = (data) => {
    setIsModalOpen(true);
    setFormType("edit");
    setSelectedTheatre(data);
  };

  const handleDelete = (data) => {
    setIsDeleteModalOpen(true);
    setSelectedTheatre(data);
  };

  const handleShow = (data) => {
    setIsShowModalOpen(true);
    setSelectedTheatre(data);
  };

  return (
    <>
      <div className='d-flex justify-content-end'>
        <Button type="primary" onClick={() => { setIsModalOpen(true); setFormType("add") }}>Add Theatre</Button>
      </div>
      <Table dataSource={theatres} columns={columns} />
      {isModalOpen && <TheatreFormModal isModalOpen={isModalOpen} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} setIsModalOpen={setIsModalOpen} formType={formType} getData={getData} />}
      {isDeleteModalOpen && <DeleteTheatreModal isDeleteModalOpen={isDeleteModalOpen} selectedTheatre={selectedTheatre} setIsDeleteModalOpen={setIsDeleteModalOpen} setSelectedTheatre={setSelectedTheatre} getData={getData} />}
      {isShowModalOpen && <ShowModal isShowModalOpen={isShowModalOpen} setIsShowModalOpen={setIsShowModalOpen} selectedTheatre={selectedTheatre} />}
    </>
  );
};

export default TheatreList;
