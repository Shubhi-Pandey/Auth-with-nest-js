

export var editfilename=(req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files-${Date.now()}-${file.fieldname}.${ext}`);
  }