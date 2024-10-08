const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class FileService {
  save(file) {
    try {
      const fileName = uuidv4() + '.jpg';
      const currentDir = __dirname;
      const staticDir = path.join(currentDir, '..', 'static');
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir);
      }

      file.mv(filePath);

      return fileName;
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

module.exports = new FileService();