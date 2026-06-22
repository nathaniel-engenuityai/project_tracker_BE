const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('project-tracker-avatars-889275799849');

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Extract userId from FormData
    const { userId } = req.body;

    // Verify that userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'userId field is required in FormData' });
    }

    // Verify that the authenticated user can only upload their own avatar
    if (req.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: Cannot upload avatar for another user' });
    }

    // Extract file extension from the original filename
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const filename = `users/${userId}/avatar.${fileExtension}`;
    const file = bucket.file(filename);

    // Upload file to GCS
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      resumable: false,
    });

    // Generate a signed URL (valid for 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: sevenDaysFromNow,
    });

    res.json({ url: signedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadAvatar };