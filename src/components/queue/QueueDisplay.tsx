'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Badge,
  Tag,
  Button,
  Space,
  Statistic,
  Progress,
  List,
  Avatar,
  Alert,
  Switch,
  Tooltip,
  Spin
} from 'antd';
import {
  SoundOutlined,
  SoundFilled,
  ReloadOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useQueueStore, Department, QueueItem, Priority } from '@/lib/store/queueStore';

const { Title, Text } = Typography;

interface QueueDisplayProps {
  departments?: Department[];
  showControls?: boolean;
  compact?: boolean;
  autoRefresh?: boolean;
}

export default function QueueDisplay({ 
  departments = ['general', 'emergency', 'cardiology', 'pediatrics'],
  showControls = true,
  compact = false,
  autoRefresh = true
}: QueueDisplayProps) {
  const {
    queues,
    lastCalledNumbers,
    isRealTimeEnabled,
    audioEnabled,
    notifications,
    getQueueStats,
    callNextPatient,
    markAsCompleted,
    markAsNoShow,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    toggleAudio,
    playAnnouncement
  } = useQueueStore();

  const [selectedDepartment, setSelectedDepartment] = useState<Department>('general');
  const [loading, setLoading] = useState(false);

  // Auto-start real-time updates
  useEffect(() => {
    if (autoRefresh && !isRealTimeEnabled) {
      startRealTimeUpdates();
    }
    
    return () => {
      if (autoRefresh) {
        stopRealTimeUpdates();
      }
    };
  }, [autoRefresh, isRealTimeEnabled, startRealTimeUpdates, stopRealTimeUpdates]);

  // Priority color mapping
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'emergency': return '#ff4d4f';
      case 'urgent': return '#fa8c16';
      case 'normal': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // Department color mapping
  const getDepartmentColor = (department: Department) => {
    const colors = {
      general: '#1890ff',
      emergency: '#ff4d4f',
      cardiology: '#722ed1',
      pediatrics: '#13c2c2',
      orthopedics: '#fa8c16',
      radiology: '#52c41a'
    };
    return colors[department] || '#1890ff';
  };

  // Handle call next patient
  const handleCallNext = async (department: Department) => {
    setLoading(true);
    try {
      const calledPatient = callNextPatient(department, 'Current User');
      if (calledPatient) {
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle patient status updates
  const handleStatusUpdate = (itemId: string, action: 'complete' | 'no-show') => {
    if (action === 'complete') {
      markAsCompleted(itemId);
    } else {
      markAsNoShow(itemId);
    }
  };

  // Get queue statistics for selected department
  const stats = getQueueStats(selectedDepartment);
  const departmentQueue = queues[selectedDepartment] || [];
  const waitingPatients = departmentQueue.filter(item => item.status === 'waiting');
  const calledPatients = departmentQueue.filter(item => item.status === 'called');

  if (compact) {
    return (
      <Card title="Queue Overview" size="small">
        <Row gutter={[8, 8]}>
          {departments.map(dept => {
            const deptStats = getQueueStats(dept);
            return (
              <Col key={dept} span={6}>
                <Card size="small" style={{ textAlign: 'center', borderColor: getDepartmentColor(dept) }}>
                  <div style={{ color: getDepartmentColor(dept), fontWeight: 'bold', fontSize: '12px' }}>
                    {dept.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {deptStats.totalWaiting}
                  </div>
                  <div style={{ fontSize: '10px', color: '#999' }}>
                    Last: #{lastCalledNumbers[dept] || 0}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    );
  }

  return (
    <div>
      {/* Header Controls */}
      {showControls && (
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  <TeamOutlined /> Queue Management System
                </Title>
                <Badge 
                  status={isRealTimeEnabled ? "processing" : "default"} 
                  text={isRealTimeEnabled ? "Live Updates" : "Manual Mode"} 
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <Tooltip title="Real-time Updates">
                  <Switch
                    checked={isRealTimeEnabled}
                    onChange={(checked) => {
                      if (checked) {
                        startRealTimeUpdates();
                      } else {
                        stopRealTimeUpdates();
                      }
                    }}
                    checkedChildren="Live"
                    unCheckedChildren="Manual"
                  />
                </Tooltip>
                <Tooltip title="Audio Announcements">
                  <Button
                    type={audioEnabled ? "primary" : "default"}
                    icon={audioEnabled ? <SoundFilled /> : <SoundOutlined />}
                    onClick={toggleAudio}
                  />
                </Tooltip>
                <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* Notifications Alert */}
      {notifications.filter(n => !n.read).length > 0 && (
        <Alert
          message={`${notifications.filter(n => !n.read).length} new notifications`}
          description={notifications.filter(n => !n.read)[0]?.message}
          type="info"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]}>
        {/* Department Selector */}
        <Col span={6}>
          <Card title="Departments">
            <Space direction="vertical" style={{ width: '100%' }}>
              {departments.map(dept => {
                const deptStats = getQueueStats(dept);
                const isSelected = selectedDepartment === dept;
                
                return (
                  <Card
                    key={dept}
                    size="small"
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? getDepartmentColor(dept) : undefined,
                      backgroundColor: isSelected ? `${getDepartmentColor(dept)}10` : undefined
                    }}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: getDepartmentColor(dept),
                          textTransform: 'capitalize'
                        }}>
                          {dept}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          Last: #{lastCalledNumbers[dept] || 0}
                        </div>
                      </Col>
                      <Col>
                        <Badge count={deptStats.totalWaiting} showZero />
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </Space>
          </Card>
        </Col>

        {/* Main Queue Display */}
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {/* Statistics */}
            <Col span={24}>
              <Card title={`${selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)} Department`}>
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
                      title="In Service"
                      value={stats.totalInService}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Completed"
                      value={stats.totalCompleted}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Avg Wait"
                      value={stats.averageWaitTime}
                      suffix="min"
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    size="large"
                    loading={loading}
                    disabled={waitingPatients.length === 0}
                    onClick={() => handleCallNext(selectedDepartment)}
                    style={{ backgroundColor: getDepartmentColor(selectedDepartment) }}
                  >
                    Call Next Patient
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Currently Called */}
            {calledPatients.length > 0 && (
              <Col span={24}>
                <Card title="Currently Called" style={{ borderColor: '#fa8c16' }}>
                  <List
                    dataSource={calledPatients}
                    renderItem={(item: QueueItem) => (
                      <List.Item
                        actions={[
                          <Button
                            key="complete"
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleStatusUpdate(item.id, 'complete')}
                          >
                            Complete
                          </Button>,
                          <Button
                            key="no-show"
                            size="small"
                            icon={<ExclamationCircleOutlined />}
                            onClick={() => handleStatusUpdate(item.id, 'no-show')}
                          >
                            No Show
                          </Button>,
                          <Button
                            key="announce"
                            size="small"
                            icon={<SoundOutlined />}
                            onClick={() => playAnnouncement(item)}
                          >
                            Announce
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ backgroundColor: getPriorityColor(item.priority) }}>
                              {item.queueNumber}
                            </Avatar>
                          }
                          title={
                            <Space>
                              <Text strong>{item.patientName}</Text>
                              <Tag color={getPriorityColor(item.priority)}>
                                {item.priority.toUpperCase()}
                              </Tag>
                            </Space>
                          }
                          description={
                            <div>
                              <div>{item.serviceType}</div>
                              <Text type="secondary">
                                Called: {new Date(item.calledAt!).toLocaleTimeString()}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            )}

            {/* Waiting Queue */}
            <Col span={24}>
              <Card 
                title={`Waiting Queue (${waitingPatients.length})`}
                extra={
                  isRealTimeEnabled && <Spin size="small" />
                }
              >
                {waitingPatients.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <TeamOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <div>No patients waiting</div>
                  </div>
                ) : (
                  <List
                    dataSource={waitingPatients.slice(0, 10)} // Show next 10
                    renderItem={(item: QueueItem, index: number) => {
                      const waitTime = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / (1000 * 60));
                      
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                style={{ 
                                  backgroundColor: index === 0 ? '#52c41a' : getPriorityColor(item.priority) 
                                }}
                              >
                                {item.queueNumber}
                              </Avatar>
                            }
                            title={
                              <Space>
                                <Text strong>{item.patientName}</Text>
                                <Tag color={getPriorityColor(item.priority)}>
                                  {item.priority.toUpperCase()}
                                </Tag>
                                {index === 0 && <Tag color="green">NEXT</Tag>}
                              </Space>
                            }
                            description={
                              <div>
                                <div>{item.serviceType}</div>
                                <Space>
                                  <Text type="secondary">
                                    Wait: {waitTime}min
                                  </Text>
                                  <Text type="secondary">
                                    Est: {item.estimatedWaitTime}min
                                  </Text>
                                </Space>
                              </div>
                            }
                          />
                          <div style={{ textAlign: 'right' }}>
                            <Progress
                              type="circle"
                              size={40}
                              percent={Math.min(100, (waitTime / item.estimatedWaitTime) * 100)}
                              showInfo={false}
                              strokeColor={waitTime > item.estimatedWaitTime ? '#ff4d4f' : '#1890ff'}
                            />
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}