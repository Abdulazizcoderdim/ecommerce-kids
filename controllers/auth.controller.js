const authService = require('../service/auth.service');

class AuthController {
  async getUsers(req, res) {
    try {
      const users = await authService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const data = await authService.register(name, email, password);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async activation(req, res) {
    try {
      const { id } = req.params;
      await authService.activation(id);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const data = await authService.refresh(refreshToken);
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

module.exports = new AuthController();
