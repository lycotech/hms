'use client';

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { TableProps } from 'antd';

interface ResponsiveTableProps<T = Record<string, unknown>> extends TableProps<T> {
  mobileCardRender?: (record: T, index: number) => React.ReactNode;
  mobileBreakpoint?: number;
}

export default function ResponsiveTable<T = Record<string, unknown>>({
  mobileCardRender,
  mobileBreakpoint = 768,
  ...tableProps
}: ResponsiveTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  // If mobile and custom card render is provided, show cards instead of table
  if (isMobile && mobileCardRender && tableProps.dataSource) {
    return (
      <div className="responsive-mobile-cards">
        {(tableProps.dataSource as T[]).map((record, index) => (
          <Card 
            key={index} 
            size="small" 
            style={{ marginBottom: 12 }}
            className="responsive-card"
          >
            {mobileCardRender(record, index)}
          </Card>
        ))}
      </div>
    );
  }

  // Enhanced table props for mobile
  const responsiveTableProps = {
    ...tableProps,
    scroll: { 
      x: isMobile ? 'max-content' : undefined,
      ...(tableProps.scroll || {})
    },
    size: isMobile ? 'small' as const : tableProps.size,
    pagination: isMobile ? {
      ...tableProps.pagination,
      showSizeChanger: false,
      showQuickJumper: false,
      showTotal: undefined,
      ...(typeof tableProps.pagination === 'object' ? tableProps.pagination : {})
    } : tableProps.pagination,
    className: `responsive-table ${tableProps.className || ''}`,
  };

  return (
    <div className="responsive-table-wrapper">
      <Table {...responsiveTableProps} />
    </div>
  );
}