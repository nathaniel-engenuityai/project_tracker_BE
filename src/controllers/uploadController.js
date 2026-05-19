const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('project-tracker-avatars-889275799849');

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const filename = `avatars/${req.userId}-${Date.now()}`;
    const file = bucket.file(filename);

    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/project-tracker-avatars-889275799849/${filename}`;

    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadAvatar };