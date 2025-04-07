'use client';

import React, { useState } from 'react';
import { FiDatabase, FiCopy, FiPlay, FiCheck, FiXCircle, FiRotateCw } from 'react-icons/fi';
import { Card, CardHeader, CardContent } from '../../../components/design-system/Card';
import Button from '../../../components/design-system/Button';
import { toast } from 'sonner';

// 示例JSON数据
const EXAMPLE_JSON = JSON.stringify([
  {
    id: 1,
    name: "张三",
    age: 28,
    email: "zhangsan@example.com",
    is_active: true,
    created_at: "2023-01-10T14:30:00Z"
  },
  {
    id: 2,
    name: "李四",
    age: 35,
    email: "lisi@example.com",
    is_active: false,
    created_at: "2023-02-15T09:45:00Z"
  }
], null, 2);

// SQL 方言类型
type SqlDialect = 'mysql' | 'postgresql' | 'sqlite' | 'mssql' | 'oracle';

// SQL 操作类型
type SqlOperation = 'insert' | 'create' | 'both';

/**
 * 根据值确定SQL数据类型
 */
const getSqlType = (value: any, dialect: SqlDialect): string => {
  if (value === null || value === undefined) return 'NULL';

  const type = typeof value;

  if (type === 'number') {
    if (Number.isInteger(value)) {
      switch (dialect) {
        case 'mysql':
        case 'sqlite': return 'INT';
        case 'postgresql': return 'INTEGER';
        case 'mssql': return 'INT';
        case 'oracle': return 'NUMBER';
      }
    } else {
      switch (dialect) {
        case 'mysql': return 'FLOAT';
        case 'postgresql': return 'NUMERIC';
        case 'sqlite': return 'REAL';
        case 'mssql': return 'FLOAT';
        case 'oracle': return 'NUMBER';
      }
    }
  }

  if (type === 'boolean') {
    switch (dialect) {
      case 'mysql': return 'TINYINT(1)';
      case 'postgresql': return 'BOOLEAN';
      case 'sqlite': return 'BOOLEAN';
      case 'mssql': return 'BIT';
      case 'oracle': return 'NUMBER(1)';
    }
  }

  if (type === 'string') {
    // 判断是否为日期
    if (/^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}:\d{2}/.test(value)) {
      switch (dialect) {
        case 'mysql': return 'DATETIME';
        case 'postgresql': return 'TIMESTAMP';
        case 'sqlite': return 'DATETIME';
        case 'mssql': return 'DATETIME';
        case 'oracle': return 'TIMESTAMP';
      }
    }

    // 根据字符串长度判断
    const length = value.length;
    if (length > 255) {
      switch (dialect) {
        case 'mysql': return 'TEXT';
        case 'postgresql': return 'TEXT';
        case 'sqlite': return 'TEXT';
        case 'mssql': return 'NVARCHAR(MAX)';
        case 'oracle': return 'CLOB';
      }
    } else {
      switch (dialect) {
        case 'mysql': return `VARCHAR(${Math.max(length, 50)})`;
        case 'postgresql': return `VARCHAR(${Math.max(length, 50)})`;
        case 'sqlite': return 'TEXT';
        case 'mssql': return `NVARCHAR(${Math.max(length, 50)})`;
        case 'oracle': return `VARCHAR2(${Math.max(length, 50)})`;
      }
    }
  }

  if (Array.isArray(value)) {
    switch (dialect) {
      case 'postgresql': return 'JSONB';
      case 'mysql': return 'JSON';
      default: return 'TEXT'; // 其他数据库可能需要将数组转为字符串存储
    }
  }

  if (type === 'object') {
    switch (dialect) {
      case 'postgresql': return 'JSONB';
      case 'mysql': return 'JSON';
      default: return 'TEXT'; // 对象需要序列化为JSON字符串
    }
  }

  return 'TEXT'; // 默认返回TEXT类型
};

/**
 * 清理列名（移除非法字符）
 */
const sanitizeColumnName = (name: string, dialect: SqlDialect): string => {
  // 移除特殊字符，只保留字母、数字和下划线
  let sanitized = name.replace(/[^\w]/g, '_');

  // 确保列名不以数字开头
  if (/^\d/.test(sanitized)) {
    sanitized = 'col_' + sanitized;
  }

  return dialect === 'mssql' || dialect === 'oracle'
    ? `"${sanitized}"`
    : (dialect === 'mysql' ? `\`${sanitized}\`` : `"${sanitized}"`);
};

/**
 * 转义SQL值
 */
