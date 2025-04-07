# DevtoolsBox 全局模态框系统

此文件夹包含全局模态框系统的所有组件，该系统提供了统一的方式来管理和显示登录、注册、忘记密码和搜索等模态框。

## 组件结构

- `BaseModal.tsx`: 基础模态框组件，所有其他模态框继承自它
- `LoginModal.tsx`: 用户登录模态框
- `RegisterModal.tsx`: 用户注册模态框
- `ForgotPasswordModal.tsx`: 忘记密码模态框
- `SearchModal.tsx`: 搜索工具模态框
- `ModalManager.tsx`: 管理所有模态框，确保它们可以被全局使用

## 使用方法

1. 在需要的组件中引入和使用 `useModalContext`：

```tsx
import { useModalContext } from '../../contexts/ModalContext';

function YourComponent() {
  const { openModal } = useModalContext();
  
  return (
    <button onClick={() => openModal('login')}>
      登录
    </button>
  );
}
```

2. 可用的模态框类型：

- `login`: 用户登录
- `register`: 用户注册
- `forgotPassword`: 忘记密码
- `search`: 搜索工具

详细的使用文档请参考 `app/README.md`。 
