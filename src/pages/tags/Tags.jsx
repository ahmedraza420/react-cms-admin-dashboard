/* eslint-disable react/prop-types */
import { deleteTag, getTags, updateTag } from "../../../services/api";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Form, Input, Popconfirm, Select, Table, Tooltip, Tag, Typography } from 'antd';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Tags() {
    const useQClient = useQueryClient();
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record._id === editingId;

    const getAllTags = useQuery({
        queryKey: ['tagslist'],
        queryFn: getTags,
        // staleTime: 300000,
    });

    const handleDelete = useMutation ({
      mutationFn: deleteTag,
      mutationKey: ['deleteTag'],
      onSuccess: (data, id) => {
        useQClient.setQueryData(['tagslist'], (currTags) => {
        //   console.log('currentproducts', currProducts, 'data', data, 'id', id)
          return {
            ...currTags,
            data: currTags?.data?.filter((tag) => tag._id !== id),
          }
        })
      }
    })

    const handleUpdateTag = useMutation({
        mutationFn: ({id, data}) => updateTag(id, data),
        mutationKey: ['updatetag', editingId],
        onSuccess: (data) => {
                // console.log(data)
                useQClient.setQueryData(['tagslist'], (currTags) => {
                    return {
                        ...currTags,
                        data: currTags?.data?.map((tag) => {
                              if (tag._id === data.data._id) {
                                return {...tag, ...data.data}
                              }
                              else {
                                return tag;
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
            // console.log('row', row,'id', id)
            handleUpdateTag.mutate({id, data: row});
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
        editable: true,
        ellipsis: {
            showTitle: false,
        },
        render: (title) => (
            <Tooltip placement="top" title={title}>
                {title.length > 50 ? title.slice(0, 47) + '...' : title }
            </Tooltip>
        ),
      },
      {
        title: 'Status',
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
        // width: '15%',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
                {/* {console.log('record', record, 'record id', record._id)} */}
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
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Tags List</h1>
              <Link to="/tag/add" className="text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 hover:text-white rounded-md px-3 py-2 transition duration-200">Add Tag</Link>
            </div>
          )}
          loading= {getAllTags.isLoading}
          dataSource={getAllTags?.data?.data || []}
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
    index,
    children,
    ...restProps
    }) => {
        let inputNode = null;
        switch (inputType) {
            case 'select':
                inputNode = <Select options={[
                    { value: 'Active', label: 'Active', },
                    { value: 'Inactive', label: 'Inactive', },]}/>
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