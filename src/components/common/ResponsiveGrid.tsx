'use client';

import React from 'react';
import { Row, Col } from 'antd';
import type { RowProps, ColProps } from 'antd';

interface ResponsiveGridProps extends RowProps {
  children: React.ReactNode;
}

interface ResponsiveColProps extends ColProps {
  children: React.ReactNode;
  mobileSpan?: number;
  tabletSpan?: number;
  desktopSpan?: number;
}

export function ResponsiveRow({ children, ...props }: ResponsiveGridProps) {
  return (
    <Row 
      gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}
      {...props}
    >
      {children}
    </Row>
  );
}

export function ResponsiveCol({ 
  children, 
  mobileSpan = 24, 
  tabletSpan, 
  desktopSpan,
  ...props 
}: ResponsiveColProps) {
  // Responsive breakpoint handling via CSS classes instead of state

  const responsiveProps = {
    xs: mobileSpan,
    sm: tabletSpan || Math.ceil(mobileSpan / 2),
    md: tabletSpan || Math.ceil(mobileSpan / 2),
    lg: desktopSpan || tabletSpan || Math.ceil(mobileSpan / 3),
    xl: desktopSpan || tabletSpan || Math.ceil(mobileSpan / 3),
    ...props,
  };

  return (
    <Col {...responsiveProps} className="responsive-col">
      {children}
    </Col>
  );
}