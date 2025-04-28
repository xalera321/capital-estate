import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FiList, FiTag, FiMessageSquare, FiLogOut, FiPlus, FiArrowRight } from 'react-icons/fi';
import styles from './AdminHomePage.module.scss';
import api from '@/services/api';
import authService from '@/services/authService';
import { Link, useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    properties: 0,
    categories: 0,
    requests: 0,
    loading: true
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propertiesRes, categoriesRes, requestsRes] = await Promise.all([
          api.get('/properties/count'),
          api.get('/categories/count'),
          api.get('/requests/count')
        ]);
        
      setStats({
          properties: propertiesRes.data.count,
          categories: categoriesRes.data.count,
          requests: requestsRes.data.count,
        loading: false
      });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Resource cards
  const resourceCards = [
    {
      title: 'Объекты недвижимости',
      description: 'Управление объектами недвижимости',
      icon: <FiList />,
      color: '#4361ee',
      link: '/management/properties',
      count: stats.properties,
      addLink: '/management/properties/add',
      addText: 'Добавить объект'
    },
    {
      title: 'Категории',
      description: 'Управление категориями объектов',
      icon: <FiTag />,
      color: '#3a0ca3',
      link: '/management/categories',
      count: stats.categories,
      addLink: '/management/categories/add',
      addText: 'Добавить категорию'
    },
    {
      title: 'Заявки',
      description: 'Обработка поступивших заявок',
      icon: <FiMessageSquare />,
      color: '#f72585',
      link: '/management/requests',
      count: stats.requests,
      addLink: '/management/requests?status=new',
      addText: 'Новые заявки'
    }
  ];

  return (
    <div className={styles.adminHome}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1>Добро пожаловать, Администратор</h1>
        <p className={styles.welcomeText}>
            Панель управления Capital Estate
        </p>
        </div>
        <Button 
          variant="outline-danger" 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <FiLogOut /> <span className={styles.buttonText}>Выйти</span>
        </Button>
      </div>

      <div className={styles.statsOverview}>
        <h2 className={styles.sectionTitle}>Обзор</h2>
        <div className={styles.statsWrapper}>
        {resourceCards.map((card, index) => (
            <div className={styles.statCard} key={index}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: `${card.color}10` }}>
                <div className={styles.statIcon} style={{ color: card.color }}>
                      {card.icon}
                    </div>
                  </div>
              <div className={styles.statContent}>
                <div className={styles.statCounter}>
                    {stats.loading ? (
                      <div className={styles.skeleton}></div>
                    ) : (
                      <span>{card.count}</span>
                    )}
                  </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.statActions}>
                  <Link to={card.link} className={styles.viewAllLink}>
                    Управление <FiArrowRight />
                  </Link>
                  <Link to={card.addLink} className={styles.addItemLink}>
                    <FiPlus /> {card.addText}
                  </Link>
                </div>
              </div>
              </div>
          ))}
              </div>
              </div>
    </div>
  );
};

export default AdminHomePage; 