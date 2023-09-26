// Функция для преобразования плоского списка в структуру дерева
export function listToTree(list, filterString = '') {
    const map = {};
    const roots = [];
  
    // Функция для фильтрации узлов дерева на основе строки фильтра
    function filterTree(tree, filterS) {
      return tree.filter(node => {
        // Если у узла есть дети, фильтруем детей
        if (node.children.length > 0) {
          node.children = filterTree(node.children, filterS);
        }
  
        // Оставляем узел, если у него есть дети после фильтрации 
        // ИЛИ если название узла или его name_rus соответствует строке фильтра
        return node.children.length > 0 || 
          node.title.toLowerCase().includes(filterS) ||
          (node.name_rus && node.name_rus.toLowerCase().includes(filterS));
      });
    }
  
    // Инициализируем карту и детей для каждого узла
    list.forEach((node, i) => {
      map[node.id] = i;
      node.children = [];
    });
  
    // Прикрепляем каждый узел к его родителю или добавляем его в корни
    list.forEach((node) => {
      if (node.parent_id && map[node.parent_id] !== undefined) {
        list[map[node.parent_id]].children.push(node);
      } else if (!node.parent_id) {
        roots.push(node);
      }
    });
  
    // Фильтруем узлы из дерева
    return filterTree(roots, filterString.toLowerCase());
  }

  export function findNextIdAfterDelete(currentId, treeData) {
    let previousNode = null;

    function traverseTree(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            console.log(`Checking node with ID: ${nodes[i].id}`);
            if (Number(nodes[i].id) === Number(currentId)) {
                console.log(`Found node with ID: ${nodes[i].id}`);
                
                if (i === 0 && previousNode) {
                    console.log(`Current node is the first child but not root. Returning previous node ID: ${previousNode.id}`);
                    return previousNode.id;
                } else if (i !== 0) {
                    console.log(`Returning previous node with ID: ${previousNode.id}`);
                    return previousNode.id;
                } else {
                    console.log(`Node is the root or an unmatched condition. Returning null.`);
                    return null;
                }
            }

            previousNode = nodes[i];

            if (nodes[i].children && nodes[i].children.length > 0) {
                console.log(`Node with ID: ${nodes[i].id} has children. Recursing...`);
                const result = traverseTree(nodes[i].children);
                if (result !== undefined) {
                    console.log(`Returning from child recursion with result: ${result}`);
                    return result;
                }
            }
        }
        console.log(`Finished checking all nodes at this level. Returning to parent level.`);
    }

    const finalResult = traverseTree(treeData);
    console.log(`Final result: ${finalResult}`);
    return finalResult;
}

export function findPreviousIdAfterDeleteChemComp(currentId, treeData) {
  let previousNode = null;
  let parentNode = null;

  function traverseTree(nodes) {
      for (let i = 0; i < nodes.length; i++) {
          if (Number(nodes[i].id) === Number(currentId)) {
              if (i === 0 && parentNode) {
                  // If it's the first child, return the parent's ID
                  return parentNode.id;
              } else if (i !== 0) {
                  // Return the ID of the previous node
                  return previousNode.id;
              }
          }

          previousNode = nodes[i];

          if (nodes[i].children && nodes[i].children.length > 0) {
              parentNode = nodes[i];
              const result = traverseTree(nodes[i].children);
              if (result !== undefined) {
                  return result;
              }
          }
      }
  }

  return traverseTree(treeData);
}