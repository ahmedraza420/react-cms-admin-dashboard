/* eslint-disable react/prop-types */
import { deleteOrder, getOrders, updateOrder } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import { useState } from "react";


export default function Order() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getOrdersList = useQuery({
        queryKey: ['orderslist'],
        queryFn: getOrders,
    });

    const handleDelete = useMutation ({
      mutationFn: deleteOrder,
      mutationKey: ['deleteorder'],
      onSuccess: () => {
        // useQClient.setQueryData(['orderslist'], (currOrders) => {
        //   return {
        //     ...currOrders,
        //     data: currOrders?.data?.filter((order) => order._id !== data.data._id),
        //   }
        // })
      }
    })

    const handleUpdateOrder = useMutation({
        mutationFn: ({id, data}) => updateOrder(id, data),
        mutationKey: ['updateorder', editingId],
        onSuccess: ({data}) => {
                useQClient.setQueryData(['orderslist'], (currOrders) => {
                    // console.log('currorders', currOrders.data[0]._id, 'data', data._id, currOrders.data[0]._id === data._id)
                    return {
                        ...currOrders,
                        data: currOrders?.data?.map((order) => {
                            // console.log(order, data)
                            if (order._id === data?._id) {
                              return {...order, ...data}
                            }
                            else {
                              return order;
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
            // console.log(id, row);
            handleUpdateOrder.mutate({id, data : row});
            setEditingId('');
        }
        catch (errInfo) {
            console.warn('Form Validation Failed:', errInfo);
        }
    };

    const columns = [
      {
        title: 'Order No.',
        dataIndex: 'orderNumber',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        width: '90px',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'Charge',
        dataIndex: 'charge',
        width: '90px',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'Total',
        dataIndex: 'totalAmount',
        width: '90px',
        // editable: true,
        ellipsis: true,
      },
      {
        title: 'status',
        dataIndex: 'status',
        width: '120px', 
        editable: true,
        render: (status) => {
           return <span>
               <Tag color={status.toLowerCase() == 'new' ? 'blue' : status.toLowerCase() == 'processing' || status.toLowerCase() == 'active' ? 'green' : status.toLowerCase() == 'delivered' ? '#55555580' : 'orange'}>
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
        //   inputType: col.dataIndex === 'status' ? 'select' : col.dataIndex === 'price' || col.dataIndex === '' ? 'upload' : 'text', // may need this later
        inputType: col.dataIndex === 'status' ? 'select' : 'text',
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
              <h1 className="text-2xl font-semibold">Orders</h1>
          )}
          loading={getOrdersList.isLoading}
          dataSource={getOrdersList?.data?.data}
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
            case 'select':
                inputNode = <Select options={[
                    { value: 'Active', label: 'Active', },
                    { value: 'Inactive', label: 'Inactive', },
                    { value: 'New', label: 'New', },
                    { value: 'Processing', label: 'Processing', },
                    { value: 'Delivered', label: 'Delivered', },
                    { value: 'Cancelled', label: 'Cancelled', },
                ]}/>
                break;
            default:
                inputType = 'text';
        }
        // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
