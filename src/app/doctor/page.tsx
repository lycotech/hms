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
  Radio,
  Checkbox,
  Tabs,
  Badge,
  List,
  Avatar,
  Drawer,
  Timeline,
  Rate,
  Collapse
} from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  CaretRightOutlined,
  SaveOutlined
} from '@ant-design/icons';
import HospitalLayout from '@/components/layout/HospitalLayout';
import { usePatientStore } from '@/lib/store/patientStore';
import { usePaymentStore } from '@/lib/store/paymentStore';
import { mockMedications } from '@/lib/mockData/medications';
import type { Patient, Prescription, Consultation } from '@/lib/types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Mock consultation queue
const mockConsultationQueue = [
  {
    id: 'C001',
    patientName: 'Adebayo Ogundimu',
    patientId: 'P001',
    queueNumber: 1,
    appointmentTime: '09:30',
    priority: 'normal',
    status: 'ready',
    chiefComplaint: 'Chest pain and shortness of breath',
    vitalsSummary: 'BP: 140/90, HR: 88, Temp: 37.2°C',
    screeningNotes: 'Patient appears anxious, stable vitals'
  },
  {
    id: 'C002',
    patientName: 'Fatima Ibrahim',
    patientId: 'P002',
    queueNumber: 2,
    appointmentTime: '09:45',
    priority: 'urgent',
    status: 'waiting',
    chiefComplaint: 'High fever and persistent headache',
    vitalsSummary: 'BP: 120/80, HR: 102, Temp: 39.1°C',
    screeningNotes: 'High fever, needs immediate attention'
  }
];

