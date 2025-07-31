'use client';

import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Tag,
  Alert,
  Modal,
  Space,
  message,
  Statistic,
  Typography,
  Divider,
  Select,
  DatePicker,
  TimePicker,
  Radio,
  Checkbox,
  Tabs,
  Badge,
  Progress,
  List,
  Avatar
} from 'antd';
import {
  HeartOutlined,
  ExperimentOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  AlertOutlined,
  FileTextOutlined,
  CaretRightOutlined
} from '@ant-design/icons';
import HospitalLayout from '@/components/layout/HospitalLayout';
import { usePatientStore } from '@/lib/store/patientStore';
import type { VitalSigns, VisualAcuity, Patient } from '@/lib/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock queue data for screening
const mockScreeningQueue = [
  {
    id: 'Q001',
    patientName: 'Adebayo Ogundimu',
    patientId: 'P001',
    queueNumber: 1,
    appointmentTime: '09:00',
    priority: 'normal',
    status: 'waiting',
    complaint: 'Chest pain and shortness of breath'
  },
  {
    id: 'Q002',
    patientName: 'Fatima Ibrahim',
    patientId: 'P002',
    queueNumber: 2,
    appointmentTime: '09:15',
    priority: 'urgent',
    status: 'in-progress',
    complaint: 'High fever and headache'
  },
  {
    id: 'Q003',
    patientName: 'Chinedu Okoro',
    patientId: 'P003',
    queueNumber: 3,
    appointmentTime: '09:30',
    priority: 'normal',
    status: 'waiting',
    complaint: 'Routine check-up'
  }
];

