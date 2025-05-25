'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Таблица Admins
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
            twoFactorSecret: {
                type: Sequelize.STRING,
                allowNull: true
            },
            twoFactorEnabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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

        // Таблица Categories
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

        // Таблица Features
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

        // Таблица Properties
        await queryInterface.createTable('Properties', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            address: {
                type: Sequelize.STRING,
                allowNull: true
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
                        if (typeof value !== 'object' || value === null ||
                            typeof value.lat !== 'number' || typeof value.lng !== 'number') {
                            throw new Error('Invalid coordinates format');
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

        // Таблица PropertyPhotos
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

        // Таблица Requests
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
            user_email: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'placeholder@example.com',
                validate: {
                    isEmail: true
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

        // Таблица Feedback
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
            status: {
                type: Sequelize.ENUM('new', 'in_progress', 'resolved'),
                allowNull: false,
                defaultValue: 'new'
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

        // Таблица PropertyFeatures (для связи многие-ко-многим Properties и Features)
        await queryInterface.createTable('PropertyFeatures', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            property_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                allowNull: false
            },
            feature_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Features',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                allowNull: false
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('PropertyFeatures');
        await queryInterface.dropTable('Feedback');
        await queryInterface.dropTable('Requests');
        await queryInterface.dropTable('PropertyPhotos');
        await queryInterface.dropTable('Properties');
        await queryInterface.dropTable('Features');
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Admins');
    }
}; 