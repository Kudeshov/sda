import React, { useState, useEffect, useRef } from 'react';

// кастомный хук для управления пагинацией и скроллингом
export const useGridScrollPagination = (apiRef, tableData, setRowSelectionModel) => {
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
    });

    const handleScrollToRow = React.useCallback((v_id) => {
        const sortedRowIds = apiRef.current.getSortedRowIds(); //получаем список отсортированных строк грида
        const index = sortedRowIds.indexOf(parseInt(v_id));    //ищем в нем номер нужной записи
        if (index !== -1) {
            const pageSize = paginationModel.pageSize; // определяем текущую страницу и индекс строки в этой странице
            const currentPage = paginationModel.page;
            const rowPageIndex = Math.floor(index / pageSize);
            if (currentPage !== rowPageIndex) { // проверяем, нужно ли изменять страницу
            apiRef.current.setPage(rowPageIndex);
            }
            setRowSelectionModel([v_id]); //это устанавливает фокус на выбранной строке (подсветка)
            setTimeout(function() {       //делаем таймаут в 0.1 секунды, иначе скроллинг тупит
            apiRef.current.scrollToIndexes({ rowIndex: index, colIndex: 0 });
            }, 100);
        }
    }, [apiRef, paginationModel, setRowSelectionModel]);

  const scrollToIndexRef = useRef(null); 

  useEffect(() => {
    //событие, которое вызовет скроллинг грида после изменения данных в tableData
    if (!scrollToIndexRef.current) return; //если значение не указано, то ничего не делаем
    if (scrollToIndexRef.current===-1) return;
    handleScrollToRow(scrollToIndexRef.current);
    scrollToIndexRef.current = null; //обнуляем значение
  }, [tableData, handleScrollToRow]);

  return { paginationModel, setPaginationModel, handleScrollToRow, scrollToIndexRef };
};
