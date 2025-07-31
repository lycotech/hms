'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Badge,
  Tag,
  Space,
  List,
  Avatar
} from 'antd';
import {
  ClockCircleOutlined,
  PhoneOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useQueueStore, Department } from '@/lib/store/queueStore';

const { Title, Text } = Typography;

// Public queue display for waiting areas - no authentication required
export default function PublicQueueDisplay() {
  const {
    queues,
    lastCalledNumbers,
    isRealTimeEnabled,
    getQueueStats,
    startRealTimeUpdates
  } = useQueueStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto-start real-time updates
  useEffect(() => {
    startRealTimeUpdates();
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [startRealTimeUpdates]);

  // Department configurations for display
  const departments: { key: Department; name: string; color: string }[] = [
    { key: 'general', name: 'General Practice', color: '#1890ff' },
    { key: 'emergency', name: 'Emergency', color: '#ff4d4f' },
    { key: 'cardiology', name: 'Cardiology', color: '#722ed1' },
    { key: 'pediatrics', name: 'Pediatrics', color: '#13c2c2' },
    { key: 'orthopedics', name: 'Orthopedics', color: '#fa8c16' },
    { key: 'radiology', name: 'Radiology', color: '#52c41a' }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <Card style={{ marginBottom: 20, textAlign: 'center' }}>
        <Row justify="space-between" align="middle">
          <Col span={8}>
            <div style={{ 
              height: 60, 
              width: 120, 
              backgroundColor: '#0066cc', 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              HMS
            </div>
          </Col>
          <Col span={8}>
            <Title level={2} style={{ margin: 0, color: '#0066cc' }}>
              City General Hospital
            </Title>
            <Text style={{ fontSize: '16px' }}>
              Queue Management System
            </Text>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {formatTime(currentTime)}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {formatDate(currentTime)}
            </div>
            <Space style={{ marginTop: 8 }}>
              <Badge status={isRealTimeEnabled ? "processing" : "default"} />
              <Text style={{ fontSize: '12px' }}>
                {isRealTimeEnabled ? "Live Updates" : "Manual Mode"}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Department Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {departments.map(dept => {
          const stats = getQueueStats(dept.key);
          const lastCalled = lastCalledNumbers[dept.key];
          
          return (
            <Col key={dept.key} span={8}>
              <Card
                style={{ 
                  textAlign: 'center',
                  borderColor: dept.color,
                  borderWidth: 2
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ 
                  color: dept.color, 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  marginBottom: 8
                }}>
                  {dept.name}
                </div>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: dept.color }}>
                      {stats.totalWaiting}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Waiting
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                      {lastCalled || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Last Called
                    </div>
                  </Col>
                </Row>
                
                {stats.totalInService > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Tag color={dept.color}>
                      {stats.totalInService} In Service
                    </Tag>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Currently Called Patients */}
      <Row gutter={[16, 16]}>
        {departments.map(dept => {
          const calledPatients = queues[dept.key]?.filter(item => 
            item.status === 'called' || item.status === 'in-service'
          ) || [];

          if (calledPatients.length === 0) return null;

          return (
            <Col key={`called-${dept.key}`} span={12}>
              <Card
                title={
                  <Space>
                    <PhoneOutlined style={{ color: dept.color }} />
                    <span style={{ color: dept.color }}>{dept.name}</span>
                    <Badge count={calledPatients.length} />
                  </Space>
                }
                style={{ borderColor: dept.color }}
              >
                <List
                  dataSource={calledPatients}
                  renderItem={(item) => {
                    const isInService = item.status === 'in-service';
                    const waitTime = item.calledAt 
                      ? Math.floor((new Date().getTime() - new Date(item.calledAt).getTime()) / (1000 * 60))
                      : 0;

                    return (
                      <List.Item style={{
                        backgroundColor: isInService ? '#f6ffed' : '#fff7e6',
                        borderRadius: 8,
                        marginBottom: 8,
                        border: `1px solid ${isInService ? '#b7eb8f' : '#ffd591'}`
                      }}>
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              size={48}
                              style={{ 
                                backgroundColor: dept.color,
                                fontSize: '18px',
                                fontWeight: 'bold'
                              }}
                            >
                              {item.queueNumber}
                            </Avatar>
                          }
                          title={
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                              {item.patientName}
                              {isInService ? (
                                <Tag color="green" style={{ marginLeft: 8 }}>
                                  IN SERVICE
                                </Tag>
                              ) : (
                                <Tag color="orange" style={{ marginLeft: 8 }}>
                                  PLEASE PROCEED
                                </Tag>
                              )}
                            </div>
                          }
                          description={
                            <div>
                              <div style={{ fontSize: '14px', marginBottom: 4 }}>
                                {item.serviceType}
                              </div>
                              <Space>
                                <ClockCircleOutlined />
                                <Text>
                                  {isInService ? 
                                    `In service for ${waitTime} minutes` :
                                    `Called ${waitTime} minutes ago`
                                  }
                                </Text>
                                {item.priority === 'emergency' && (
                                  <Tag color="red">EMERGENCY</Tag>
                                )}
                                {item.priority === 'urgent' && (
                                  <Tag color="orange">URGENT</Tag>
                                )}
                              </Space>
                            </div>
                          }
                        />
                        {!isInService && (
                          <div style={{ textAlign: 'center' }}>
                            <SoundOutlined 
                              style={{ 
                                fontSize: '24px', 
                                color: dept.color,
                                animation: 'pulse 2s infinite'
                              }} 
                            />
                          </div>
                        )}
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Waiting Queue Preview */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {departments.map(dept => {
          const waitingPatients = queues[dept.key]?.filter(item => 
            item.status === 'waiting'
          ).slice(0, 3) || []; // Show next 3

          if (waitingPatients.length === 0) return null;

          return (
            <Col key={`waiting-${dept.key}`} span={8}>
              <Card
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: dept.color }} />
                    <span style={{ color: dept.color }}>Next in {dept.name}</span>
                  </Space>
                }
                size="small"
                style={{ borderColor: dept.color }}
              >
                <List
                  size="small"
                  dataSource={waitingPatients}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            size={32}
                            style={{ 
                              backgroundColor: index === 0 ? '#52c41a' : dept.color,
                              fontSize: '14px'
                            }}
                          >
                            {item.queueNumber}
                          </Avatar>
                        }
                        title={
                          <Space>
                            <span style={{ fontSize: '14px' }}>
                              {item.patientName}
                            </span>
                            {index === 0 && (
                              <Tag color="green">NEXT</Tag>
                            )}
                          </Space>
                        }
                        description={
                          <Text style={{ fontSize: '12px' }}>
                            Est. wait: {item.estimatedWaitTime} min
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: 40, 
        padding: 20,
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 8
      }}>
        <Text style={{ fontSize: '14px', color: '#666' }}>
          For emergencies, please proceed directly to the Emergency Department • 
          For assistance, please contact reception • 
          Thank you for your patience
        </Text>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}