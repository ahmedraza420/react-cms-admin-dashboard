import { Button, Card, Form, Input, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { FaUpload } from "react-icons/fa6";
import { useMutation, useQuery } from "react-query";
import { addPost, getCategory } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleAddPost = useMutation({
        mutationFn: (data) => addPost(data),
        mutationKey: ['addpost'],
        onSuccess: () => {
            navigate('/post');
        },
    });

    const getCategories = useQuery({
        queryKey: ['categories'],
        queryFn: getCategory,
    })

    const handleFormSubmit = (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if( key == 'postImage') {
                formData.append(key, value?.fileList[0]?.originFileObj);
            }
            else {
                formData.append(key, value);
            }
        })
        // formData.entries().forEach(([key, value]) => {if(key === 'quote' && value === '' || key === 'description' && value === '') formData.append(key, "")})
        // console.log(values.postImage)
        // formData.entries().forEach((data) => console.log(data))
        handleAddPost.mutate(formData);
    }

    return (
        <div>
            <Card title="Add Post" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                {
                    <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
                        <Form.Item label="Title" name='title' rules={[{required: true, message: 'Title is required'}]}>
                            <Input placeholder="Enter Post Title" />
                        </Form.Item>
                        
                        <Form.Item label="Quote" name='quote'  rules={[{required: true, message: 'Post Quote is required'}]}>
                            <TextArea rows={3} placeholder="Enter Post Summary" />
                        </Form.Item>
                        
                        <Form.Item label="Summary" name='summary'  rules={[{required: true, message: 'Post Summary is required'}]}>
                            <TextArea rows={3} placeholder="Enter Product Summary"/>
                        </Form.Item>
                        
                        <Form.Item label="Description" name='description'  rules={[{required: true, message: 'Post Description is required'}]}>
                            <TextArea rows={3} placeholder="Enter Product Description" />
                        </Form.Item>

                        <Form.Item label="Category" name='category' rules={[{required: true, message: 'Please select a Category'}]}>
                        {getCategories.isLoading ? <Spin /> : <Select options={
                            getCategories?.data?.data.map((category) => ({label : category.title.split(' ').map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(' '), value : category.title}))
                            }/>}
                        </Form.Item>

                        <Form.Item name='tag' initialValue={'New'} label="Tag" rules={[{ required: true, message: `Please select a tag` }]}>
                            <Select options={[{label:'New', value:'New'}, {label:'Processing', value:'Processing'}, {label:'Delivered', value:'Delivered'}, {label:'Cancelled', value:'Cancelled'}]} />
                        </Form.Item>
                        
                        <Form.Item name='author' label='Author' rules={[{ required: true, message: `Please select a tag` }]}>
                            <Select options={[{label:'Admin', value:'Admin'}, {label:'Ahmed', value:'Ahmed'}, {label:'Raza', value:'Raza'}, {label:'The options will be all users', value:''}]} />
                        </Form.Item>
                        
                        <Form.Item label='Image' name='postImage' rules={[{required: true, message: `Please add a product image, without it the product would look weird`}]} className="max-w-96 mb-14">
                            <Dragger multiple={false} beforeUpload={() => false} listType="picture">
                                <p className="ant-upload-drag-icon flex justify-center text-3xl text-blue-500">
                                    <FaUpload />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                    banned files.
                                </p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item label="Status" name='status' rules={[{required: true, message: 'Please select a status'}]} className="pb-6">
                            <Select options={[{ value: 'Active', label: 'Active', }, { value: 'Inactive', label: 'Inactive', },]}/>
                        </Form.Item>

                        <div className="flex gap-3 flex-wrap">
                            <Form.Item className="mb-0">
                                <Button type="primary" htmlType="submit">{handleAddPost.isLoading ? <Spin /> :  'Submit'}</Button>
                            </Form.Item>
                            <Form.Item className="mb-0">
                                <Button danger onClick={() => form.resetFields()}>Reset</Button>
                            </Form.Item>
                        </div>
                    </Form>
                }
            </Card>
        </div>
    )
}