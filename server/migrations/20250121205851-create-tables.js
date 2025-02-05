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
            operation_type: {
                type: Sequelize.ENUM('buy', 'rent'),
                allowNull: false,
                defaultValue: 'buy'
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            district: {
                type: Sequelize.STRING
            },
            area: {
                type: Sequelize.FLOAT,
                validate: { min: 0 }
            },
            rooms: {
                type: Sequelize.INTEGER,
                validate: { min: 0 }
            },
            floor: {
                type: Sequelize.INTEGER,
                validate: { min: 0 }
            },
            total_floors: {
                type: Sequelize.INTEGER,
                validate: { min: 1 }
            },
            description: {
                type: Sequelize.TEXT
            },
            is_hidden: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            coordinates: {
                type: Sequelize.JSONB,
                validate: {
                    isValid(value) {
                        if (typeof value !== 'object' || !value?.lat || !value?.lng) {
                            throw new Error('Invalid coordinates');
                        }
                    }
                }
            },
            category_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id'
                },
                onDelete: 'SET NULL'
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
                allowNull: false,
                validate: { isUrl: true }
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                validate: { min: 0 }
            },
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                },
                onDelete: 'CASCADE'
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
            user_phone: {
                type: Sequelize.STRING,
                validate: {
                    is: /^\+?[0-9]{7,15}$/
                }
            },
            message: {
                type: Sequelize.TEXT,
                validate: { len: [0, 1000] }
            },
            status: {
                type: Sequelize.ENUM('new', 'in_progress', 'completed'),
                defaultValue: 'new'
            },
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE }
        });

        await queryInterface.createTable('Feedback', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: 'Имя обязательно' }
                }
            },
            phone: {
                type: Sequelize.STRING,
                validate: {
                    is: {
                        args: /^\+?[0-9]{7,15}$/,
                        msg: 'Некорректный формат телефона'
                    }
                }
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: {
                        msg: 'Некорректный формат email'
                    }
                }
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
                validate: {
                    len: {
                        args: [10, 2000],
                        msg: 'Сообщение должно быть от 10 до 2000 символов'
                    }
                }
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

        await queryInterface.createTable('PropertyFeatures', {
            property_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Properties',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            feature_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Features',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        // 3. Добавляем индексы
        await queryInterface.addIndex('Properties', ['price']);
        await queryInterface.addIndex('Properties', ['area']);
        await queryInterface.addIndex('Properties', ['rooms']);
        await queryInterface.addIndex('Properties', ['is_hidden']);
        await queryInterface.addIndex('Feedback', ['email']);
        await queryInterface.addIndex('Feedback', ['phone']);
    },

    async down(queryInterface) {
        await queryInterface.dropAllTables();
    }
};