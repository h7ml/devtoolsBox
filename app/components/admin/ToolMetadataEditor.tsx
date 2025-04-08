import { useState } from 'react';
import { Tool, ToolMeta } from '../../lib/tools-registry/types';
import { 
  Input, 
  Textarea, 
  Button, 
  FormControl, 
  FormLabel, 
  Select,
  Tag, 
  HStack, 
  IconButton,
  VStack,
  Box
} from '@chakra-ui/react';
import { FiPlus, FiX } from 'react-icons/fi';

interface ToolMetadataEditorProps {
  tool: Tool;
  onSave: (updatedMeta: ToolMeta) => void;
}

export default function ToolMetadataEditor({ tool, onSave }: ToolMetadataEditorProps) {
  const [meta, setMeta] = useState<ToolMeta>(tool.meta || {
    keywords: [],
    examples: [],
  });
  
  const [keyword, setKeyword] = useState('');
  const [useCase, setUseCase] = useState('');
  const [advantage, setAdvantage] = useState('');
  const [relatedTerm, setRelatedTerm] = useState('');
  
  const handleChange = (field: keyof ToolMeta, value: any) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };
  
  const addKeyword = () => {
    if (keyword.trim() && !meta.keywords.includes(keyword.trim())) {
      setMeta(prev => ({ 
        ...prev, 
        keywords: [...(prev.keywords || []), keyword.trim()] 
      }));
      setKeyword('');
    }
  };
  
  const removeKeyword = (index: number) => {
    setMeta(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };
  
  const addUseCase = () => {
    if (useCase.trim() && (!meta.useCases || !meta.useCases.includes(useCase.trim()))) {
      setMeta(prev => ({ 
        ...prev, 
        useCases: [...(prev.useCases || []), useCase.trim()] 
      }));
      setUseCase('');
    }
  };
  
  const removeUseCase = (index: number) => {
    setMeta(prev => ({
      ...prev,
      useCases: (prev.useCases || []).filter((_, i) => i !== index)
    }));
  };
  
  const addAdvantage = () => {
    if (advantage.trim() && (!meta.advantages || !meta.advantages.includes(advantage.trim()))) {
      setMeta(prev => ({ 
        ...prev, 
        advantages: [...(prev.advantages || []), advantage.trim()] 
      }));
      setAdvantage('');
    }
  };
  
  const removeAdvantage = (index: number) => {
    setMeta(prev => ({
      ...prev,
      advantages: (prev.advantages || []).filter((_, i) => i !== index)
    }));
  };
  
  const addRelatedTerm = () => {
    if (relatedTerm.trim() && (!meta.relatedTerms || !meta.relatedTerms.includes(relatedTerm.trim()))) {
      setMeta(prev => ({ 
        ...prev, 
        relatedTerms: [...(prev.relatedTerms || []), relatedTerm.trim()] 
      }));
      setRelatedTerm('');
    }
  };
  
  const removeRelatedTerm = (index: number) => {
    setMeta(prev => ({
      ...prev,
      relatedTerms: (prev.relatedTerms || []).filter((_, i) => i !== index)
    }));
  };
  
  return (
    <VStack spacing={6} align="stretch" w="full" p={4}>
      <Box>
        <FormControl id="author" mb={4}>
          <FormLabel>作者</FormLabel>
          <Input 
            value={meta.author || ''} 
            onChange={(e) => handleChange('author', e.target.value)}
            placeholder="工具作者或团队名称"
          />
        </FormControl>
        
        <FormControl id="version" mb={4}>
          <FormLabel>版本</FormLabel>
          <Input 
            value={meta.version || ''} 
            onChange={(e) => handleChange('version', e.target.value)}
            placeholder="1.0.0"
          />
        </FormControl>
        
        <FormControl id="lastUpdated" mb={4}>
          <FormLabel>最后更新日期</FormLabel>
          <Input 
            type="date"
            value={meta.lastUpdated || new Date().toISOString().split('T')[0]} 
            onChange={(e) => handleChange('lastUpdated', e.target.value)}
          />
        </FormControl>
      </Box>
      
      <FormControl id="longDescription" mb={4}>
        <FormLabel>详细描述 (支持Markdown)</FormLabel>
        <Textarea
          value={meta.longDescription || ''}
          onChange={(e) => handleChange('longDescription', e.target.value)}
          placeholder="详细描述工具的功能、特点和使用方法..."
          minH="150px"
        />
      </FormControl>
      
      <FormControl id="documentation" mb={4}>
        <FormLabel>文档链接</FormLabel>
        <Input 
          value={meta.documentation || ''} 
          onChange={(e) => handleChange('documentation', e.target.value)}
          placeholder="https://example.com/docs"
        />
      </FormControl>
      
      <FormControl id="difficulty" mb={4}>
        <FormLabel>使用难度</FormLabel>
        <Select
          value={meta.difficulty || 'beginner'}
          onChange={(e) => handleChange('difficulty', e.target.value)}
        >
          <option value="beginner">初级 - 适合所有用户</option>
          <option value="intermediate">中级 - 需要一些专业知识</option>
          <option value="advanced">高级 - 适合专业用户</option>
        </Select>
      </FormControl>
      
      <FormControl id="popularity" mb={4}>
        <FormLabel>工具热度 (1-10)</FormLabel>
        <Input 
          type="number"
          min={1}
          max={10}
          value={meta.popularity || 5} 
          onChange={(e) => handleChange('popularity', parseInt(e.target.value))}
        />
      </FormControl>
      
      <FormControl id="keywords" mb={4}>
        <FormLabel>关键词</FormLabel>
        <HStack>
          <Input 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="添加关键词..."
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <IconButton
            aria-label="添加关键词"
            icon={<FiPlus />}
            onClick={addKeyword}
          />
        </HStack>
        <HStack mt={2} flexWrap="wrap">
          {(meta.keywords || []).map((kw, index) => (
            <Tag key={index} size="md" borderRadius="full" m={1}>
              {kw}
              <IconButton
                aria-label="删除关键词"
                icon={<FiX />}
                size="xs"
                ml={1}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeKeyword(index)}
              />
            </Tag>
          ))}
        </HStack>
      </FormControl>
      
      <FormControl id="useCases" mb={4}>
        <FormLabel>使用场景</FormLabel>
        <HStack>
          <Input 
            value={useCase} 
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="添加使用场景..."
            onKeyPress={(e) => e.key === 'Enter' && addUseCase()}
          />
          <IconButton
            aria-label="添加使用场景"
            icon={<FiPlus />}
            onClick={addUseCase}
          />
        </HStack>
        <HStack mt={2} flexWrap="wrap">
          {(meta.useCases || []).map((uc, index) => (
            <Tag key={index} size="md" borderRadius="full" m={1} colorScheme="blue">
              {uc}
              <IconButton
                aria-label="删除使用场景"
                icon={<FiX />}
                size="xs"
                ml={1}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeUseCase(index)}
              />
            </Tag>
          ))}
        </HStack>
      </FormControl>
      
      <FormControl id="advantages" mb={4}>
        <FormLabel>优势特点</FormLabel>
        <HStack>
          <Input 
            value={advantage} 
            onChange={(e) => setAdvantage(e.target.value)}
            placeholder="添加优势特点..."
            onKeyPress={(e) => e.key === 'Enter' && addAdvantage()}
          />
          <IconButton
            aria-label="添加优势"
            icon={<FiPlus />}
            onClick={addAdvantage}
          />
        </HStack>
        <HStack mt={2} flexWrap="wrap">
          {(meta.advantages || []).map((adv, index) => (
            <Tag key={index} size="md" borderRadius="full" m={1} colorScheme="green">
              {adv}
              <IconButton
                aria-label="删除优势"
                icon={<FiX />}
                size="xs"
                ml={1}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeAdvantage(index)}
              />
            </Tag>
          ))}
        </HStack>
      </FormControl>
      
      <FormControl id="relatedTerms" mb={4}>
        <FormLabel>相关术语 (用于长尾关键词)</FormLabel>
        <HStack>
          <Input 
            value={relatedTerm} 
            onChange={(e) => setRelatedTerm(e.target.value)}
            placeholder="添加相关术语..."
            onKeyPress={(e) => e.key === 'Enter' && addRelatedTerm()}
          />
          <IconButton
            aria-label="添加术语"
            icon={<FiPlus />}
            onClick={addRelatedTerm}
          />
        </HStack>
        <HStack mt={2} flexWrap="wrap">
          {(meta.relatedTerms || []).map((term, index) => (
            <Tag key={index} size="md" borderRadius="full" m={1} colorScheme="purple">
              {term}
              <IconButton
                aria-label="删除术语"
                icon={<FiX />}
                size="xs"
                ml={1}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeRelatedTerm(index)}
              />
            </Tag>
          ))}
        </HStack>
      </FormControl>
      
      <Button 
        colorScheme="blue" 
        onClick={() => onSave(meta)}
        size="lg"
      >
        保存元数据
      </Button>
    </VStack>
  );
} 