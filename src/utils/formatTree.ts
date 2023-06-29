export const convertToTree = (data) => {
  const tree = []
  const map = {}

  // 构建节点映射表
  data.forEach((node) => {
    map[node.id] = { ...node, children: [] }
  })

  // 构建树形结构
  data.forEach((node) => {
    const parent = map[node.parentId]
    if (parent) {
      parent.children.push({
        ...map[node.id],
        parentName:parent.projectName,
        isChild:true
      })
    } else {
      tree.push(map[node.id])
    }
  })

  return tree
}
