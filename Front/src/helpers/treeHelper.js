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
  