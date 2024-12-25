/* eslint-disable react/prop-types */
import { deleteProduct, getProduct, updateProduct } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Button, Form, Input, Popconfirm, Select, Table, Tooltip, Tag, Typography, Upload } from 'antd';
import { useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Product() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getAllProducts = useQuery({
        queryKey: ['productslist'],
        queryFn: getProduct,
        // staleTime: 300000,
    });

    const handleDelete = useMutation ({
      mutationFn: deleteProduct,
      mutationKey: ['deleteProduct'],
      onSuccess: (data, id) => {
        useQClient.setQueryData(['productslist'], (currProducts) => {
        //   console.log('currentproducts', currProducts, 'data', data, 'id', id)
          return {
            ...currProducts,
            data: currProducts?.data?.filter((product) => product._id !== id),
          }
        })
      }
    })

    const handleUpdateProduct = useMutation({
        mutationFn: ({id, data}) => updateProduct(id, data),
        mutationKey: ['updateProduct', editingId],
        onSuccess: (data) => {
                useQClient.setQueryData(['productslist'], (currProducts) => {
                    return {
                        ...currProducts,
                        data: currProducts?.data?.map((product) => {
                              if (product._id === data.data._id) {
                                return {...product, ...data.data}
                              }
                              else {
                                return product;
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
        title: '',
        description: '',
        photo: '',
        status: '',
        ...record,
      });
      setEditingId(record._id);
    };
    const cancel = () => {
      setEditingId('');
    };
    const save = async (id, record) => {
      try {
        const formData = new FormData();
        const row = await form.validateFields();
        Object.keys(row).forEach((key) => { 
        if(key == 'photo') {
            const file = row.photo?.fileList?.[0]?.originFileObj;
            // console.log('file', file, 'row file', )
            if (file) {
                // console.log('file', file)
                formData.append(key, file)
            }
            else {
                // console.log('row no file', row.photo)
                formData.append(key, record.photo)
            }
        }
        else {
            formData.append(key, row[key])
          }
        })

            handleUpdateProduct.mutate({id, data: formData});
            setEditingId('');
        }
        catch (errInfo) {
        console.warn('Form Validation Failed:', errInfo);
      }
    };

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        // width: '25%',
        editable: true,
        ellipsis: {
            showTitle: false,
        },
        render: (title) => (
            <Tooltip placement="top" title={title}>
                {title.length > 20 ? title.slice(0, 15) + '...' : title }
            </Tooltip>
        ),
      },
      {
        title: 'Summary',
        dataIndex: 'summary',
        // width: '30%',
        editable: true,
        ellipsis: {
            showTitle: false,
        },
        render: (summary) => (
            <Tooltip placement="top" title={summary}>
                {summary.length > 20 ? summary.slice(0, 15) + '...' : summary }
            </Tooltip>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        // width: '30%',
        editable: true,
        ellipsis: {
            showTitle: false,
        },
        render: (description) => (
            <Tooltip placement="top" title={description}>
                {description.length > 20 ? description.slice(0, 15) + '...' : description }
            </Tooltip>
        ),
      },
      {
        title: 'Image',
        dataIndex: 'photo',
        // width: '20%',
        render: (imgUrl, record) => {
           return  <img src={imgUrl} alt={`${record.title} product photo`} />
        },
        editable: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        // width: '10%',
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
        // width: '15%',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link onClick={() => save(record._id, record)} style={{marginInlineEnd: 8,}}>
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
          inputType: col.dataIndex === 'status' ? 'select' : col.dataIndex === 'photo' ? 'upload' : 'text',
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
              <h1 className="text-2xl font-semibold">Products List</h1>
              <Link to="/product/add" className="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 hover:text-white rounded-md px-3 py-2 transition duration-200">Add Product</Link>
            </div>
          )}
          loading={getAllProducts.isLoading}
          dataSource={getAllProducts?.data?.data || []}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    )
}

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
    }) => {
        let inputNode = null;
        switch (inputType) {
            // case 'number':
            //     inputNode = <InputNumber />;
            //     break;
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
            case 'upload':
                    inputNode = <Upload beforeUpload={() => false} listType="picture" defaultFileList={[{uid: record._id, url: record.photo}]}>
                        <Button className="text-2xl p-3" type="primary" icon={<MdFileUpload />}></Button>
                    </Upload>
                    
                break;
            default:
                inputNode = <Input />;
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