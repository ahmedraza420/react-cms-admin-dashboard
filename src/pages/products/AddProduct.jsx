    import { Button, Card, Checkbox, Form, Input, InputNumber, Select, Spin } from "antd";
    import TextArea from "antd/es/input/TextArea";
    import Dragger from "antd/es/upload/Dragger";
    import { FaUpload } from "react-icons/fa6";
    import { useMutation, useQuery } from "react-query";
    import { addProduct, getCategory } from "../../../services/api";
    import { useNavigate } from "react-router-dom";

    export default function AddProduct() {
        const [form] = Form.useForm();
        const navigate = useNavigate();
        const handleAddProduct = useMutation({
            mutationFn: (data) => addProduct(data),
            mutationKey: ['addProduct'],
            onSuccess: () => {
                navigate('/product');
            },
        });

        const getCategories = useQuery({
            queryKey: ['categories'],
            queryFn: getCategory,
        })

        const handleFormSubmit = (values) => {
            const formData = new FormData();
            // console.log(form.getFieldsValue(), e)
            Object.entries(values).forEach(([key, value]) => {
                if( key == 'photo') {
                    formData.append(key, value?.fileList[0]?.originFileObj);
                }
                else if (key == 'size') {
                    value.forEach((item) => formData.append(key, item));
                }
                else if (key == 'isFeature') {
                    formData.append(key, value ? value : false)
                }
                else {
                    formData.append(key, value);
                }
            })
            // console.log(formData.entries().forEach((data) => console.log(data)))
            handleAddProduct.mutate(formData);
        }

        return (
            <div>
                <Card title="Add Product" bordered={false} className="bg-white shadow-xl rounded-md" style={{boxShadow: '0 10px 25px rgb(0 0 0 / 0.1), 0 4px 10px -3px rgb(0 0 0 / 0.1)'}}>
                    {
                        <Form layout='vertical' form={form} onFinish={handleFormSubmit}>
                            <Form.Item label="Title" name='title' rules={[{required: true, message: 'Title is required'}]}>
                                <Input placeholder="Enter Product Title" />
                            </Form.Item>
                            
                            <Form.Item label="Summary" name='summary'  rules={[{required: true, message: 'Product Summary is required'}]}>
                                <TextArea rows={3} placeholder="Enter Product Summary"/>
                            </Form.Item>
                            
                            <Form.Item label="Description" name='description'>
                                <TextArea rows={3} placeholder="Enter Product Description"/>
                            </Form.Item>

                            <Form.Item name="isFeature" valuePropName="checked">
                                <Checkbox>Is the product Featured?</Checkbox>
                            </Form.Item>

                            <Form.Item label="Category" name='category' rules={[{required: true, message: 'Please select a Category'}]}>
                            {getCategories.isLoading ? <Spin /> : <Select options={
                                getCategories?.data?.data.map((category) => ({label : category.title.split(' ').map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(' '), value : category.title}))
                                }/>}
                            </Form.Item>
                            
                            <Form.Item name="price" label="Price" rules={[{required: true, message: 'The product needs to have a price'}]}>
                                <InputNumber prefix="Rs " style={{ width: '100%' }} type='number'/>
                            </Form.Item>
                            
                            <Form.Item name="discount" label="Discount">
                                <InputNumber prefix="% " style={{ width: '100%' }} type='number' min='0' max='100'/>
                            </Form.Item>

                            <Form.Item name="size" label="Size(s)">
                                <Select mode="multiple" allowClear style={{width: '100%', }} placeholder="Select a Size (or multiple)" 
                                    options={[
                                        {value: 'small', label: 'Small (S)'},
                                        {value: 'medium', label: 'Medium (M)'},
                                        {value: 'large', label: 'Large (L)'},
                                        {value: 'extra large', label: 'Extra Large (XL)'},
                                        {value: 'unstiched fabric', label: 'Unstiched Fabric'},
                                    ]} />
                            </Form.Item>

                            <Form.Item label="Condition" name='condition' rules={[{required: true, message: 'Please select provide the condition of the product'}]}>
                            <Select options={[
                                    { value: 'Default', label: 'Default', },
                                    { value: 'New', label: 'New', },
                                    { value: 'Hot', label: 'Hot', },
                                ]}/>
                            </Form.Item>

                            <Form.Item name="quantity" label="Quantity" rules={[{required: true, message: 'Initial stock needs to have a quantity of the product'}]}>
                                <InputNumber style={{ width: '100%' }} type='number' max='10000'/>
                            </Form.Item>

                            <Form.Item label='Image' name='photo' rules={[{required: true, message: `Please add a product image, without it the product would look weird`}]} className="max-w-96 mb-14">
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
                            <Select options={[
                                    { value: 'Active', label: 'Active', },
                                    { value: 'Inactive', label: 'Inactive', },
                                ]}/>
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