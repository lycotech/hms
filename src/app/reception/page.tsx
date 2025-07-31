'use client';

import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  message, 
  Space,
  Tag,
  Badge,
  Statistic,
  Tabs,
  Typography,
  Avatar,
  Divider
} from 'antd';
import { 
  UserAddOutlined,
  SearchOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import HospitalLayout from '@/components/layout/HospitalLayout';
import { usePatientStore } from '@/lib/store/patientStore';
import type { Patient } from '@/lib/types';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ReceptionPage() {
  const [registrationModal, setRegistrationModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  // const [searchQuery, setSearchQuery] = useState(''); // Removed for now
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // Patient store hooks
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    searchPatients, 
    getPatientsByStatus,
    initializePatients 
  } = usePatientStore();

  useEffect(() => {
    // Initialize with mock patients if store is empty
    if (patients.length === 0) {
      initializePatients();
    }
  }, [patients.length, initializePatients]);

  // Mock queue data with fixed times to avoid hydration issues
  const [queueData, setQueueData] = useState([
    { number: 1, patientName: 'Adaobi Nwosu', department: 'General Practice', status: 'waiting', time: '10:30 AM' },
    { number: 2, patientName: 'Ibrahim Mohammed', department: 'Cardiology', status: 'in-service', time: '10:45 AM' },
    { number: 3, patientName: 'Blessing Okoro', department: 'General Practice', status: 'waiting', time: '11:00 AM' },
    { number: 4, patientName: 'Olumide Adesola', department: 'Screening', status: 'completed', time: '11:15 AM' }
  ]);

  const handlePatientRegistration = async () => {
    try {
      const values = await form.validateFields();
      
      const newPatient: Omit<Patient, 'id' | 'patientNumber' | 'createdAt'> = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        phoneNumber: values.phoneNumber,
        email: values.email,
        address: values.address,
        medicalHistory: values.medicalHistory || 'None',
        status: 'waiting',
        syncStatus: 'pending',
        emergencyContact: values.emergencyContactName ? {
          name: values.emergencyContactName,
          relationship: values.emergencyContactRelationship,
          phoneNumber: values.emergencyContactPhone
        } : undefined,
        insurance: values.insuranceProvider ? {
          provider: values.insuranceProvider,
          policyNumber: values.insurancePolicyNumber,
          expiryDate: '2025-12-31'
        } : undefined
      };

      addPatient(newPatient);
      
      // Add to queue automatically
      const queueNumber = queueData.length + 1;
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      setQueueData(prev => [...prev, {
        number: queueNumber,
        patientName: `${values.firstName} ${values.lastName}`,
        department: 'General Practice',
        status: 'waiting',
        time: timeString
      }]);

      message.success(`Patient registered successfully! Queue number: ${queueNumber}`);
      setRegistrationModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Please fill all required fields');
    }
  };

  const handlePatientSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const searchResults = searchPatients(values.searchQuery);
      
      if (searchResults.length === 0) {
        message.warning('No patients found matching your search');
        return;
      }

      if (searchResults.length === 1) {
        setSelectedPatient(searchResults[0]);
        message.success('Patient found!');
      } else {
        // Show multiple results in modal
        message.info(`Found ${searchResults.length} patients`);
      }
    } catch (error) {
      message.error('Please enter search criteria');
    }
  };

  const addToVisitQueue = (patient: Patient) => {
    const queueNumber = queueData.length + 1;
    const currentTime = new Date();
    const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    setQueueData(prev => [...prev, {
      number: queueNumber,
      patientName: `${patient.firstName} ${patient.lastName}`,
      department: 'General Practice',
      status: 'waiting',
      time: timeString
    }]);
    
    updatePatient(patient.id, { 
      status: 'waiting',
      queueNumber: queueNumber,
      lastVisit: new Date().toISOString()
    });

    message.success(`${patient.firstName} ${patient.lastName} added to queue. Queue number: ${queueNumber}`);
    setSearchModal(false);
    setSelectedPatient(null);
    searchForm.resetFields();
  };

  const waitingPatients = getPatientsByStatus('waiting');
  const todayPatients = patients.filter(p => 
    p.createdAt && new Date(p.createdAt).toDateString() === new Date().toDateString()
  );

  const queueColumns = [
    {
      title: 'Queue #',
      dataIndex: 'number',
      key: 'number',
      render: (num: number) => (
        <Badge count={num} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          waiting: 'orange',
          'in-service': 'blue',
          completed: 'green'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>
            Update
          </Button>
          <Button size="small" icon={<PrinterOutlined />}>
            Print
          </Button>
        </Space>
      )
    }
  ];

  return (
    <HospitalLayout 
      title="Reception - Patient Registration & Queue Management"
      breadcrumbItems={[
        { title: 'Dashboard', href: '/' },
        { title: 'Reception' }
      ]}
      userRole="reception"
      actions={
        <Space>
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => setRegistrationModal(true)}
          >
            New Patient
          </Button>
          <Button 
            icon={<SearchOutlined />}
            onClick={() => setSearchModal(true)}
          >
            Find Patient
          </Button>
        </Space>
      }
    >
      <div className="p-6">
        {/* Reception Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Patients Today"
                value={todayPatients.length}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="In Queue"
                value={queueData.filter(q => q.status === 'waiting').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="In Service"
                value={queueData.filter(q => q.status === 'in-service').length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Completed"
                value={queueData.filter(q => q.status === 'completed').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Queue Management */}
        <Card>
          <Tabs 
            defaultActiveKey="current-queue"
            items={[
              {
                label: (
                  <Badge count={queueData.filter(q => q.status !== 'completed').length} offset={[10, 0]}>
                    Current Queue
                  </Badge>
                ),
                key: 'current-queue',
                children: (
                  <Table
                dataSource={queueData}
                columns={queueColumns}
                rowKey="number"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
                )
              },
              {
                label: (
                  <Badge count={waitingPatients.length} offset={[10, 0]}>
                    Waiting Patients
                  </Badge>
                ),
                key: 'waiting-patients',
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingPatients.map(patient => (
                  <Card key={patient.id} size="small" hoverable>
                    <div className="flex items-center space-x-3">
                      <Avatar size={40} icon={<UserAddOutlined />} />
                      <div className="flex-1">
                        <Text strong>{patient.firstName} {patient.lastName}</Text>
                        <br />
                        <Text type="secondary" className="text-sm">
                          {patient.patientNumber}
                        </Text>
                        <br />
                        <Space size="small">
                          <PhoneOutlined className="text-gray-400" />
                          <Text className="text-sm">{patient.phoneNumber}</Text>
                        </Space>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex justify-between items-center">
                      <Tag color={patient.queueNumber ? 'green' : 'default'}>
                        {patient.queueNumber ? `Queue #${patient.queueNumber}` : 'Not in Queue'}
                      </Tag>
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => addToVisitQueue(patient)}
                      >
                        Add to Queue
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
                )
              }
            ]}
          />
        </Card>

        {/* Patient Registration Modal */}
        <Modal
          title="New Patient Registration"
          open={registrationModal}
          onOk={handlePatientRegistration}
          onCancel={() => {
            setRegistrationModal(false);
            form.resetFields();
          }}
          width={800}
          okText="Register Patient"
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="First Name" 
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Last Name" 
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Date of Birth" 
                  name="dateOfBirth"
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Phone Number" 
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="+234-XXX-XXX-XXXX" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input placeholder="patient@email.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Address" 
                  name="address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <Input placeholder="Patient address" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>Emergency Contact (Optional)</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Emergency Contact Name" name="emergencyContactName">
                  <Input placeholder="Contact name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Relationship" name="emergencyContactRelationship">
                  <Select placeholder="Relationship">
                    <Option value="spouse">Spouse</Option>
                    <Option value="parent">Parent</Option>
                    <Option value="child">Child</Option>
                    <Option value="sibling">Sibling</Option>
                    <Option value="friend">Friend</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Emergency Phone" name="emergencyContactPhone">
                  <Input placeholder="+234-XXX-XXX-XXXX" />
                </Form.Item>
              </Col>
            </Row>

            <Divider>Insurance Information (Optional)</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Insurance Provider" name="insuranceProvider">
                  <Select placeholder="Select insurance provider">
                    <Option value="NHIS">NHIS</Option>
                    <Option value="AIICO Insurance">AIICO Insurance</Option>
                    <Option value="Leadway Assurance">Leadway Assurance</Option>
                    <Option value="AXA Mansard">AXA Mansard</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Policy Number" name="insurancePolicyNumber">
                  <Input placeholder="Insurance policy number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Medical History" name="medicalHistory">
              <Input.TextArea 
                rows={3} 
                placeholder="Any known medical conditions, allergies, or previous surgeries..."
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Patient Search Modal */}
        <Modal
          title="Find Existing Patient"
          open={searchModal}
          onOk={handlePatientSearch}
          onCancel={() => {
            setSearchModal(false);
            setSelectedPatient(null);
            searchForm.resetFields();
          }}
          okText="Search"
        >
          <Form form={searchForm} layout="vertical">
            <Form.Item 
              label="Search Patient" 
              name="searchQuery"
              rules={[{ required: true, message: 'Please enter search criteria' }]}
            >
              <Input 
                placeholder="Enter patient name, phone number, or patient ID..."
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Form>

          {selectedPatient && (
            <Card className="mt-4">
              <Title level={5}>Patient Found</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Name:</Text> {selectedPatient.firstName} {selectedPatient.lastName}
                  <br />
                  <Text strong>Patient ID:</Text> {selectedPatient.patientNumber}
                  <br />
                  <Text strong>Phone:</Text> {selectedPatient.phoneNumber}
                </Col>
                <Col span={12}>
                  <Text strong>Last Visit:</Text> {selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'First visit'}
                  <br />
                  <Text strong>Status:</Text> <Tag color="blue">{selectedPatient.status}</Tag>
                </Col>
              </Row>
              <Divider />
              <Space>
                <Button 
                  type="primary" 
                  onClick={() => addToVisitQueue(selectedPatient)}
                >
                  Add to Queue
                </Button>
                <Button onClick={() => message.info('Patient details updated')}>
                  Update Details
                </Button>
              </Space>
            </Card>
          )}
        </Modal>
      </div>
    </HospitalLayout>
  );
}