const escapeSqlValue = (value: any, dialect: SqlDialect): string => {
  if (value === null || value === undefined) return 'NULL';

  const type = typeof value;

  if (type === 'number') return value.toString();
  if (type === 'boolean') {
    switch (dialect) {
      case 'mysql': return value ? '1' : '0';
      case 'postgresql': return value ? 'TRUE' : 'FALSE';
      case 'sqlite': return value ? '1' : '0';
      case 'mssql': return value ? '1' : '0';
      case 'oracle': return value ? '1' : '0';
    }
  }

  if (type === 'string') {
    // 转义单引号
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  if (Array.isArray(value) || type === 'object') {
    const json = JSON.stringify(value).replace(/'/g, "''");
    return `'${json}'`;
  }

  return `'${value}'`;
};

interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  primary?: boolean;
}

interface TableSchema {
  name: string;
  columns: SchemaColumn[];
  data: any[];
}

const JsonToSqlComponent: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(EXAMPLE_JSON);
  const [outputSql, setOutputSql] = useState<string>('');
  const [tableName, setTableName] = useState<string>('users');
  const [sqlDialect, setSqlDialect] = useState<SqlDialect>('mysql');
  const [operation, setOperation] = useState<SqlOperation>('both');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  /**
   * 尝试格式化JSON
   */
  const formatJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(`JSON 格式错误: ${e.message}`);
    }
  };

  /**
   * 将JSON转换为SQL
   */
  const convertToSql = () => {
    try {
      // 解析JSON
      let jsonData = JSON.parse(inputJson);

      // 确保是数组
      if (!Array.isArray(jsonData)) {
        if (typeof jsonData === 'object' && jsonData !== null) {
          jsonData = [jsonData]; // 如果是单个对象，转为数组
        } else {
          throw new Error('输入必须是JSON对象或数组');
        }
      }

      // 分析第一条记录的结构
      if (jsonData.length === 0) {
        throw new Error('JSON 数组为空，无法确定表结构');
      }

      // 分析表结构
      const schema = analyzeSchema(jsonData, tableName, sqlDialect);

      // 生成SQL
      let sql = '';

      if (operation === 'create' || operation === 'both') {
        sql += generateCreateTable(schema, sqlDialect);
      }

      if (operation === 'insert' || operation === 'both') {
        if (operation === 'both') sql += '\n\n';
        sql += generateInserts(schema, sqlDialect);
      }

      setOutputSql(sql);
      setError(null);
    } catch (e) {
      setError(`转换错误: ${e.message}`);
      setOutputSql('');
    }
  };

  /**
   * 分析数据结构并创建表模式
   */
  const analyzeSchema = (data: any[], name: string, dialect: SqlDialect): TableSchema => {
    // 合并所有记录的字段
    const fields = new Set<string>();
    data.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => fields.add(key));
      }
    });

    // 如果没有字段，抛出错误
    if (fields.size === 0) {
      throw new Error('无法检测到有效的字段');
    }

    // 确定每个字段的数据类型
    const columns: SchemaColumn[] = [];

    fields.forEach(field => {
      // 查找第一个包含此字段的非空值
      let value = null;
      let nullable = true;

      for (const item of data) {
        if (item[field] !== undefined && item[field] !== null) {
          value = item[field];
          nullable = false;
          break;
        }
      }

      // 添加列定义
      columns.push({
        name: field,
        type: getSqlType(value, dialect),
        nullable,
        primary: field.toLowerCase() === 'id' // 将id字段标记为主键
      });
    });

    return {
      name,
      columns,
      data
    };
  };

  /**
   * 生成创建表的SQL语句
   */
  const generateCreateTable = (schema: TableSchema, dialect: SqlDialect): string => {
    const tableName = sanitizeColumnName(schema.name, dialect);
    let sql = '';

    // 表开始
    switch (dialect) {
      case 'mysql':
        sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        break;
      case 'postgresql':
        sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        break;
      case 'sqlite':
        sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        break;
      case 'mssql':
        sql = `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'${schema.name}') AND type in (N'U'))\nBEGIN\nCREATE TABLE ${tableName} (\n`;
        break;
      case 'oracle':
        sql = `BEGIN\n  EXECUTE IMMEDIATE 'CREATE TABLE ${tableName} (\n`;
        break;
    }

    // 列定义
    schema.columns.forEach((column, index) => {
      const columnName = sanitizeColumnName(column.name, dialect);
      let columnDef = `  ${columnName} ${column.type}`;

      // 添加NOT NULL约束
      if (!column.nullable) {
        columnDef += ' NOT NULL';
      }

      // 添加主键约束（只对ID字段）
      if (column.primary) {
        switch (dialect) {
          case 'mysql':
          case 'postgresql':
          case 'sqlite':
            columnDef += ' PRIMARY KEY';
            break;
          case 'mssql':
            columnDef += ' PRIMARY KEY';
            break;
          case 'oracle':
            columnDef += ' PRIMARY KEY';
            break;
        }
      }

      sql += columnDef;

      // 添加分隔符
      if (index < schema.columns.length - 1) {
        sql += ',\n';
      } else {
        sql += '\n';
      }
    });

    // 表结束
    switch (dialect) {
      case 'mysql':
        sql += ');\n';
        break;
      case 'postgresql':
        sql += ');\n';
        break;
      case 'sqlite':
        sql += ');\n';
        break;
      case 'mssql':
        sql += ');\nEND;\n';
        break;
      case 'oracle':
        sql += `)';\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE != -955 THEN\n      RAISE;\n    END IF;\nEND;\n/\n`;
        break;
    }

    return sql;
  };

  /**
   * 生成插入数据的SQL语句
   */
  const generateInserts = (schema: TableSchema, dialect: SqlDialect): string => {
    if (schema.data.length === 0) return '';

    const tableName = sanitizeColumnName(schema.name, dialect);
    let sql = '';

    // 批量插入或单独插入，根据不同数据库方言
    if (dialect === 'mysql' || dialect === 'postgresql') {
      // 列名列表
      const columnNames = schema.columns.map(col => sanitizeColumnName(col.name, dialect)).join(', ');

      sql += `INSERT INTO ${tableName} (${columnNames}) VALUES\n`;

      // 生成值列表
      schema.data.forEach((row, rowIndex) => {
        const values = schema.columns.map(col => {
          return escapeSqlValue(row[col.name] !== undefined ? row[col.name] : null, dialect);
        }).join(', ');

        sql += `  (${values})${rowIndex < schema.data.length - 1 ? ',' : ';'}\n`;
      });
    } else {
      // 其他数据库使用单独的INSERT语句
      schema.data.forEach(row => {
        const columnNames = schema.columns
          .filter(col => row[col.name] !== undefined)
          .map(col => sanitizeColumnName(col.name, dialect));

        const values = schema.columns
          .filter(col => row[col.name] !== undefined)
          .map(col => escapeSqlValue(row[col.name], dialect));

        sql += `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${values.join(', ')});\n`;
      });
    }

    return sql;
  };

  /**
   * 复制SQL到剪贴板
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputSql);
    setCopySuccess(true);
    toast.success('SQL已复制到剪贴板');

    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader
        icon={<FiDatabase className="h-6 w-6" />}
        title="JSON转SQL"
        description="将JSON数据转换为SQL建表和插入语句"
        gradientColors="from-blue-500 to-indigo-600"
      />
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：JSON输入 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                输入JSON
              </label>
              <textarea
                id="json-input"
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="粘贴JSON数据..."
              />
            </div>

            {error && (
              <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                <FiXCircle className="inline-block mr-1" /> {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<FiRotateCw className="h-4 w-4" />}
                onClick={formatJson}
              >
                格式化JSON
              </Button>

              <Button
                variant="default"
                size="sm"
                icon={<FiPlay className="h-4 w-4" />}
                onClick={convertToSql}
              >
                生成SQL
              </Button>
            </div>
          </div>

          {/* 右侧：SQL输出和配置 */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="table-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  表名
                </label>
                <input
                  id="table-name"
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="表名..."
                />
              </div>

              <div>
                <label htmlFor="sql-dialect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SQL方言
                </label>
                <select
                  id="sql-dialect"
                  value={sqlDialect}
                  onChange={(e) => setSqlDialect(e.target.value as SqlDialect)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mssql">SQL Server</option>
                  <option value="oracle">Oracle</option>
                </select>
              </div>

              <div>
                <label htmlFor="operation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  操作
                </label>
                <select
                  id="operation"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as SqlOperation)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="both">CREATE + INSERT</option>
                  <option value="create">只CREATE TABLE</option>
                  <option value="insert">只INSERT数据</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="sql-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  生成的SQL
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={copySuccess ? <FiCheck className="h-4 w-4 text-green-500" /> : <FiCopy className="h-4 w-4" />}
                  onClick={copyToClipboard}
                  disabled={!outputSql}
                >
                  {copySuccess ? '已复制' : '复制'}
                </Button>
              </div>
              <textarea
                id="sql-output"
                readOnly
                value={outputSql}
                className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         font-mono text-sm"
                placeholder="SQL将在这里显示..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 工具元数据
const jsonToSql = {
  id: 'json-to-sql',
  name: 'JSON转SQL',
  description: '将JSON数据转换为SQL建表和插入语句',
  category: 'json',
  icon: FiDatabase,
  component: JsonToSqlComponent,
  meta: {
    keywords: ['json', 'sql', '转换', '建表', '插入', 'mysql', 'postgresql', 'sqlite'],
    author: 'DevTools Box',
    version: '1.0.0'
  }
};

export default jsonToSql;
