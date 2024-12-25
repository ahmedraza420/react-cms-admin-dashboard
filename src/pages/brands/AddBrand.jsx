import { Button, Card, Form, Input, Select, Spin } from "antd";
import { useMutation } from "react-query";
import { addBrand } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddBrand() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleAddBrand = useMutation({
        mutationFn: (data) => addBrand(data),
        mutationKey: ['addbrand'],
        onSuccess: () => {
            navigate('/brand');
        },
    });

    const handleFormSubmit = (values) => {
        // console.log(values);
        // console.log(formData.entries().forEach((data) => console.log(data)))
        handleAddBrand.mutate(values);
    }

    return (
        <div>
            <Card title="Add Brand" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                {
                    <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
                        <Form.Item label="Title" name='title' rules={[{required: true, message: 'Title is required'}]}>
                            <Input placeholder="Enter Product Title" />
                        </Form.Item>

                        <Form.Item label="Status" name='status' rules={[{required: true, message: 'Please select a status'}]} className="pb-6">
                        <Select options={[
                                { value: 'Active', label: 'Active', },
                                { value: 'Inactive', label: 'Inactive', },
                            ]} placeholder='Select Status'/>
                        </Form.Item>

                        <div className="flex gap-3 flex-wrap">
                            <Form.Item className="mb-0">
                                <Button type="primary" htmlType="submit">{handleAddBrand.isLoading ? <Spin /> :  'Submit'}</Button>
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