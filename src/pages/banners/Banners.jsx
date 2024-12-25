/* eslint-disable react/prop-types */
import { deleteBanner, getBanners, updateBanner } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Button, Form, Input, Popconfirm, Select, Table, Tag, Typography, Upload } from 'antd';
import { useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { Link } from "react-router-dom";


export default function Banners() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getBanner = useQuery({
        queryKey: ['bannerslist'],
        queryFn: getBanners,
        // staleTime: 300000,
    });

    const handleDelete = useMutation ({
      mutationFn: deleteBanner,
      mutationKey: ['deleteProduct'],
      onSuccess: (data) => {
        useQClient.setQueryData(['bannerslist'], (currentBanners) => {
          // console.log('currentbanners', currentBanners, 'data', data)
          return {
            ...currentBanners,
            data: currentBanners?.data?.filter((banner) => banner._id !== data.data._id),
          }
        })
      }
    })

    const handleUpdateBanner = useMutation({
        mutationFn: ({id, data}) => updateBanner(id, data),
        mutationKey: ['updateProduct', editingId],
        onSuccess: (data) => {
                useQClient.setQueryData(['bannerslist'], (currentBanners) => {
                    return {
                        ...currentBanners,
                        data: currentBanners?.data?.map((banner) => {
                              if (banner._id === data.data._id) {
                                return {...banner, ...data.data}
                              }
                              else {
                                return banner;
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
        bannerImage: '',
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
        const formData = new FormData();
        const row = await form.validateFields();
        Object.keys(row).forEach((key) => { 
          if(key == 'bannerImage') {
            const file = row.bannerImage?.fileList?.[0]?.originFileObj;
            if (file) {
              formData.append(key, file)
            }
          }
          else {
            formData.append(key, row[key])
          }
        })

            handleUpdateBanner.mutate({id, data: formData});
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
        width: '25%',
        editable: true,
        elipsis: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: '30%',
        editable: true,
        elipsis: true,
      },
      {
        title: 'image',
        dataIndex: 'bannerImage',
        width: '20%',
        render: (imgUrl, record) => {
           return  <img src={imgUrl} alt={`Banner image for ${record.title}'s`} />
        },
        editable: true,
      },
      {
        title: 'status',
        dataIndex: 'status',
        width: '10%',
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
          inputType: col.dataIndex === 'status' ? 'select' : col.dataIndex === 'bannerImage' ? 'upload' : 'text',
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
              <h1 className="text-2xl font-semibold">Banners</h1>
              <Link to="/banner/add" className="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 hover:text-white rounded-md px-3 py-2 transition duration-200">Add Banner</Link>
            </div>
          )}
          loading={getBanner.isLoading}
          dataSource={getBanner?.data?.data}
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
            case 'text':
                inputNode = <Input />;
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
            case 'upload':
                    inputNode = <Upload beforeUpload={() => false} listType="picture" defaultFileList={[{url: record.bannerImage}]}>
                        <Button className="text-2xl p-3" type="primary" icon={<MdFileUpload />}></Button>
                    </Upload>
                    
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
