module.exports = class UserDto {
  id;
  name;
  email;
  isActivated;
  role;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.role = model.role;
  }
};
