import { Button, Card, Form, Input, InputNumber, Select, Spin } from "antd";
import { useMutation } from "react-query";
import { addShipping } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddShipping() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleAddProduct = useMutation({
        mutationFn: (data) => addShipping(data),
        mutationKey: ['addshipping'],
        onSuccess: () => {
            navigate('/shipping');
        },
    });

    const handleFormSubmit = (values) => {
        handleAddProduct.mutate(values);
    }

    return (
        <div>
            <Card title="Add Shipping" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                {
                    <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
                        <Form.Item label="Type" name='type' rules={[{required: true, message: 'Shipping type is required'}]}>
                            <Input placeholder="Enter Shipping Type" />
                        </Form.Item>

                        <Form.Item label="Price" name='price' rules={[{required: true, message: 'Please provide a price for shipping'}]}>
                            <InputNumber prefix="Rs " style={{ width: '100%' }} type='number' placeholder="150"/>
                        </Form.Item>

                        <Form.Item label="Status" name='status' rules={[{required: true, message: 'Please select a status'}]} className="pb-6">
                        <Select options={[
                                { value: 'Active', label: 'Active', },
                                { value: 'Inactive', label: 'Inactive', },
                            ]} placeholder='Select Status'/>
                        </Form.Item>

                        <div className="flex gap-3 flex-wrap">
                            <Form.Item className="mb-0">
                                <Button type="primary" htmlType="submit">{handleAddProduct.isLoading ? <Spin /> :  'Submit'}</Button>
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