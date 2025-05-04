import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiList, FiGrid, FiMessageSquare } from 'react-icons/fi';
import { Header } from '@/components/common/Header/Header';
import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
  // Отслеживаем состояние прокрутки для адаптации sidebar
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation items with their paths and icons
  const navItems = [
    { path: '/management', icon: <FiHome />, label: 'Главная', exact: true },
    { path: '/management/properties', icon: <FiList />, label: 'Объекты' },
    { path: '/management/categories', icon: <FiGrid />, label: 'Категории' },
    { path: '/management/requests', icon: <FiMessageSquare />, label: 'Заявки' },
  ];

  // Эффект для отслеживания прокрутки
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Начальная проверка при монтировании
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${styles.adminLayout} ${isScrolled ? styles.scrolled : ''}`}>
      <Header />
      
      <div className={`${styles.sidebar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={`${styles.contentWrapper} ${isScrolled ? styles.scrolled : ''}`}>
        <main className={styles.content}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;