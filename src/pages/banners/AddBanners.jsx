import { Button, Card, Form, Input, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { FaUpload } from "react-icons/fa6";
import { useMutation } from "react-query";
import { addBanner } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddBanners() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleAddBanner = useMutation({
        mutationFn: (data) => addBanner(data),
        mutationKey: ['addProduct'],
        onSuccess: () => {
            navigate('/banner');
        },
    });

    const handleFormSubmit = (values) => {
        const formData = new FormData();
        // console.log(form.getFieldsValue(), e)
        Object.entries(values).forEach(([key, value]) => {
            if( key == 'bannerImage') {
                formData.append(key, value?.fileList[0]?.originFileObj);
            }
            else {
                formData.append(key, value);
            }
        })
        handleAddBanner.mutate(formData);
    }

    return (
        <div>
            <Card title="Add Banner" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                {
                    <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
                        <Form.Item label="Title" name='title' rules={[{required: true, message: 'Title is required'}]}>
                            <Input placeholder="Enter Banner Title" />
                        </Form.Item>
                        
                        <Form.Item label="Description" name='description'  rules={[{required: true, message: 'Banner Description is required'}]}>
                            <TextArea rows={3} placeholder="Enter Banner Description"/>
                        </Form.Item>

                        <Form.Item label='Photo' name='bannerImage' rule={[{required: true, message: 'Are you really gonna add a new banner with no banner image? really?'}]} className="max-w-96">
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

                        <Form.Item label="Status" name='status' rules={[{required: true, message: 'Please select a status'}]}>
                        <Select options={[
                                {
                                    value: 'Active',
                                    label: 'Active',
                                },
                                {
                                    value: 'Inactive',
                                    label: 'Inactive',
                            },]}/>
                        </Form.Item>

                        <div className="flex gap-3 flex-wrap">
                            <Form.Item className="mb-0">
                                <Button type="primary" htmlType="submit">{handleAddBanner.isLoading ? <Spin /> :  'Submit'}</Button>
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