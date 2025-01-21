module.exports = (sequelize, DataTypes) => {
    const PropertyFeature = sequelize.define('PropertyFeature', {
        propertyId: DataTypes.INTEGER,
        featureId: DataTypes.INTEGER
    }, { timestamps: false });
    return PropertyFeature;
};