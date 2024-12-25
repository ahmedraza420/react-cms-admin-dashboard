/* eslint-disable react/prop-types */
import { deleteShipping, getShipping, updateShipping } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form, Input, InputNumber, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import { useState } from "react";
import { Link } from "react-router-dom";


export default function Shipping() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getShippingList = useQuery({
        queryKey: ['shippinglist'],
        queryFn: getShipping,
        // staleTime: 300000,
    });

    const handleDelete = useMutation ({
      mutationFn: deleteShipping,
      mutationKey: ['deleteshipping'],
      onSuccess: (data) => {
        useQClient.setQueryData(['shippinglist'], (currShip) => {
          return {
            ...currShip,
            data: currShip?.data?.filter((shipping) => shipping._id !== data.data._id),
          }
        })
      }
    })

    const handleUpdateShipping = useMutation({
        mutationFn: ({id, data}) => updateShipping(id, data),
        mutationKey: ['updateProduct', editingId],
        onSuccess: (data) => {
                useQClient.setQueryData(['shippinglist'], (currShip) => {
                    return {
                        ...currShip,
                        data: currShip?.data?.map((shipping) => {
                              if (shipping._id === data.data._id) {
                                return {...shipping, ...data.data}
                              }
                              else {
                                return shipping;
                              }
                            })
                    }
                });
            },
        onError: (error) => {
                console.warn('error', error);
            }
        });

    const edit = (record) => {
      form.setFieldsValue({
        type: '',
        price: '',
        status: '',
        ...record,
      });
      setEditingId(record._id);
    };
    const cancel = () => {
      setEditingId('');
    };
    const save = async (id) => {
      try {
        const row = await form.validateFields();

            handleUpdateShipping.mutate({id, data: row});
            setEditingId('');
        }
        catch (errInfo) {
        console.warn('Form Validation Failed:', errInfo);
      }
    };

    const columns = [
      {
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        elipsis: true,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        editable: true,
        elipsis: true,
      },
      {
        title: 'status',
        dataIndex: 'status',
        editable: true,
        render: (status) => {
           return <span>
               <Tag color={status.toLowerCase() == 'active' ? 'green' : 'volcano'}>
                    {status.toUpperCase()}
                </Tag>
            </span>
        }
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '15%',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link onClick={() => save(record._id)} style={{marginInlineEnd: 8,}}>
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Typography.Link disabled={editingId !== ''} onClick={() => edit(record)}>
                Edit
              </Typography.Link>
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete.mutate(record._id)}>
              <a className="text-red-600">Delete</a>
            </Popconfirm>
            </div>
          );
        },
      },
    ];

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === 'status' ? 'select' : col.dataIndex === 'price' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
    
    return (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          title={() => (
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Shipping List</h1>
              <Link to="/shipping/add" className="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 hover:text-white rounded-md px-3 py-2 transition duration-200">Add Shipping</Link>
            </div>
          )}
          loading={getShippingList.isLoading}
          dataSource={getShippingList?.data?.data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    );
}

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    index,
    children,
    ...restProps
    }) => {
        let inputNode = null;
        switch (inputType) {
            case 'number':
                inputNode = <InputNumber prefix="Rs " type='number' style={{minWidth: '100%'}}/>;
                break;
            case 'select':
                inputNode = <Select options={[
                    {
                      value: 'Active',
                      label: 'Active',
                    },
                    {
                      value: 'Inactive',
                      label: 'Inactive',
                    },]}/>
                break;
            default:
                inputNode = <Input />;
        }
        return (
        <td {...restProps} key={index}>
            {editing ? (
            <Form.Item name={dataIndex} style={{ margin: 0,}} rules={[{ required: true, message: `Please Input ${title}!`, }, ]}>
                {inputNode}
            </Form.Item>
            ) : (
            children
            )}
        </td>
        );
};
