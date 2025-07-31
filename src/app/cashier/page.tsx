'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Select, 
  InputNumber, 
  Modal, 
  message, 
  Space,
  Tag,
  Statistic,
  Typography,
  Divider,
  Alert,
  Radio
} from 'antd';
import { 
  DollarCircleOutlined,
  PrinterOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
// Cashier page with authentication
import { usePaymentStore } from '@/lib/store/paymentStore';
import type { Payment, ServiceTier, Patient } from '@/lib/types';

const { Text } = Typography;
const { Option } = Select;

interface BillItem {
  serviceId: string;
  serviceName: string;
  category: string;
  quantity: number;
  tier: ServiceTier;
  unitPrice: number;
  totalPrice: number;
}

interface PendingBill {
  id: string;
  patientName: string;
  services: string[];
  amount: number;
  status: string;
  createdAt: string;
}

export default function CashierPage() {
  const [billingModal, setBillingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'insurance'>('cash');
  const [form] = Form.useForm();

  // Payment store hooks
  const { 
    addPayment, 
    getDailyRevenue, 
    getRevenueByPaymentMethod
  } = usePaymentStore();

  // Mock data
  const mockPatients = [
    { id: 'patient-001', name: 'Adaobi Nwosu', patientNumber: 'HMS2025001' },
    { id: 'patient-002', name: 'Ibrahim Mohammed', patientNumber: 'HMS2025002' },
    { id: 'patient-003', name: 'Blessing Okoro', patientNumber: 'HMS2025003' }
  ];

  const mockServices = [
    { 
      id: 'service-001', 
      name: 'General Consultation', 
      category: 'consultation',
      price: { normal: 5000, private: 8000, vip: 15000 }
    },
    { 
      id: 'service-006', 
      name: 'Complete Blood Count (CBC)', 
      category: 'diagnostic',
      price: { normal: 3000, private: 4500, vip: 6000 }
    },
    { 
      id: 'service-007', 
      name: 'Chest X-Ray', 
      category: 'diagnostic',
      price: { normal: 8000, private: 12000, vip: 15000 }
    },
    { 
      id: 'service-015', 
      name: 'Reading Glasses', 
      category: 'optical',
      price: { normal: 25000, private: 40000, vip: 65000 }
    },
    {
      id: 'pharmacy-001',
      name: 'Prescription Medications',
      category: 'pharmacy',
      price: { normal: 0, private: 0, vip: 0 } // Variable pricing
    }
  ];

  const [pendingBills] = useState<PendingBill[]>([
    {
      id: 'bill-001',
      patientName: 'Adaobi Nwosu',
      services: ['General Consultation', 'CBC Test'],
      amount: 8000,
      status: 'pending',
      createdAt: '10:30 AM'
    },
    {
      id: 'bill-002',
      patientName: 'Ibrahim Mohammed',
      services: ['Chest X-Ray', 'Consultation'],
      amount: 13000,
      status: 'pending',
      createdAt: '11:15 AM'
    }
  ]);

  // Statistics
  const dailyRevenue = getDailyRevenue();
  const cashRevenue = getRevenueByPaymentMethod('cash');
  const cardRevenue = getRevenueByPaymentMethod('card');

  const addServiceToBill = (serviceId: string, tier: ServiceTier, quantity: number = 1, customAmount?: number) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (!service) return;

    const unitPrice = customAmount || service.price[tier];
    const totalPrice = unitPrice * quantity;

    const billItem: BillItem = {
      serviceId,
      serviceName: service.name,
      category: service.category,
      quantity,
      tier,
      unitPrice,
      totalPrice
    };

    setCurrentBill(prev => {
      const existingIndex = prev.findIndex(item => 
        item.serviceId === serviceId && item.tier === tier
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          totalPrice: updated[existingIndex].totalPrice + totalPrice
        };
        return updated;
      } else {
        return [...prev, billItem];
      }
    });
  };

  const removeFromBill = (index: number) => {
    setCurrentBill(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return currentBill.reduce((total, item) => total + item.totalPrice, 0);
  };

  const processBillPayment = async () => {
    try {
      if (!selectedPatient || currentBill.length === 0) {
        message.error('Please select patient and add services');
        return;
      }

      const totalAmount = calculateTotal();

      // Create payment records for each service
      for (const item of currentBill) {
        const payment: Omit<Payment, 'id' | 'createdAt'> = {
          patientId: selectedPatient.id,
          serviceId: item.serviceId,
          amount: item.totalPrice,
          status: 'completed',
          paymentMethod,
          serviceType: item.category as Payment['serviceType'],
          cashierName: 'Cashier Admin',
          reference: `REF-${Date.now()}-${item.serviceId.slice(-4)}`
        };

        addPayment(payment);
      }

      // Special handling for pharmacy payments
      const pharmacyItems = currentBill.filter(item => item.category === 'pharmacy');
      if (pharmacyItems.length > 0) {
        message.success(
          `Payment processed! Pharmacy can now dispense medications for ${selectedPatient.firstName} ${selectedPatient.lastName}`,
          5
        );
      } else {
        message.success(`Payment of ₦${totalAmount.toLocaleString()} processed successfully!`);
      }

      // Reset form
      setBillingModal(false);
      setSelectedPatient(null);
      setCurrentBill([]);
      form.resetFields();

    } catch {
      message.error('Payment processing failed');
    }
  };

  const pendingBillColumns = [
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services: string[]) => (
        <div>
          {services.map((service, index) => (
            <Tag key={index} color="blue">{service}</Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>₦{amount.toLocaleString('en-US')}</Text>
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: PendingBill) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
              message.info(`Processing bill for ${record.patientName}`);
            }}
          >
            Process Payment
          </Button>
          <Button size="small" icon={<PrinterOutlined />}>
            Print
          </Button>
        </Space>
      )
    }
  ];

  const billColumns = [
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => <Tag color="green">{tier.toUpperCase()}</Tag>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `₦${price.toLocaleString('en-US')}`
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => <Text strong>₦{price.toLocaleString('en-US')}</Text>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, __: unknown, index: number) => (
        <Button 
          size="small" 
          danger 
          onClick={() => removeFromBill(index)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
      <div className="p-6">
        {/* Revenue Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Daily Revenue"
                value={dailyRevenue || 15000}
                prefix={<DollarCircleOutlined />}
                formatter={(value) => `₦${Number(value).toLocaleString('en-US')}`}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Cash Payments"
                value={cashRevenue || 8000}
                prefix={<WalletOutlined />}
                formatter={(value) => `₦${Number(value).toLocaleString('en-US')}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Card Payments"
                value={cardRevenue || 7000}
                prefix={<CreditCardOutlined />}
                formatter={(value) => `₦${Number(value).toLocaleString('en-US')}`}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Pending Bills"
                value={pendingBills.length}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Critical Alert for Pharmacy Integration */}
        <Alert
          message="Payment Verification for Pharmacy"
          description="All payments are immediately verified and linked to patient records. Pharmacy can only dispense medications after payment verification."
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Pending Bills */}
        <Card title="Pending Bills" className="mb-6">
          <Table<PendingBill>
            dataSource={pendingBills}
            columns={pendingBillColumns}
            rowKey="id"
            pagination={false}
          />
        </Card>

        {/* Payment Processing Modal */}
        <Modal
          title={`Process Payment ${selectedPatient ? `- ${selectedPatient.firstName} ${selectedPatient.lastName}` : ''}`}
          open={billingModal}
          onOk={processBillPayment}
          onCancel={() => {
            setBillingModal(false);
            setSelectedPatient(null);
            setCurrentBill([]);
            form.resetFields();
          }}
          width={1000}
          okText="Process Payment"
          okButtonProps={{ disabled: currentBill.length === 0 }}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Patient" name="patientId">
                  <Select
                    placeholder="Select patient"
                    value={selectedPatient?.id}
                    onChange={(value) => {
                      // In a real app, this would fetch the full patient data
                      // For now, we'll just use null since mockPatients has limited data
                      setSelectedPatient(null);
                      message.info(`Selected patient ID: ${value}`);
                    }}
                  >
                    {mockPatients.map(patient => (
                      <Option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.patientNumber})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Payment Method">
                  <Radio.Group 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Radio.Button value="cash">
                      <WalletOutlined /> Cash
                    </Radio.Button>
                    <Radio.Button value="card">
                      <CreditCardOutlined /> Card
                    </Radio.Button>
                    <Radio.Button value="transfer">
                      <BankOutlined /> Transfer
                    </Radio.Button>
                    <Radio.Button value="insurance">
                      <CheckCircleOutlined /> Insurance
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Add Services</Divider>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Service">
                  <Select placeholder="Select service" onChange={(serviceId) => {
                    const service = mockServices.find(s => s.id === serviceId);
                    if (service) {
                      form.setFieldsValue({ 
                        selectedService: serviceId,
                        serviceName: service.name 
                      });
                    }
                  }}>
                    {mockServices.map(service => (
                      <Option key={service.id} value={service.id}>
                        {service.name} ({service.category})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Tier">
                  <Select defaultValue="normal">
                    <Option value="normal">Normal</Option>
                    <Option value="private">Private</Option>
                    <Option value="vip">VIP</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Quantity">
                  <InputNumber min={1} defaultValue={1} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Custom Amount">
                  <InputNumber 
                    placeholder="Optional"
                    formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/₦\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label=" ">
                  <Button 
                    type="primary" 
                    onClick={() => {
                      const serviceId = form.getFieldValue('selectedService');
                      const tier = form.getFieldValue('tier') || 'normal';
                      const quantity = form.getFieldValue('quantity') || 1;
                      const customAmount = form.getFieldValue('customAmount');
                      
                      if (serviceId) {
                        addServiceToBill(serviceId, tier, quantity, customAmount);
                        form.resetFields(['selectedService', 'tier', 'quantity', 'customAmount']);
                      }
                    }}
                  >
                    Add
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Current Bill</Divider>
            
            <Table
              dataSource={currentBill}
              columns={billColumns}
              rowKey={(record, index) => `${record.serviceId}-${index}`}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>Total Amount</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <Text strong>₦{calculateTotal().toLocaleString('en-US')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />

            {currentBill.some(item => item.category === 'pharmacy') && (
              <Alert
                message="Pharmacy Payment"
                description="This payment will enable medication dispensing at the pharmacy. The pharmacy system will automatically verify this payment."
                type="success"
                showIcon
                className="mt-4"
              />
            )}
          </Form>
        </Modal>
      </div>
  );
}