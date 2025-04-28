import React, { useState } from 'react';
import { FiPlus, FiRefreshCw, FiDownload, FiSearch, FiEdit, FiTrash2, FiFilter, FiInbox } from 'react-icons/fi';
import styles from './ListPage.module.scss';

const ListPage = ({
  title,
  subtitle,
  columns,
  data,
  isLoading,
  filters = [],
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onExport,
  onFilterChange,
  addButtonLabel = 'Добавить',
  emptyMessage = 'Нет данных для отображения'
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [displayFilters, setDisplayFilters] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    
    // Remove empty filters
    if (value === '') {
      delete newFilters[filterId];
    }
    
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Apply search filter
  const filteredData = data.filter(item => {
    return searchTerm === '' || 
      columns.some(column => {
        const value = item[column.id];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
  });
  
  // Render cell based on column configuration
  const renderCell = (item, column) => {
    const value = item[column.id];
    
    // If column has formatter, use it
    if (column.formatter) {
      const formattedValue = column.formatter(value, item);
      
      if (formattedValue === null || formattedValue === undefined) {
        return <span className={styles.emptyCell}>—</span>;
      }
      
      // Handle complex formatted values (objects)
      if (typeof formattedValue === 'object') {
        if (formattedValue.type === 'image') {
          return (
            <div className={styles.imageCell}>
              <img src={formattedValue.src} alt="" />
            </div>
          );
        } else if (formattedValue.type === 'enum') {
          return (
            <span className={`${styles.enumValue} ${styles[`enum${formattedValue.variant}`]}`}>
              {formattedValue.value}
            </span>
          );
        } else if (formattedValue.type === 'status') {
          return (
            <span className={`${styles.statusBadge} ${styles[formattedValue.status]}`}>
              {formattedValue.value}
            </span>
          );
        }
      }
      
      return formattedValue;
    }
    
    // Default rendering for simple values
    return value || <span className={styles.emptyCell}>—</span>;
  };
  
  // Render table skeleton while loading
  const renderSkeleton = () => {
    return Array(5).fill(0).map((_, rowIndex) => (
      <tr key={`skeleton-${rowIndex}`} className={styles.skeletonRow}>
        {columns.map((column, colIndex) => (
          <td key={`skeleton-${rowIndex}-${colIndex}`} style={{ width: column.width }}>
            <div className={styles.skeletonCell}></div>
          </td>
        ))}
        <td className={styles.actionsColumn}>
          <div className={styles.skeletonActions}></div>
        </td>
      </tr>
    ));
  };

  // Render empty state with icon
  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length + 1} className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <FiInbox size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p>{emptyMessage}</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className={styles.listPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.headerActions}>
            {onAdd && (
              <button className={`${styles.button} ${styles.primaryButton}`} onClick={onAdd}>
                <FiPlus /> {addButtonLabel}
              </button>
            )}
            {onRefresh && (
              <button className={`${styles.button} ${styles.iconButton}`} onClick={onRefresh} title="Обновить">
                <FiRefreshCw />
              </button>
            )}
            {onExport && (
              <button className={`${styles.button} ${styles.iconButton}`} onClick={onExport} title="Экспорт">
                <FiDownload />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.contentCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {filters.length > 0 && (
            <div className={styles.filtersToggle}>
              <button 
                className={`${styles.button} ${styles.filterButton} ${displayFilters ? styles.active : ''}`}
                onClick={() => setDisplayFilters(!displayFilters)}
              >
                <FiFilter /> Фильтры
              </button>
            </div>
          )}
        </div>
        
        {displayFilters && filters.length > 0 && (
          <div className={styles.filtersContainer}>
            <div className={styles.filtersGrid}>
              {filters.map(filter => (
                <div key={filter.id} className={styles.filterItem}>
                  <label className={styles.filterLabel}>{filter.label}</label>
                  {filter.type === 'select' ? (
                    <select
                      className={styles.filterSelect}
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type || 'text'}
                      className={styles.filterInput}
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      placeholder={filter.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column.id} style={{ width: column.width }}>
                    {column.label}
                  </th>
                ))}
                <th className={styles.actionsColumn}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                renderSkeleton()
              ) : filteredData.length === 0 ? (
                renderEmptyState()
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map(column => (
                      <td key={`${item.id || index}-${column.id}`} style={{ width: column.width }}>
                        {renderCell(item, column)}
                      </td>
                    ))}
                    <td className={styles.actionsColumn}>
                      {onEdit && (
                        <button 
                          className={`${styles.button} ${styles.iconButton} ${styles.smallButton}`} 
                          onClick={() => onEdit(item.id || item)}
                          title="Редактировать"
                        >
                          <FiEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className={`${styles.button} ${styles.iconButton} ${styles.smallButton} ${styles.dangerButton}`}
                          onClick={() => onDelete(item.id || item)}
                          title="Удалить"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListPage; 