'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Создаем основные таблицы
        await queryInterface.createTable('Admins', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        });

        await queryInterface.createTable('Categories', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('Employees', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            full_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            position: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('Features', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('Properties', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            area: {
                type: Sequelize.FLOAT
            },
            rooms: {
                type: Sequelize.INTEGER
            },
            floor: {
                type: Sequelize.INTEGER
            },
            total_floors: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.TEXT
            },
            is_hidden: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            coordinates: {
                type: Sequelize.JSONB
            },
            category_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id'
                }
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        // 2. Создаем таблицы для связей
        await queryInterface.createTable('PropertyPhotos', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                }
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('Requests', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_phone: {
                type: Sequelize.STRING
            },
            theme: {
                type: Sequelize.ENUM('consultation', 'viewing', 'question'),
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT
            },
            status: {
                type: Sequelize.ENUM('new', 'processed', 'completed'),
                defaultValue: 'new'
            },
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                }
            },
            assigned_to: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Employees',
                    key: 'id'
                }
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('PropertyFeatures', {
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                }
            },
            feature_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Features',
                    key: 'id'
                }
            }
        });

        // 3. Добавляем индексы
        await queryInterface.addIndex('Properties', ['price']);
        await queryInterface.addIndex('Properties', ['area']);
        await queryInterface.addIndex('Properties', ['rooms']);
    },

    async down(queryInterface) {
        await queryInterface.dropAllTables();
    }
};