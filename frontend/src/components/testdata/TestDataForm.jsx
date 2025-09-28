import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, InputNumber, message, Select, Space } from 'antd';

const { Option } = Select;

const TestDataForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Base endpoint for all test data creations
      const base = 'http://localhost:5001/api/test-data';
      let endpoint = '';
      const data = { ...values };
      let typeName = '';
      
      switch (values.type) {
        case 'project':
          endpoint = `${base}/projects`;
          typeName = 'project';
          // Align with backend enum (Ongoing/Completed)
          data.status = values.status || 'Ongoing';
          // providerId comes from the new input
          break;
        case 'transaction':
          endpoint = `${base}/transactions`;
          typeName = 'transaction';
          // Map UI field txnType -> API field 'type'
          data.type = values.txnType || 'payment';
          data.amount = parseFloat(values.amount) || 0;
          break;
        case 'rating':
          endpoint = `${base}/ratings`;
          typeName = 'rating';
          data.rating = parseFloat(data.rating) || 5;
          data.comment = data.comment || 'Test rating';
          // Optional: allow specifying a customerId
          break;
        case 'job':
          endpoint = `${base}/jobs`;
          typeName = 'job';
          data.status = 'new';
          data.customerName = data.customerName || 'Test Customer';
          data.customerEmail = data.customerEmail || 'test@example.com';
          data.customerLocation = data.customerLocation || 'Test Location';
          break;
        default:
          return;
      }

      const response = await axios.post(endpoint, data);
      
      if (response.data && response.data.success) {
        message.success(response.data.message || `${typeName} added successfully!`);
        form.resetFields();
      } else {
        throw new Error(response.data?.message || 'Failed to add test data');
      }
    } catch (error) {
      console.error('Error adding test data:', error);
      message.error(error.response?.data?.message || `Failed to add ${values.type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add Test Data</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ type: 'job' }}
      >
        {/* Common: Provider ID for all types */}
        <Form.Item
          name="providerId"
          label="Provider ID"
          tooltip="Associate this record with a service provider"
          rules={[{ required: true, message: 'Please enter a provider ID' }]}
        >
          <Input placeholder="e.g., provider123 or test-provider-abc123" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Data Type"
          rules={[{ required: true, message: 'Please select a data type' }]}
        >
          <Select>
            <Option value="project">Project</Option>
            <Option value="transaction">Transaction</Option>
            <Option value="rating">Rating</Option>
            <Option value="job">Job</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
        >
          {({ getFieldValue }) => (
            <>
              {getFieldValue('type') === 'project' && (
                <>
                  <Form.Item
                    name="title"
                    label="Project Title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Status"
                    initialValue="Ongoing"
                  >
                    <Select>
                      <Option value="Ongoing">Ongoing</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {getFieldValue('type') === 'transaction' && (
                <>
                  <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[{ required: true, type: 'number', min: 1 }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    name="txnType"
                    label="Transaction Type"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="payment">Payment</Option>
                      <Option value="refund">Refund</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {getFieldValue('type') === 'rating' && (
                <>
                  <Form.Item
                    name="rating"
                    label="Rating (1-5)"
                    rules={[{ required: true, type: 'number', min: 1, max: 5 }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    name="customerId"
                    label="Customer ID (optional)"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="comment"
                    label="Comment"
                  >
                    <Input.TextArea />
                  </Form.Item>
                </>
              )}

              {getFieldValue('type') === 'job' && (
                <>
                  <Form.Item
                    name="title"
                    label="Job Title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Job Description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    name="customerName"
                    label="Customer Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="customerEmail"
                    label="Customer Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="customerLocation"
                    label="Location"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
            </>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Test Data
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TestDataForm;
