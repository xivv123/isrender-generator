/**
 * jsx-parser.js
 * 一个简化版的JSX解析器，用于将类似JSX的模板字符串转换为Vue渲染函数调用
 */

/**
 * 处理JSX字符串的函数 - 将类似JSX的模板字符串转换为Vue渲染函数调用
 * @param {Function} h Vue渲染函数
 * @param {String} jsxString JSX风格的模板字符串
 * @returns {VNode} 渲染节点
 */
export function parseJSXString(h, jsxString) {
  // 这个函数会接收一个模板字符串，解析并转换为h函数调用
  try {
    // 预处理 - 移除所有注释和额外的空白
    const cleanedJSX = jsxString
      .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML注释
      .trim();                         // 修剪前后的空白
      
    // 编译JSX为可执行的JavaScript代码
    const compiledCode = compileJSX(cleanedJSX);
    console.log('编译后的代码:', compiledCode);
    
    // 创建函数并执行
    const func = new Function('h', `return ${compiledCode};`);
    return func(h);
  } catch (error) {
    console.error('解析JSX字符串时出错:', error, jsxString);
    return h('div', {
      style: {
        color: 'red',
        padding: '10px',
        border: '1px solid red',
        backgroundColor: '#fff5f5'
      }
    }, [
      h('div', {}, [`解析JSX出错: ${error.message}`]),
      h('pre', { style: { whiteSpace: 'pre-wrap', fontSize: '12px' } }, [jsxString])
    ]);
  }
}

/**
 * 将JSX编译成JavaScript渲染函数代码
 * 使用基于栈的方法处理嵌套标签
 */
function compileJSX(jsx) {
  // tokenize JSX字符串
  const tokens = tokenizeJSX(jsx);
  
  // 构建渲染函数代码
  return buildRenderCode(tokens);
}

/**
 * 将JSX切分成标记(tokens)
 */
function tokenizeJSX(jsx) {
  const tokens = [];
  let currentPos = 0;
  
  while (currentPos < jsx.length) {
    const remaining = jsx.slice(currentPos);
    
    // 处理开始标签，如 <tag attr="value">
    const startTagMatch = remaining.match(/^\s*<([\w-]+)([^>]*)>/);
    if (startTagMatch) {
      const [fullMatch, tagName, attrString] = startTagMatch;
      tokens.push({
        type: 'openTag',
        tag: tagName,
        attrs: parseAttributes(attrString)
      });
      currentPos += fullMatch.length;
      continue;
    }
    
    // 处理自闭合标签，如 <tag attr="value" />
    const selfClosingMatch = remaining.match(/^\s*<([\w-]+)([^>]*?)\/>/);
    if (selfClosingMatch) {
      const [fullMatch, tagName, attrString] = selfClosingMatch;
      tokens.push({
        type: 'selfClosingTag',
        tag: tagName,
        attrs: parseAttributes(attrString)
      });
      currentPos += fullMatch.length;
      continue;
    }
    
    // 处理结束标签，如 </tag>
    const endTagMatch = remaining.match(/^\s*<\/([\w-]+)\s*>/);
    if (endTagMatch) {
      const [fullMatch, tagName] = endTagMatch;
      tokens.push({
        type: 'closeTag',
        tag: tagName
      });
      currentPos += fullMatch.length;
      continue;
    }
    
    // 处理文本内容
    const textMatch = remaining.match(/^\s*([^<]+)/);
    if (textMatch) {
      const [fullMatch, text] = textMatch;
      const trimmedText = text.trim();
      if (trimmedText) {
        tokens.push({
          type: 'text',
          content: trimmedText
        });
      }
      currentPos += fullMatch.length;
      continue;
    }
    
    // 如果没有匹配任何模式，向前移动一步避免无限循环
    currentPos++;
  }
  
  return tokens;
}

/**
 * 基于标记(tokens)构建渲染函数代码
 */
function buildRenderCode(tokens) {
  const stack = [];
  const output = [];
  let currentChildren = [];
  
  tokens.forEach((token, index) => {
    if (token.type === 'openTag') {
      // 保存当前级别的子元素
      stack.push({
        tag: token.tag,
        attrs: token.attrs,
        children: currentChildren
      });
      // 创建新的子元素数组
      currentChildren = [];
    } 
    else if (token.type === 'selfClosingTag') {
      // 自闭合标签，直接添加到当前子元素
      currentChildren.push(`h('${token.tag}', { props: {${token.attrs}} }, [])`);
    } 
    else if (token.type === 'closeTag') {
      // 找到匹配的开始标签
      const openTag = stack.pop();
      
      if (!openTag || openTag.tag !== token.tag) {
        throw new Error(`标签不匹配: 开始标签 <${openTag ? openTag.tag : '???'}> 和结束标签 </${token.tag}>`);
      }
      
      // 创建此标签的渲染函数
      const children = currentChildren.length ? `[${currentChildren.join(', ')}]` : '[]';
      const element = `h('${openTag.tag}', { props: {${openTag.attrs}} }, ${children})`;
      
      // 恢复父级的子元素数组
      currentChildren = openTag.children;
      
      // 将此标签添加到父级的子元素
      currentChildren.push(element);
    } 
    else if (token.type === 'text') {
      // 文本内容，添加到当前子元素
      currentChildren.push(`'${token.content.replace(/'/g, "\\'")}'`);
    }
  });
  
  // 最终应该只剩下一个根元素
  if (currentChildren.length !== 1) {
    throw new Error('JSX必须有一个根元素');
  }
  
  return currentChildren[0];
}

/**
 * 解析JSX属性字符串为对象字符串
 * 如 title="用户信息" label="姓名" 转为 title: '用户信息', label: '姓名'
 */
function parseAttributes(attrsString) {
  if (!attrsString || !attrsString.trim()) return '';
  
  const attrRegex = /(\w+)=["']([^"']*)["']/g;
  const attrs = [];
  let match;
  
  while ((match = attrRegex.exec(attrsString)) !== null) {
    const [_, name, value] = match;
    attrs.push(`${name}: '${value}'`);
  }
  
  return attrs.join(', ');
} 