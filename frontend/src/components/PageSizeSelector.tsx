import React from 'react';

interface PageSizeSelectorProps {
  booksPerPage: number;
  onChangePageSize: (size: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  booksPerPage,
  onChangePageSize,
}) => {
  return (
    <div className="form-inline">
      <label className="me-2">Books per page:</label>
      <select
        className="form-select form-select-sm"
        value={booksPerPage}
        onChange={(e) => onChangePageSize(Number(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};

export default PageSizeSelector;