export default function DoctorPage() {
  const { patients, addConsultation } = usePatientStore();
  const { addPrescription } = usePaymentStore();
  const [consultationForm] = Form.useForm();
  const [prescriptionForm] = Form.useForm();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [consultationQueue, setConsultationQueue] = useState(mockConsultationQueue);
  const [currentConsultation, setCurrentConsultation] = useState<Partial<Consultation>>({});
  const [prescriptionItems, setPrescriptionItems] = useState<Array<{
    medicationId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
  }>>([]);

  const handleStartConsultation = (queueItem: typeof mockConsultationQueue[0]) => {
    const patient = patients.find(p => p.id === queueItem.patientId);
    if (patient) {
      setSelectedPatient(patient);
      setActiveTab('consultation');
      
      // Initialize consultation
      setCurrentConsultation({
        patientId: patient.id,
        doctorId: 'DOC001',
        doctorName: 'Dr. Michael Adebayo',
        chiefComplaint: queueItem.chiefComplaint,
        date: new Date(),
        status: 'in-progress'
      });
      
      // Update queue status
      setConsultationQueue(prev => 
        prev.map(q => 
          q.id === queueItem.id 
            ? { ...q, status: 'in-progress' }
            : q
        )
      );
      
      message.success(`Started consultation for ${patient.firstName} ${patient.lastName}`);
    }
  };

  const handleSaveConsultation = async () => {
    try {
      const values = await consultationForm.validateFields();
      if (selectedPatient) {
        const consultation: Consultation = {
          id: `CONS-${Date.now()}`,
          patientId: selectedPatient.id,
          doctorId: 'DOC001',
          doctorName: 'Dr. Michael Adebayo',
          date: new Date(),
          chiefComplaint: currentConsultation.chiefComplaint || '',
          historyOfPresentIllness: values.historyOfPresentIllness,
          physicalExamination: values.physicalExamination,
          assessment: values.assessment,
          plan: values.plan,
          diagnosis: values.diagnosis,
          followUpDate: values.followUpDate?.toDate(),
          status: 'completed',
          notes: values.notes
        };
        
        addConsultation(consultation);
        
        // Mark consultation as completed in queue
        setConsultationQueue(prev => 
          prev.map(q => 
            q.patientId === selectedPatient.id 
              ? { ...q, status: 'completed' }
              : q
          )
        );
        
        message.success('Consultation saved successfully');
        consultationForm.resetFields();
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handleAddPrescription = () => {
    prescriptionForm.validateFields().then(values => {
      const newItem = {
        medicationId: values.medicationId,
        medicationName: mockMedications.find(m => m.id === values.medicationId)?.name || '',
        dosage: values.dosage,
        frequency: values.frequency,
        duration: values.duration,
        instructions: values.instructions,
        quantity: values.quantity
      };
      
      setPrescriptionItems(prev => [...prev, newItem]);
      prescriptionForm.resetFields();
      message.success('Medication added to prescription');
    }).catch(() => {
      message.error('Please fill in all medication fields');
    });
  };

  const handleSavePrescription = () => {
    if (prescriptionItems.length === 0) {
      message.error('Please add at least one medication');
      return;
    }
    
    if (selectedPatient) {
      const prescription: Prescription = {
        id: `PRES-${Date.now()}`,
        patientId: selectedPatient.id,
        doctorId: 'DOC001',
        consultationId: currentConsultation.id || '',
        medications: prescriptionItems,
        instructions: 'Take medications as prescribed. Return if symptoms worsen.',
        issuedAt: new Date(),
        status: 'pending'
      };
      
      addPrescription(prescription);
      setPrescriptionItems([]);
      setShowPrescriptionModal(false);
      message.success('Prescription issued successfully');
    }
  };

  const handleCompleteConsultation = () => {
    if (selectedPatient) {
      message.success(`Consultation completed for ${selectedPatient.firstName} ${selectedPatient.lastName}`);
      setSelectedPatient(null);
      setCurrentConsultation({});
      setActiveTab('queue');
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
      render: (name: string, record: typeof mockConsultationQueue[0]) => (
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
      title: 'Appointment',
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
          ready: { color: 'green', text: 'Ready' },
          'in-progress': { color: 'blue', text: 'In Progress' },
          completed: { color: 'purple', text: 'Completed' }
        };
        const { color, text } = config[status as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Chief Complaint',
      dataIndex: 'chiefComplaint',
      key: 'chiefComplaint',
      render: (complaint: string) => (
        <Text style={{ fontSize: '12px' }}>{complaint}</Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: typeof mockConsultationQueue[0]) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CaretRightOutlined />}
            onClick={() => handleStartConsultation(record)}
            disabled={record.status === 'completed'}
          >
            {record.status === 'waiting' || record.status === 'ready' ? 'Start' : 
             record.status === 'in-progress' ? 'Continue' : 'Completed'}
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              const patient = patients.find(p => p.id === record.patientId);
              setSelectedPatient(patient || null);
              setShowHistoryDrawer(true);
            }}
          >
            History
          </Button>
        </Space>
      ),
    },
  ];

  const prescriptionColumns = [
    {
      title: 'Medication',
      dataIndex: 'medicationName',
      key: 'medicationName',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: typeof prescriptionItems[0], index: number) => (
        <Button
          type="link"
          danger
          onClick={() => {
            setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <HospitalLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <UserOutlined className="mr-2" />
            Doctor Consultation
          </Title>
          <Text type="secondary">
            Patient consultations, diagnosis, and prescription management
          </Text>
        </div>

        {/* Statistics Row */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Patients Waiting"
                value={consultationQueue.filter(q => q.status === 'waiting' || q.status === 'ready').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="In Consultation"
                value={consultationQueue.filter(q => q.status === 'in-progress').length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed Today"
                value={consultationQueue.filter(q => q.status === 'completed').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Time"
                value={25}
                suffix="min"
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Consultation Queue" key="queue">
            <Card title="Today's Consultations" className="mb-4">
              <Table
                dataSource={consultationQueue}
                columns={queueColumns}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          </TabPane>

          <TabPane tab="Patient Consultation" key="consultation" disabled={!selectedPatient}>
            {selectedPatient && (
              <Row gutter={16}>
                <Col span={16}>
                  <Card 
                    title={`Consultation - ${selectedPatient.firstName} ${selectedPatient.lastName}`}
                    extra={
                      <Space>
                        <Button 
                          icon={<MedicineBoxOutlined />}
                          onClick={() => setShowPrescriptionModal(true)}
                        >
                          Prescribe
                        </Button>
                        <Button 
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSaveConsultation}
                        >
                          Save Consultation
                        </Button>
                      </Space>
                    }
                  >
                    <Form form={consultationForm} layout="vertical">
                      <Alert
                        message={`Chief Complaint: ${currentConsultation.chiefComplaint}`}
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />

                      <Form.Item
                        name="historyOfPresentIllness"
                        label="History of Present Illness"
                        rules={[{ required: true, message: 'Please provide history of present illness' }]}
                      >
                        <TextArea 
                          rows={4} 
                          placeholder="Describe the patient's symptoms, onset, duration, severity, and any associated factors..."
                        />
                      </Form.Item>

                      <Form.Item
                        name="physicalExamination"
                        label="Physical Examination"
                        rules={[{ required: true, message: 'Please document physical examination findings' }]}
                      >
                        <TextArea 
                          rows={4} 
                          placeholder="Document examination findings: general appearance, vital signs, system-specific findings..."
                        />
                      </Form.Item>

                      <Form.Item
                        name="assessment"
                        label="Clinical Assessment"
                        rules={[{ required: true, message: 'Please provide clinical assessment' }]}
                      >
                        <TextArea 
                          rows={3} 
                          placeholder="Clinical impression and differential diagnosis..."
                        />
                      </Form.Item>

                      <Form.Item
                        name="diagnosis"
                        label="Primary Diagnosis"
                        rules={[{ required: true, message: 'Please provide primary diagnosis' }]}
                      >
                        <Input placeholder="ICD-10 code and diagnosis description" />
                      </Form.Item>

                      <Form.Item
                        name="plan"
                        label="Treatment Plan"
                        rules={[{ required: true, message: 'Please provide treatment plan' }]}
                      >
                        <TextArea 
                          rows={3} 
                          placeholder="Treatment plan, investigations, follow-up instructions..."
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="followUpDate"
                            label="Follow-up Date"
                          >
                            <DatePicker style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="notes"
                            label="Additional Notes"
                          >
                            <TextArea rows={2} placeholder="Additional notes..." />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card title="Patient Information" className="mb-4">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Age:</Text> <Text>{selectedPatient.age} years</Text>
                      </div>
                      <div>
                        <Text strong>Gender:</Text> <Text>{selectedPatient.gender}</Text>
                      </div>
                      <div>
                        <Text strong>Blood Type:</Text> <Text>{selectedPatient.bloodType}</Text>
                      </div>
                      <div>
                        <Text strong>Phone:</Text> <Text>{selectedPatient.phone}</Text>
                      </div>
                      <Divider />
                      <div>
                        <Text strong>Allergies:</Text>
                        <br />
                        {selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map(allergy => (
                            <Tag key={allergy} color="red" style={{ margin: '2px' }}>
                              {allergy}
                            </Tag>
                          ))
                        ) : (
                          <Text type="secondary">None recorded</Text>
                        )}
                      </div>
                    </Space>
                  </Card>

                  <Card title="Latest Vital Signs" className="mb-4">
                    {selectedPatient.vitalSigns && selectedPatient.vitalSigns.length > 0 ? (
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {(() => {
                          const latest = selectedPatient.vitalSigns[selectedPatient.vitalSigns.length - 1];
                          return (
                            <>
                              <div><Text strong>BP:</Text> <Text>{latest.bloodPressure} mmHg</Text></div>
                              <div><Text strong>HR:</Text> <Text>{latest.heartRate} bpm</Text></div>
                              <div><Text strong>Temp:</Text> <Text>{latest.temperature}°C</Text></div>
                              <div><Text strong>SpO2:</Text> <Text>{latest.oxygenSaturation}%</Text></div>
                              <div><Text strong>Weight:</Text> <Text>{latest.weight} kg</Text></div>
                              <div><Text strong>BMI:</Text> <Text>{latest.bmi}</Text></div>
                            </>
                          );
                        })()}
                      </Space>
                    ) : (
                      <Text type="secondary">No vital signs recorded</Text>
                    )}
                  </Card>

                  <Card title="Quick Actions" className="mb-4">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        block 
                        icon={<HistoryOutlined />}
                        onClick={() => setShowHistoryDrawer(true)}
                      >
                        Medical History
                      </Button>
                      <Button 
                        block 
                        icon={<FileTextOutlined />}
                      >
                        Previous Reports
                      </Button>
                      <Button 
                        block 
                        icon={<PrinterOutlined />}
                      >
                        Print Summary
                      </Button>
                    </Space>
                  </Card>

                  <div style={{ marginTop: '16px' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      onClick={handleCompleteConsultation}
                      icon={<CheckCircleOutlined />}
                    >
                      Complete Consultation
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </TabPane>
        </Tabs>

        {/* Prescription Modal */}
        <Modal
          title="Create Prescription"
          open={showPrescriptionModal}
          onCancel={() => setShowPrescriptionModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowPrescriptionModal(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleSavePrescription}>
              Issue Prescription
            </Button>,
          ]}
          width={800}
        >
          <div style={{ marginBottom: '16px' }}>
            <Title level={4}>Add Medications</Title>
            <Form form={prescriptionForm} layout="inline" style={{ marginBottom: '16px' }}>
              <Form.Item
                name="medicationId"
                rules={[{ required: true, message: 'Select medication' }]}
              >
                <Select placeholder="Select medication" style={{ width: 200 }}>
                  {mockMedications.map(med => (
                    <Select.Option key={med.id} value={med.id}>
                      {med.name} ({med.strength})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="dosage"
                rules={[{ required: true, message: 'Enter dosage' }]}
              >
                <Input placeholder="Dosage" style={{ width: 100 }} />
              </Form.Item>

              <Form.Item
                name="frequency"
                rules={[{ required: true, message: 'Enter frequency' }]}
              >
                <Select placeholder="Frequency" style={{ width: 120 }}>
                  <Select.Option value="Once daily">Once daily</Select.Option>
                  <Select.Option value="Twice daily">Twice daily</Select.Option>
                  <Select.Option value="Three times daily">Three times daily</Select.Option>
                  <Select.Option value="Four times daily">Four times daily</Select.Option>
                  <Select.Option value="As needed">As needed</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="duration"
                rules={[{ required: true, message: 'Enter duration' }]}
              >
                <Input placeholder="Duration" style={{ width: 100 }} />
              </Form.Item>

              <Form.Item
                name="quantity"
                rules={[{ required: true, message: 'Enter quantity' }]}
              >
                <InputNumber placeholder="Qty" min={1} style={{ width: 80 }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPrescription}>
                  Add
                </Button>
              </Form.Item>
            </Form>

            <Form.Item
              name="instructions"
              style={{ width: '100%' }}
            >
              <TextArea placeholder="Special instructions..." rows={2} />
            </Form.Item>
          </div>

          <Table
            dataSource={prescriptionItems}
            columns={prescriptionColumns}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
          />
        </Modal>

        {/* Medical History Drawer */}
        <Drawer
          title={`Medical History - ${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
          placement="right"
          onClose={() => setShowHistoryDrawer(false)}
          open={showHistoryDrawer}
          width={600}
        >
          {selectedPatient && (
            <div>
              <Collapse defaultActiveKey={['consultations']}>
                <Panel header="Previous Consultations" key="consultations">
                  {selectedPatient.consultations && selectedPatient.consultations.length > 0 ? (
                    <Timeline>
                      {selectedPatient.consultations.slice(-5).reverse().map((consultation, index) => (
                        <Timeline.Item key={index}>
                          <div>
                            <Text strong>{consultation.date.toLocaleDateString()}</Text>
                            <br />
                            <Text>Dr. {consultation.doctorName}</Text>
                            <br />
                            <Text type="secondary">{consultation.diagnosis}</Text>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Text type="secondary">No previous consultations</Text>
                  )}
                </Panel>

                <Panel header="Vital Signs History" key="vitals">
                  {selectedPatient.vitalSigns && selectedPatient.vitalSigns.length > 0 ? (
                    <List
                      dataSource={selectedPatient.vitalSigns.slice(-5).reverse()}
                      renderItem={(vital, index) => (
                        <List.Item>
                          <List.Item.Meta
                            title={vital.recordedAt.toLocaleDateString()}
                            description={`BP: ${vital.bloodPressure} | HR: ${vital.heartRate} | Temp: ${vital.temperature}°C`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary">No vital signs history</Text>
                  )}
                </Panel>

                <Panel header="Medical Conditions" key="conditions">
                  {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                    selectedPatient.medicalHistory.map((condition, index) => (
                      <Tag key={index} color="blue" style={{ margin: '2px' }}>
                        {condition}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">No medical conditions recorded</Text>
                  )}
                </Panel>
              </Collapse>
            </div>
          )}
        </Drawer>
      </div>
    </HospitalLayout>
  );
}