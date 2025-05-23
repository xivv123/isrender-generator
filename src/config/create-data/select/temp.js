// export default function () {
//   return () => {
//     <el-descriptions title="用户信息">
//       <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
//       <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
//       <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
//       <el-descriptions-item label="备注">
//         <el-tag size="small">学校</el-tag>
//       </el-descriptions-item>
//       <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
//     </el-descriptions>
//   }
// }

export default {
  __config__: {
    changeTag: true,
    layout: 'colFormItem',
    span: 24,
  },
  __template__ : () => {
    <el-descriptions title="用户信息">
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>
  }
} 