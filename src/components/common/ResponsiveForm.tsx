'use client';

import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Space } from 'antd';
import type { FormProps, ColProps } from 'antd';

interface ResponsiveFormProps extends FormProps {
  children: React.ReactNode;
  mobileLayout?: 'vertical' | 'horizontal';
  submitButton?: React.ReactNode;
  resetButton?: React.ReactNode;
  actions?: React.ReactNode;
}

interface ResponsiveFormItemProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  name?: string | string[];
  rules?: Record<string, unknown>[];
  mobileSpan?: number;
  tabletSpan?: number;
  desktopSpan?: number;
  colProps?: ColProps;
}

export function ResponsiveForm({ 
  children, 
  mobileLayout = 'vertical',
  submitButton,
  resetButton,
  actions,
  ...formProps 
}: ResponsiveFormProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Form
      {...formProps}
      layout={isMobile ? mobileLayout : formProps.layout || 'horizontal'}
      className={`responsive-form ${formProps.className || ''}`}
    >
      <Row gutter={[16, 16]}>
        {children}
      </Row>
      
      {(submitButton || resetButton || actions) && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Space 
              style={{ 
                width: '100%', 
                justifyContent: isMobile ? 'center' : 'flex-end' 
              }}
            >
              {resetButton}
              {submitButton}
              {actions}
            </Space>
          </Col>
        </Row>
      )}
    </Form>
  );
}

export function ResponsiveFormItem({ 
  children, 
  label,
  required,
  name,
  rules,
  mobileSpan = 24,
  tabletSpan = 12,
  desktopSpan = 8,
  colProps,
  ...itemProps 
}: ResponsiveFormItemProps) {
  return (
    <Col 
      xs={mobileSpan} 
      sm={tabletSpan} 
      md={desktopSpan}
      {...colProps}
      className="responsive-form-item"
    >
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        required={required}
        {...itemProps}
      >
        {children}
      </Form.Item>
    </Col>
  );
}