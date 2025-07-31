'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Select,
  Space,
  Typography,
  Alert,
  Badge,
  List,
  Avatar,
  Tag,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Statistic,
  message
} from 'antd';
import {
  PhoneOutlined,
  SoundOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BellOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useQueueStore, Department, QueueItem } from '@/lib/store/queueStore';
import { useAuth } from '@/lib/context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

interface PatientCallingSystemProps {
  defaultDepartment?: Department;
  showAllDepartments?: boolean;
}

export default function PatientCallingSystem({ 
  defaultDepartment = 'general',
  showAllDepartments = false 
}: PatientCallingSystemProps) {
  const { user } = useAuth();
  const {
    queues,
    audioEnabled,
    notifications,
    callNextPatient,
    markAsCompleted,
    markAsNoShow,
    updateQueueItem,
    playAnnouncement,
    getQueueStats,
    addNotification
  } = useQueueStore();

  const [selectedDepartment, setSelectedDepartment] = useState<Department>(defaultDepartment);
  const [callingModal, setCallingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<QueueItem | null>(null);
  const [form] = Form.useForm();

  // Get current department data
  const departmentQueue = queues[selectedDepartment] || [];
  const waitingPatients = departmentQueue.filter(item => item.status === 'waiting');
  const calledPatients = departmentQueue.filter(item => item.status === 'called');
  const inServicePatients = departmentQueue.filter(item => 
    item.status === 'in-service' && item.assignedTo === user?.id
  );
  const stats = getQueueStats(selectedDepartment);

  // Handle calling next patient
  const handleCallNext = () => {
    if (waitingPatients.length === 0) {
      message.warning('No patients waiting in queue');
      return;
    }

    const calledPatient = callNextPatient(selectedDepartment, user?.id);
    if (calledPatient) {
      message.success(`Called ${calledPatient.patientName} - Queue #${calledPatient.queueNumber}`);
      
      // Update patient status to in-service after a delay (simulating patient arrival)
      setTimeout(() => {
        updateQueueItem(calledPatient.id, { status: 'in-service' });
      }, 30000); // 30 seconds
    }
  };

  // Handle specific patient call
  const handleCallSpecificPatient = (patient: QueueItem) => {
    setSelectedPatient(patient);
    setCallingModal(true);
    form.setFieldsValue({
      patientName: patient.patientName,
      queueNumber: patient.queueNumber,
      message: `${patient.patientName}, queue number ${patient.queueNumber}, please proceed to ${selectedDepartment} department.`
    });
  };

  // Handle custom announcement
  const handleCustomAnnouncement = async () => {
    try {
      const values = await form.validateFields();
      
      if (selectedPatient) {
        // Update patient status
        updateQueueItem(selectedPatient.id, {
          status: 'called',
          calledAt: new Date().toISOString(),
          assignedTo: user?.id
        });

        // Play custom announcement
        if (audioEnabled && values.message) {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(values.message);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }
        }

        // Add notification
        addNotification({
          type: 'called',
          message: `Custom call: ${selectedPatient.patientName}`,
          queueItem: selectedPatient
        });

        message.success('Patient called successfully');
        setCallingModal(false);
        setSelectedPatient(null);
        form.resetFields();
      }
    } catch {
      message.error('Please fill in all required fields');
    }
  };

  // Handle patient status update
  const handleStatusUpdate = (patientId: string, newStatus: 'completed' | 'no-show' | 'in-service') => {
    if (newStatus === 'completed') {
      markAsCompleted(patientId);
      message.success('Patient marked as completed');
    } else if (newStatus === 'no-show') {
      markAsNoShow(patientId);
      message.warning('Patient marked as no-show');
    } else if (newStatus === 'in-service') {
      updateQueueItem(patientId, { 
        status: 'in-service',
        assignedTo: user?.id 
      });
      message.info('Patient marked as in service');
    }
  };

  // Handle repeat announcement
  const handleRepeatAnnouncement = (patient: QueueItem) => {
    playAnnouncement(patient);
    message.info('Announcement repeated');
  };

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>Patient Calling System</Title>
                <Text type="secondary">
                  {user?.firstName} {user?.lastName} - {user?.role}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              {!showAllDepartments && (
                <Select
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  style={{ width: 150 }}
                >
                  <Option value="general">General</Option>
                  <Option value="emergency">Emergency</Option>
                  <Option value="cardiology">Cardiology</Option>
                  <Option value="pediatrics">Pediatrics</Option>
                  <Option value="orthopedics">Orthopedics</Option>
                  <Option value="radiology">Radiology</Option>
                </Select>
              )}
              <Badge count={notifications.filter(n => !n.read).length}>
                <Button icon={<BellOutlined />}>
                  Notifications
                </Button>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Queue Statistics */}
        <Col span={24}>
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Waiting"
                  value={stats.totalWaiting}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Called"
                  value={calledPatients.length}
                  prefix={<PhoneOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="In Service"
                  value={inServicePatients.length}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Completed Today"
                  value={stats.totalCompleted}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Call Next Patient */}
        <Col span={12}>
          <Card title="Call Next Patient">
            {waitingPatients.length > 0 ? (
              <div>
                <Alert
                  message="Next Patient"
                  description={
                    <div>
                      <Text strong>{waitingPatients[0].patientName}</Text>
                      <br />
                      Queue #{waitingPatients[0].queueNumber} - {waitingPatients[0].serviceType}
                      <br />
                      <Tag color={waitingPatients[0].priority === 'emergency' ? 'red' : 
                                  waitingPatients[0].priority === 'urgent' ? 'orange' : 'green'}>
                        {waitingPatients[0].priority.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<PhoneOutlined />}
                  onClick={handleCallNext}
                  block
                  style={{ height: 60, fontSize: '16px' }}
                >
                  Call Next Patient
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                <div>No patients waiting</div>
                <Text type="secondary">All caught up!</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* My Current Patients */}
        <Col span={12}>
          <Card title="My Current Patients">
            {inServicePatients.length > 0 ? (
              <List
                dataSource={inServicePatients}
                renderItem={(patient: QueueItem) => (
                  <List.Item
                    actions={[
                      <Button
                        key="complete"
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleStatusUpdate(patient.id, 'completed')}
                      >
                        Complete
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{patient.queueNumber}</Avatar>}
                      title={patient.patientName}
                      description={
                        <div>
                          <div>{patient.serviceType}</div>
                          <Text type="secondary">
                            Started: {patient.calledAt ? new Date(patient.calledAt).toLocaleTimeString() : 'N/A'}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
                <div>No patients in service</div>
                <Text type="secondary">Ready for next patient</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Called Patients (Waiting to arrive) */}
        {calledPatients.length > 0 && (
          <Col span={12}>
            <Card title="Called Patients" extra={<Badge count={calledPatients.length} />}>
              <List
                dataSource={calledPatients}
                renderItem={(patient: QueueItem) => {
                  const waitTime = patient.calledAt 
                    ? Math.floor((new Date().getTime() - new Date(patient.calledAt).getTime()) / (1000 * 60))
                    : 0;
                  
                  return (
                    <List.Item
                      actions={[
                        <Button
                          key="repeat"
                          size="small"
                          icon={<SoundOutlined />}
                          onClick={() => handleRepeatAnnouncement(patient)}
                        >
                          Repeat
                        </Button>,
                        <Button
                          key="arrived"
                          type="primary"
                          size="small"
                          onClick={() => handleStatusUpdate(patient.id, 'in-service')}
                        >
                          Arrived
                        </Button>,
                        <Button
                          key="no-show"
                          size="small"
                          onClick={() => handleStatusUpdate(patient.id, 'no-show')}
                        >
                          No Show
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#fa8c16' }}>{patient.queueNumber}</Avatar>}
                        title={patient.patientName}
                        description={
                          <div>
                            <div>{patient.serviceType}</div>
                            <Text type="secondary">
                              Called {waitTime} minutes ago
                            </Text>
                            {waitTime > 5 && (
                              <Tag color="orange" style={{ marginLeft: 8 }}>
                                OVERDUE
                              </Tag>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          </Col>
        )}

        {/* Waiting Queue */}
        <Col span={12}>
          <Card title="Waiting Queue" extra={<Badge count={waitingPatients.length} />}>
            {waitingPatients.length > 0 ? (
              <List
                dataSource={waitingPatients.slice(0, 5)} // Show first 5
                renderItem={(patient: QueueItem, index: number) => (
                  <List.Item
                    actions={[
                      <Button
                        key="call"
                        size="small"
                        icon={<PhoneOutlined />}
                        onClick={() => handleCallSpecificPatient(patient)}
                      >
                        Call Now
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ 
                          backgroundColor: index === 0 ? '#52c41a' : '#1890ff' 
                        }}>
                          {patient.queueNumber}
                        </Avatar>
                      }
                      title={
                        <Space>
                          {patient.patientName}
                          {index === 0 && <Tag color="green">NEXT</Tag>}
                          <Tag color={patient.priority === 'emergency' ? 'red' : 
                                     patient.priority === 'urgent' ? 'orange' : 'green'}>
                            {patient.priority.toUpperCase()}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <div>{patient.serviceType}</div>
                          <Text type="secondary">
                            Est. wait: {patient.estimatedWaitTime} minutes
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <ClockCircleOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
                <div>No patients waiting</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Custom Call Modal */}
      <Modal
        title="Call Specific Patient"
        open={callingModal}
        onOk={handleCustomAnnouncement}
        onCancel={() => {
          setCallingModal(false);
          setSelectedPatient(null);
          form.resetFields();
        }}
        okText="Call Patient"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patientName" label="Patient Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="queueNumber" label="Queue Number">
            <Input disabled />
          </Form.Item>
          <Form.Item 
            name="message" 
            label="Announcement Message"
            rules={[{ required: true, message: 'Please enter the announcement message' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter custom announcement message..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}