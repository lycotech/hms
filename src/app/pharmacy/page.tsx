'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Tag, 
  Alert, 
  Modal, 
  Form, 
  Input,
  Space,
  message,
  Statistic,
  Tabs,
  Badge,
  Typography,
  Divider
} from 'antd';
import { 
  MedicineBoxOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
// Pharmacy page with authentication
import type { Prescription } from '@/lib/types';

const { Text } = Typography;

export default function PharmacyPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dispensingModal, setDispensingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Payment verification hooks available for future use

  // Mock prescriptions data with payment verification status
  type ExtendedPrescription = Prescription & { 
    patientName: string; 
    doctorName: string; 
    paymentVerified: boolean;
    paymentStatus: 'paid' | 'pending' | 'none';
  };

  const [prescriptions, setPrescriptions] = useState<ExtendedPrescription[]>([
    {
      id: 'presc-001',
      patientId: 'patient-001',
      patientName: 'Adaobi Nwosu',
      doctorId: 'doctor-001',
      doctorName: 'Dr. Emeka Okafor',
      medications: [
        {
          id: 'med-001',
          name: 'Lisinopril 10mg',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          unitPrice: 150,
          totalPrice: 4500,
          instructions: 'Take with food'
        },
        {
          id: 'med-004',
          name: 'Metformin 500mg',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          quantity: 60,
          unitPrice: 100,
          totalPrice: 6000,
          instructions: 'Take before meals'
        }
      ],
      instructions: 'Take medications as prescribed. Monitor blood pressure and blood sugar regularly.',
      status: 'pending',
      paymentVerified: true, // Simulated payment verification
      paymentId: 'payment-001',
      createdAt: '2025-01-30T09:30:00Z',
      totalAmount: 10500,
      paymentStatus: 'paid'
    },
    {
      id: 'presc-002',
      patientId: 'patient-002',
      patientName: 'Ibrahim Mohammed',
      doctorId: 'doctor-002',
      doctorName: 'Dr. Fatima Abubakar',
      medications: [
        {
          id: 'med-008',
          name: 'Amoxicillin 500mg',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          quantity: 21,
          unitPrice: 80,
          totalPrice: 1680,
          instructions: 'Complete full course'
        }
      ],
      instructions: 'Complete the full antibiotic course even if feeling better.',
      status: 'pending',
      paymentVerified: false, // NO PAYMENT - CANNOT DISPENSE
      createdAt: '2025-01-30T10:00:00Z',
      totalAmount: 1680,
      paymentStatus: 'pending'
    },
    {
      id: 'presc-003',
      patientId: 'patient-003',
      patientName: 'Blessing Okoro',
      doctorId: 'doctor-001',
      doctorName: 'Dr. Emeka Okafor',
      medications: [
        {
          id: 'med-014',
          name: 'Salbutamol Inhaler',
          dosage: '100mcg',
          frequency: 'As needed',
          duration: '30 days',
          quantity: 1,
          unitPrice: 3500,
          totalPrice: 3500,
          instructions: 'Use during asthma attacks'
        }
      ],
      instructions: 'Keep inhaler with you at all times. Seek immediate help if breathing difficulty persists.',
      status: 'pending',
      paymentVerified: false, // NO PAYMENT
      createdAt: '2025-01-30T11:00:00Z',
      totalAmount: 3500,
      paymentStatus: 'none'
    }
  ]);

  // CRITICAL BUSINESS LOGIC: Payment verification function
  const canDispenseMedication = (prescription: ExtendedPrescription): boolean => {
    // This is the core business rule - no dispensing without payment
    return prescription.paymentVerified && prescription.paymentStatus === 'paid';
  };

  const handleDispenseMedication = (prescription: ExtendedPrescription) => {
    // CRITICAL CHECK: Verify payment before allowing dispensing
    if (!canDispenseMedication(prescription)) {
      message.error('Cannot dispense medication: Payment not verified!');
      return;
    }

    setSelectedPrescription(prescription);
    setDispensingModal(true);
    form.setFieldsValue({
      prescriptionId: prescription.id,
      patientName: prescription.patientName,
      totalAmount: prescription.totalAmount
    });
  };

  const confirmDispensing = async () => {
    try {
      await form.validateFields();
      
      // Update prescription status to dispensed
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === selectedPrescription?.id 
            ? { ...p, status: 'dispensed', dispensedAt: new Date().toISOString(), dispensedBy: 'Pharmacist A' }
            : p
        )
      );

      message.success('Medication dispensed successfully!');
      setDispensingModal(false);
      setSelectedPrescription(null);
      form.resetFields();
    } catch {
      message.error('Please fill all required fields');
    }
  };

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const dispensedPrescriptions = prescriptions.filter(p => p.status === 'dispensed');
  const awaitingPayment = prescriptions.filter(p => !p.paymentVerified);

  const prescriptionColumns = [
    {
      title: 'Prescription ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text code>{id}</Text>
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName'
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong>₦{amount.toLocaleString('en-US')}</Text>
      )
    },
    {
      title: 'Payment Status',
      key: 'paymentStatus',
      render: (_: unknown, record: ExtendedPrescription) => {
        if (record.paymentVerified && record.paymentStatus === 'paid') {
          return <Tag color="green" icon={<CheckCircleOutlined />}>Paid</Tag>;
        } else if (record.paymentStatus === 'pending') {
          return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Pending Payment</Tag>;
        } else {
          return <Tag color="red" icon={<CloseCircleOutlined />}>No Payment</Tag>;
        }
      }
    },
    {
      title: 'Can Dispense',
      key: 'canDispense',
      render: (_: unknown, record: ExtendedPrescription) => {
        const canDispense = canDispenseMedication(record);
        return (
          <Tag color={canDispense ? 'green' : 'red'}>
            {canDispense ? 'Yes' : 'No - Payment Required'}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: ExtendedPrescription) => {
        const canDispense = canDispenseMedication(record);
        return (
          <Space>
            <Button 
              type="primary" 
              size="small"
              disabled={!canDispense}
              onClick={() => handleDispenseMedication(record)}
              icon={<MedicineBoxOutlined />}
            >
              {canDispense ? 'Dispense' : 'Payment Required'}
            </Button>
            <Button 
              size="small" 
              icon={<PrinterOutlined />}
              onClick={() => message.info('Prescription printed')}
            >
              Print
            </Button>
          </Space>
        );
      }
    }
  ];

  return (
    <div className="p-6">
        {/* Critical Business Alert */}
        <Alert
          message="CRITICAL BUSINESS RULE"
          description="Medications can only be dispensed after payment verification. The system enforces this rule to prevent revenue loss."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mb-6"
        />

        {/* Pharmacy Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Pending Prescriptions"
                value={pendingPrescriptions.length}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Awaiting Payment"
                value={awaitingPayment.length}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Ready to Dispense"
                value={pendingPrescriptions.filter(p => canDispenseMedication(p)).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Dispensed Today"
                value={dispensedPrescriptions.length}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Payment Verification Alerts */}
        {awaitingPayment.length > 0 && (
          <Alert
            message={`${awaitingPayment.length} prescriptions cannot be dispensed due to pending payments`}
            description="Please ensure patients complete payment at the cashier before medication dispensing."
            type="error"
            showIcon
            className="mb-6"
          />
        )}

        {/* Main Prescription Management */}
        <Card>
          <Tabs 
            defaultActiveKey="pending"
            items={[
              {
                label: (
                  <Badge count={pendingPrescriptions.length} offset={[10, 0]}>
                    Pending Prescriptions
                  </Badge>
                ),
                key: 'pending',
                children: (
                  <div>
                    <div className="mb-4">
                <Input
                  placeholder="Search prescriptions by patient name, prescription ID..."
                  prefix={<SearchOutlined />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <Table
                dataSource={pendingPrescriptions.filter(p => 
                  p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.id.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                columns={prescriptionColumns}
                rowKey="id"
                scroll={{ x: 1000 }}
                rowClassName={(record) => 
                  !canDispenseMedication(record) ? 'bg-red-50' : 'bg-green-50'
                }
              />
                  </div>
                )
              },
              {
                label: (
                  <Badge count={dispensedPrescriptions.length} offset={[10, 0]}>
                    Dispensed Today
                  </Badge>
                ),
                key: 'dispensed',
                children: (
                  <Table
                dataSource={dispensedPrescriptions}
                columns={[
                  ...prescriptionColumns.filter(col => col.key !== 'action'),
                  {
                    title: 'Dispensed At',
                    dataIndex: 'dispensedAt',
                    key: 'dispensedAt',
                    render: (date: string) => new Date(date).toLocaleString()
                  },
                  {
                    title: 'Dispensed By',
                    dataIndex: 'dispensedBy',
                    key: 'dispensedBy'
                  }
                ]}
                rowKey="id"
                scroll={{ x: 1000 }}
              />
                )
              }
            ]}
          />
        </Card>

        {/* Dispensing Modal */}
        <Modal
          title="Dispense Medication"
          open={dispensingModal}
          onOk={confirmDispensing}
          onCancel={() => {
            setDispensingModal(false);
            setSelectedPrescription(null);
            form.resetFields();
          }}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Alert
              message="Payment Verified ✓"
              description="Payment has been confirmed. Proceed with medication dispensing."
              type="success"
              showIcon
              className="mb-4"
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prescription ID" name="prescriptionId">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Patient Name" name="patientName">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Total Amount" name="totalAmount">
                  <Input 
                    disabled 
                    addonBefore="₦"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Pharmacist Notes" 
                  name="pharmacistNotes"
                  rules={[{ required: true, message: 'Please add dispensing notes' }]}
                >
                  <Input.TextArea placeholder="Add any dispensing notes or patient counseling given..." />
                </Form.Item>
              </Col>
            </Row>

            {selectedPrescription && (
              <div>
                <Divider>Medications to Dispense</Divider>
                {selectedPrescription.medications.map((med, index) => (
                  <Card key={index} size="small" className="mb-2">
                    <Row>
                      <Col span={8}>
                        <Text strong>{med.name}</Text>
                      </Col>
                      <Col span={4}>
                        <Text>Qty: {med.quantity}</Text>
                      </Col>
                      <Col span={6}>
                        <Text>{med.frequency}</Text>
                      </Col>
                      <Col span={6}>
                        <Text>₦{med.totalPrice.toLocaleString('en-US')}</Text>
                      </Col>
                    </Row>
                    {med.instructions && (
                      <Text type="secondary" className="text-sm">
                        Instructions: {med.instructions}
                      </Text>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Form>
        </Modal>
      </div>
  );
}