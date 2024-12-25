import { deleteCategory, getCategory, updateCategory } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Button, Form, Input, Popconfirm, Select, Table, Tag, Typography, Upload } from 'antd';
import { useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Category() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getCategoryList = useQuery({
        queryKey: ['categorylist'],
        queryFn: getCategory,
        // staleTime: 300000,
    });
    // console.log(getCategoryList)

    const handleDelete = useMutation ({
      mutationFn: deleteCategory,
      mutationKey: ['deleteProduct'],
      onSuccess: (data) => {
        useQClient.setQueryData(['categorylist'], (currCats) => {
          // console.log('currentbanners', currentBanners, 'data', data)
          return {
            ...currCats,
            data: currCats?.data?.filter((category) => category._id !== data.data._id),
          }
        })
      }
    })
    
    const handleUpdateCategory = useMutation({
        mutationFn: ({id, data}) => updateCategory(id, data),
        mutationKey: ['updateCategory', editingId],
        onSuccess: (data) => {
                useQClient.setQueryData(['categorylist'], (currCats) => {
                    return {
                        ...currCats,
                        data: currCats?.data?.map((category) => {
                              if (category._id === data.data._id) {
                                return {...category, ...data.data}
                              }
                              else {
                                return category;
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
          categoryImage: '',
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
            if(key == 'categoryImage') {
              const file = row.categoryImage?.fileList?.[0]?.originFileObj;
              if (file) {
                formData.append(key, file)
              }
            }
            else {
              formData.append(key, row[key])
            }
          })
  
              handleUpdateCategory.mutate({id, data: formData});
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
          title: 'Summary',
          dataIndex: 'summary',
          width: '35%',
          editable: true,
          elipsis: true,
        },
        {
          title: 'image',
          dataIndex: 'categoryImage',
          width: '15%',
          render: (imgUrl, record) => {
             return  <img src={imgUrl} alt={`Image for ${record.title} category`} />
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
            inputType: col.dataIndex === 'status' ? 'select' : col.dataIndex === 'categoryImage' ? 'upload' : 'text',
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
                  <h1 className="text-2xl font-semibold">Category List</h1>
                  <Link to="/category/add" className="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 hover:text-white rounded-md px-3 py-2 transition duration-200">Add Category</Link>
                </div>
              )}
              loading={getCategoryList.isLoading}
              dataSource={getCategoryList?.data?.data}
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
                    inputNode = <Upload beforeUpload={() => false} listType="picture" defaultFileList={[{url: record.categoryImage}]}>
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