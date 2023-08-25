import React, { useState, useEffect, useRef } from 'react';

// кастомный хук для управления пагинацией и скроллингом
export const useGridScrollPagination = (apiRef, tableData, setRowSelectionModel) => {
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 50, // Размер страницы
        page: 0, // Текущая страница
    });

    const handleScrollToRow = React.useCallback((v_id) => {
        const sortedRowIds = apiRef.current.getSortedRowIds();
        const index = sortedRowIds.indexOf(parseInt(v_id)); // Получение индекса строки в отсортированных данных
        if (index !== -1) {
            const pageSize = paginationModel.pageSize; // Размер страницы
            const currentPage = paginationModel.page; // Текущая страница
            const rowPageIndex = Math.floor(index / pageSize); // Индекс страницы, на которой находится строка

            if (currentPage !== rowPageIndex) {
                setPaginationModel((prevModel) => ({ ...prevModel, page: rowPageIndex })); // Обновление текущей страницы пагинации
            }
            setRowSelectionModel([v_id]); // Выбор строки
            setTimeout(function() {
                //console.log(handleScrollToRow, 'index set', index );
                apiRef.current.scrollToIndexes({ rowIndex: index, colIndex: 0 }); // Прокрутка к строке
            }, 100);
        }
    }, [apiRef, paginationModel, setRowSelectionModel]);

    const scrollToIndexRef = useRef(null);

    useEffect(() => {
        if (!scrollToIndexRef.current) return;
        if (scrollToIndexRef.current === -1) return;

        handleScrollToRow(scrollToIndexRef.current); // Обработка прокрутки к указанной строке
        scrollToIndexRef.current = null;
    }, [tableData, handleScrollToRow, paginationModel]);

    return { paginationModel, setPaginationModel, handleScrollToRow, scrollToIndexRef };
};
