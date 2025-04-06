/**
 * 工具自动注册
 * 
 * 该类负责通过配置进行工具注册
 */
import { Tool, ToolCategory } from './types';
import { registerTool } from './register-tools';
import { ToolConfig, getAllToolConfigs } from './tools-config';

// 扫描结果接口
interface ScanResult {
  success: boolean;
  registeredCount: number;
  failedTools: Array<{
    id: string;
    error: string;
  }>;
  error?: string;
}

/**
 * 工具自动注册类
 */
export class ToolAutoRegistrar {
  private registeredCount = 0;
  private failedTools: Array<{ id: string; error: string }> = [];

  /**
   * 注册所有工具
   */
  public async scanAndRegisterTools(): Promise<ScanResult> {
    this.registeredCount = 0;
    this.failedTools = [];

    try {
      console.log('开始注册工具...');
      
      // 获取所有工具配置
      const toolConfigs = getAllToolConfigs();
      
      // 导入并注册每个工具
      for (const config of toolConfigs) {
        await this.registerToolFromConfig(config);
      }
      
      console.log('工具加载完成！');
      console.log(`成功注册: ${this.registeredCount} 个工具`);
      
      if (this.failedTools.length > 0) {
        console.warn(`失败: ${this.failedTools.length} 个工具无法注册`);
        this.failedTools.forEach(tool => {
          console.warn(`- ${tool.id}: ${tool.error}`);
        });
      }
      
      return {
        success: true,
        registeredCount: this.registeredCount,
        failedTools: this.failedTools
      };
    } catch (error) {
      console.error('工具加载过程中发生错误:', error);
      return {
        success: false,
        registeredCount: this.registeredCount,
        failedTools: this.failedTools,
        error: error.message
      };
    }
  }

  /**
   * 根据配置注册工具
   */
  private async registerToolFromConfig(config: ToolConfig): Promise<void> {
    try {
      console.log(`正在导入工具: ${config.id}`);
      
      // 动态导入工具模块
      const module = await config.importPath();
      
      if (!module.default) {
        this.addFailedTool(config.id, '工具模块未提供默认导出');
        return;
      }
      
      const tool = module.default;
      
      // 注册工具
      this.registerSingleTool(tool, config.category);
    } catch (error) {
      this.addFailedTool(config.id, `导入失败: ${error.message}`);
    }
  }

  /**
   * 注册单个工具
   */
  private registerSingleTool(tool: any, defaultCategory: ToolCategory): void {
    try {
      // 验证工具
      this.validateTool(tool);
      
      // 确保工具具有正确的类别
      if (!tool.category) {
        tool.category = defaultCategory;
      }
      
      // 注册工具
      registerTool(tool);
      this.registeredCount++;
      console.log(`✅ 成功注册工具: ${tool.name} (${tool.id})`);
    } catch (error) {
      this.addFailedTool(tool.id || '未知工具', `注册失败: ${error.message}`);
    }
  }
  
  /**
   * 添加失败工具记录
   */
  private addFailedTool(id: string, error: string): void {
    this.failedTools.push({ id, error });
    console.error(`❌ 工具注册失败: ${id} - ${error}`);
  }

  /**
   * 验证工具是否符合Tool接口要求
   */
  private validateTool(tool: any): void {
    // 检查必需字段
    const requiredFields = ['id', 'name', 'description', 'component', 'icon'];
    
    for (const field of requiredFields) {
      if (!tool[field]) {
        throw new Error(`缺少 ${field} 字段`);
      }
    }
  }
} 