export default function ScreeningPage() {
  const { patients, addVitalSigns, addVisualAcuity } = usePatientStore();
  const [vitalsForm] = Form.useForm();
  const [visualForm] = Form.useForm();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [screeningQueue, setScreeningQueue] = useState(mockScreeningQueue);

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
  };

  const handleStartScreening = (queueItem: typeof mockScreeningQueue[0]) => {
    const patient = patients.find(p => p.id === queueItem.patientId);
    if (patient) {
      setSelectedPatient(patient);
      setActiveTab('vitals');
      
      // Update queue status
      setScreeningQueue(prev => 
        prev.map(q => 
          q.id === queueItem.id 
            ? { ...q, status: 'in-progress' }
            : q
        )
      );
      
      message.success(`Started screening for ${patient.firstName} ${patient.lastName}`);
    }
  };

  const handleCompleteScreening = () => {
    if (selectedPatient) {
      // Mark as completed in queue
      setScreeningQueue(prev => 
        prev.map(q => 
          q.patientId === selectedPatient.id 
            ? { ...q, status: 'completed' }
            : q
        )
      );
      
      message.success(`Screening completed for ${selectedPatient.firstName} ${selectedPatient.lastName}. Patient ready for doctor consultation.`);
      setSelectedPatient(null);
      setActiveTab('queue');
    }
  };

  const handleSaveVitals = async () => {
    try {
      const values = await vitalsForm.validateFields();
      if (selectedPatient) {
        const vitalSigns: Omit<VitalSigns, 'id' | 'recordedAt'> = {
          patientId: selectedPatient.id,
          bloodPressureSystolic: values.systolic,
          bloodPressureDiastolic: values.diastolic,
          temperature: values.temperature,
          weight: values.weight,
          height: values.height,
          heartRate: values.heartRate,
          respiratoryRate: values.respiratoryRate,
          oxygenSaturation: values.oxygenSaturation,
          notes: values.notes,
          recordedBy: 'Nurse Mary Johnson'
        };
        
        addVitalSigns(vitalSigns);
        message.success('Vital signs recorded successfully');
        setShowVitalsModal(false);
        vitalsForm.resetFields();
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handleSaveVisualAcuity = async () => {
    try {
      const values = await visualForm.validateFields();
      if (selectedPatient) {
        const visualAcuity: Omit<VisualAcuity, 'id' | 'recordedAt'> = {
          patientId: selectedPatient.id,
          rightEye: {
            withoutGlasses: values.rightEye,
            withGlasses: values.withGlasses ? values.rightEye : undefined
          },
          leftEye: {
            withoutGlasses: values.leftEye,
            withGlasses: values.withGlasses ? values.leftEye : undefined
          },
          colorVision: values.colorVision,
          notes: values.visualNotes,
          recordedBy: 'Nurse Mary Johnson'
        };
        
        addVisualAcuity(visualAcuity);
        message.success('Visual acuity test recorded successfully');
        setShowVisualModal(false);
        visualForm.resetFields();
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const queueColumns = [
    {
      title: '#',
      dataIndex: 'queueNumber',
      key: 'queueNumber',
      width: 60,
      render: (num: number) => (
        <Badge count={num} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (name: string, record: typeof mockScreeningQueue[0]) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.patientId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priority === 'urgent' ? 'red' : priority === 'high' ? 'orange' : 'green'}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      render: (time: string) => (
        <Text>
          <ClockCircleOutlined className="mr-1" />
          {time}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          waiting: { color: 'orange', text: 'Waiting' },
          'in-progress': { color: 'blue', text: 'In Progress' },
          completed: { color: 'green', text: 'Completed' }
        };
        const { color, text } = config[status as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Chief Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
      render: (complaint: string) => (
        <Text style={{ fontSize: '12px' }}>{complaint}</Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: typeof mockScreeningQueue[0]) => (
        <Button
          type="primary"
          size="small"
          icon={<CaretRightOutlined />}
          onClick={() => handleStartScreening(record)}
          disabled={record.status === 'completed'}
        >
          {record.status === 'waiting' ? 'Start' : record.status === 'in-progress' ? 'Continue' : 'Completed'}
        </Button>
      ),
    },
  ];

  return (
    <HospitalLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <HeartOutlined className="mr-2" />
            Screening Room
          </Title>
          <Text type="secondary">
            Record vital signs, visual acuity, and prepare patients for doctor consultation
          </Text>
        </div>

        {/* Statistics Row */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Patients in Queue"
                value={screeningQueue.filter(q => q.status === 'waiting').length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={screeningQueue.filter(q => q.status === 'in-progress').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed Today"
                value={screeningQueue.filter(q => q.status === 'completed').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Time"
                value={12}
                suffix="min"
                prefix={<ExperimentOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              label: 'Queue Management',
              key: 'queue',
              children: (
                <Card title="Screening Queue" className="mb-4">
                  <Table
                    dataSource={screeningQueue}
                    columns={queueColumns}
                    pagination={false}
                    rowKey="id"
                    size="small"
                  />
                </Card>
              )
            },
            {
              label: 'Vital Signs',
              key: 'vitals',
              disabled: !selectedPatient,
              children: (
                selectedPatient ? (
                  <Row gutter={16}>
                <Col span={16}>
                  <Card 
                    title={`Vital Signs - ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                    extra={
                      <Button 
                        type="primary" 
                        icon={<ExperimentOutlined />}
                        onClick={() => setShowVitalsModal(true)}
                      >
                        Record Vitals
                      </Button>
                    }
                  >
                    <Alert
                      message="Vital signs will be displayed here"
                      description="Click 'Record Vitals' to add vital signs for this patient."
                      type="info"
                      showIcon
                    />

                  </Card>
                </Col>

                <Col span={8}>
                  <Card title="Quick Actions" className="mb-4">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        block 
                        icon={<EyeOutlined />}
                        onClick={() => setShowVisualModal(true)}
                      >
                        Visual Acuity Test
                      </Button>
                      <Button 
                        block 
                        icon={<FileTextOutlined />}
                      >
                        Medical History
                      </Button>
                      <Button 
                        block 
                        icon={<AlertOutlined />}
                        type="dashed"
                      >
                        Flag Abnormal
                      </Button>
                    </Space>
                  </Card>

                  <Card title="Patient Info">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Phone:</Text> <Text>{selectedPatient.phoneNumber}</Text>
                      </div>
                      <div>
                        <Text strong>Patient ID:</Text> <Text>{selectedPatient.patientNumber}</Text>
                      </div>
                      <div>
                        <Text strong>Medical History:</Text>
                        <br />
                        <Text type="secondary">{selectedPatient.medicalHistory || 'None recorded'}</Text>
                      </div>
                    </Space>
                  </Card>

                  <div style={{ marginTop: '16px' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      onClick={handleCompleteScreening}
                      icon={<CheckCircleOutlined />}
                    >
                      Complete Screening
                    </Button>
                  </div>
                </Col>
              </Row>
                ) : null
              )
            }
          ]}
        />

        {/* Vital Signs Modal */}
        <Modal
          title="Record Vital Signs"
          open={showVitalsModal}
          onCancel={() => setShowVitalsModal(false)}
          onOk={handleSaveVitals}
          width={600}
        >
          <Form form={vitalsForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="temperature"
                  label="Temperature (°C)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={35} 
                    max={45} 
                    step={0.1} 
                    style={{ width: '100%' }}
                    placeholder="36.5"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="heartRate"
                  label="Heart Rate (bpm)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={40} 
                    max={200} 
                    style={{ width: '100%' }}
                    placeholder="72"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="systolic"
                  label="Systolic BP"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={70} 
                    max={250} 
                    style={{ width: '100%' }}
                    placeholder="120"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="diastolic"
                  label="Diastolic BP"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={40} 
                    max={150} 
                    style={{ width: '100%' }}
                    placeholder="80"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="respiratoryRate"
                  label="Resp. Rate"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={8} 
                    max={40} 
                    style={{ width: '100%' }}
                    placeholder="16"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="oxygenSaturation"
                  label="O2 Saturation (%)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={70} 
                    max={100} 
                    style={{ width: '100%' }}
                    placeholder="98"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="weight"
                  label="Weight (kg)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={300} 
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="70.5"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="height"
                  label="Height (cm)"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    min={50} 
                    max={250} 
                    style={{ width: '100%' }}
                    placeholder="170"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} placeholder="Additional observations..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* Visual Acuity Modal */}
        <Modal
          title="Visual Acuity Test"
          open={showVisualModal}
          onCancel={() => setShowVisualModal(false)}
          onOk={handleSaveVisualAcuity}
          width={500}
        >
          <Form form={visualForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="rightEye"
                  label="Right Eye"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Select placeholder="Select acuity">
                    <Select.Option value="20/20">20/20</Select.Option>
                    <Select.Option value="20/25">20/25</Select.Option>
                    <Select.Option value="20/30">20/30</Select.Option>
                    <Select.Option value="20/40">20/40</Select.Option>
                    <Select.Option value="20/50">20/50</Select.Option>
                    <Select.Option value="20/70">20/70</Select.Option>
                    <Select.Option value="20/100">20/100</Select.Option>
                    <Select.Option value="20/200">20/200</Select.Option>
                    <Select.Option value="CF">Counting Fingers</Select.Option>
                    <Select.Option value="HM">Hand Motion</Select.Option>
                    <Select.Option value="LP">Light Perception</Select.Option>
                    <Select.Option value="NLP">No Light Perception</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="leftEye"
                  label="Left Eye"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Select placeholder="Select acuity">
                    <Select.Option value="20/20">20/20</Select.Option>
                    <Select.Option value="20/25">20/25</Select.Option>
                    <Select.Option value="20/30">20/30</Select.Option>
                    <Select.Option value="20/40">20/40</Select.Option>
                    <Select.Option value="20/50">20/50</Select.Option>
                    <Select.Option value="20/70">20/70</Select.Option>
                    <Select.Option value="20/100">20/100</Select.Option>
                    <Select.Option value="20/200">20/200</Select.Option>
                    <Select.Option value="CF">Counting Fingers</Select.Option>
                    <Select.Option value="HM">Hand Motion</Select.Option>
                    <Select.Option value="LP">Light Perception</Select.Option>
                    <Select.Option value="NLP">No Light Perception</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="withGlasses" valuePropName="checked">
              <Checkbox>Tested with corrective lenses</Checkbox>
            </Form.Item>

            <Form.Item
              name="colorVision"
              label="Color Vision"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Radio.Group>
                <Radio value="normal">Normal</Radio>
                <Radio value="deficient">Color Deficient</Radio>
                <Radio value="not-tested">Not Tested</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="visualNotes" label="Notes">
              <TextArea rows={3} placeholder="Additional observations..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HospitalLayout>
  );
}