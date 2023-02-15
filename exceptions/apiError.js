class ApiErorr extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnathorizedError() {
    return new ApiErorr(401, "Пользователь не авторизован");
  }

  static BadRequest(message, errors = []) {
    return new ApiErorr(400, message, errors);
  }
}

export default ApiErorr;