import React from 'react';

interface StructuredDataProps {
  data: any;
}

/**
 * 结构化数据组件
 * 将JSON-LD结构化数据嵌入页面
 * @param data 结构化数据对象
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 多个结构化数据组件
 * 将多个JSON-LD结构化数据嵌入页面
 * @param data 结构化数据对象数组
 */
export function MultipleStructuredData({ data }: { data: any[] }) {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
} 
