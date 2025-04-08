'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Code,
  Button,
  Image,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Divider,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps
} from '@chakra-ui/react';
import { FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

export interface TutorialStep {
  title: string;
  description: string;
  codeExample?: string;
  imageUrl?: string;
  tips?: string[];
}

export interface ToolTutorialProps {
  toolName: string;
  toolDescription: string;
  steps: TutorialStep[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  tips?: string[];
  examples?: Array<{
    title: string;
    description: string;
    codeExample?: string;
  }>;
}

/**
 * 工具教程组件
 * 用于展示工具的使用教程、常见问题和使用技巧
 */
const ToolTutorial: React.FC<ToolTutorialProps> = ({
  toolName,
  toolDescription,
  steps,
  faqs = [],
  tips = [],
  examples = []
}) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const codeBgColor = useColorModeValue('gray.50', 'gray.700');

  const toggleExample = (index: number) => {
    setExpandedExample(expandedExample === index ? null : index);
  };

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Box p={6} borderBottomWidth="1px" borderColor={borderColor}>
        <Heading as="h2" size="lg" mb={2}>
          {toolName}
        </Heading>
        <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
          {toolDescription}
        </Text>
      </Box>

      {/* 教程步骤 */}
      <Box p={6}>
        <Heading as="h3" size="md" mb={4}>
          使用教程
        </Heading>

        <Stepper index={activeStep} orientation="vertical" gap="0" mb={6}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber>{index + 1}</StepNumber>}
                  active={<StepNumber>{index + 1}</StepNumber>}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle
                  cursor="pointer"
                  onClick={() => setActiveStep(index)}
                  fontWeight={activeStep === index ? "bold" : "normal"}
                >
                  {step.title}
                </StepTitle>

                {activeStep === index && (
                  <VStack align="start" spacing={4} mt={2} mb={6} pl={2}>
                    <StepDescription>
                      <Text>{step.description}</Text>
                    </StepDescription>

                    {step.imageUrl && (
                      <Box borderRadius="md" overflow="hidden" w="100%">
                        <Image
                          src={step.imageUrl}
                          alt={`${step.title} illustration`}
                          objectFit="cover"
                        />
                      </Box>
                    )}

                    {step.codeExample && (
                      <Box
                        as="pre"
                        p={3}
                        borderRadius="md"
                        bg={codeBgColor}
                        w="100%"
                        overflowX="auto"
                      >
                        <Code>{step.codeExample}</Code>
                      </Box>
                    )}

                    {step.tips && step.tips.length > 0 && (
                      <Box w="100%">
                        <Text fontWeight="bold" mb={2}>提示：</Text>
                        <List spacing={2}>
                          {step.tips.map((tip, tipIndex) => (
                            <ListItem key={tipIndex} display="flex">
                              <ListIcon as={FiInfo} color={accentColor} mt={1} />
                              <Text>{tip}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </VStack>
                )}
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <HStack spacing={4} mt={4} justify="center">
          <Button
            size="sm"
            onClick={() => setActiveStep(activeStep - 1)}
            isDisabled={activeStep === 0}
          >
            上一步
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => setActiveStep(activeStep + 1)}
            isDisabled={activeStep === steps.length - 1}
          >
            下一步
          </Button>
        </HStack>
      </Box>

      {/* 使用示例 */}
      {examples.length > 0 && (
        <Box p={6} borderTopWidth="1px" borderColor={borderColor}>
          <Heading as="h3" size="md" mb={4}>
            使用示例
          </Heading>

          <VStack spacing={3} align="stretch">
            {examples.map((example, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                overflow="hidden"
              >
                <HStack
                  p={3}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  cursor="pointer"
                  onClick={() => toggleExample(index)}
                  justify="space-between"
                >
                  <Text fontWeight="medium">{example.title}</Text>
                  <AccordionIcon />
                </HStack>

                {expandedExample === index && (
                  <Box p={4}>
                    <Text mb={3}>{example.description}</Text>

                    {example.codeExample && (
                      <Box
                        as="pre"
                        p={3}
                        borderRadius="md"
                        bg={codeBgColor}
                        overflowX="auto"
                      >
                        <Code>{example.codeExample}</Code>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* 通用使用技巧 */}
      {tips.length > 0 && (
        <Box p={6} borderTopWidth="1px" borderColor={borderColor}>
          <Heading as="h3" size="md" mb={4}>
            使用技巧
          </Heading>

          <List spacing={3}>
            {tips.map((tip, index) => (
              <ListItem key={index} display="flex">
                <ListIcon as={FiCheckCircle} color={accentColor} mt={1} />
                <Text>{tip}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* FAQ部分 */}
      {faqs.length > 0 && (
        <Box p={6} borderTopWidth="1px" borderColor={borderColor}>
          <Heading as="h3" size="md" mb={4}>
            常见问题
          </Heading>

          <Accordion allowMultiple>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} border="none">
                <h2>
                  <AccordionButton py={3} px={0}>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      <HStack>
                        <FiAlertTriangle size="1em" />
                        <Text>{faq.question}</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pl={6}>
                  <Text>{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default ToolTutorial; 
